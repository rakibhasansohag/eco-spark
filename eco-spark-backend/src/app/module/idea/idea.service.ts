import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma.js";
import AppError from "../../errorHelpers/AppError.js";
import QueryBuilder from "../../utils/QueryBuilder.js";
import { ideaSearchableFields, ideaFilterableFields } from "./idea.constant.js";
import { ICreateIdea, IUpdateIdea, IRejectIdea } from "./idea.interface.js";
import { IdeaStatus, Prisma, Role } from "../../../generated/prisma/index.js";
import { canViewFullContent, assertIdeaIsEditable, uploadManyImages } from "./idea.utils.js";
import { IQueryParams } from "../../interfaces/query.interface.js";

const ideaInclude = {
  author: { select: { id: true, name: true, email: true, image: true } },
  category: true,
  images: true,
  _count: { select: { votes: true, comments: true } },
} as const;

interface IGeneratedIdea {
  title: string;
  problemStatement: string;
  proposedSolution: string;
  description: string;
  category: string;
}

export const IdeaService = {
  create: async (
    authorId: string,
    payload: ICreateIdea,
    files: Express.Multer.File[]
  ) => {
    const imageUrls = files.length > 0 ? await uploadManyImages(files) : [];

    return prisma.$transaction(async (tx) => {
      const idea = await tx.idea.create({
        data: {
          title: payload.title,
          problemStatement: payload.problemStatement,
          proposedSolution: payload.proposedSolution,
          description: payload.description,
          targetAudience: payload.targetAudience,
          implementationStage: payload.implementationStage,
          estimatedBudgetMin:
            payload.estimatedBudgetMin != null ? new Prisma.Decimal(payload.estimatedBudgetMin) : null,
          estimatedBudgetMax:
            payload.estimatedBudgetMax != null ? new Prisma.Decimal(payload.estimatedBudgetMax) : null,
          timelineWeeks: payload.timelineWeeks,
          locationScope: payload.locationScope,
          expectedImpact: payload.expectedImpact,
          risksAndMitigation: payload.risksAndMitigation,
          externalLinks: payload.externalLinks ?? [],
          categoryId: payload.categoryId,
          isPaid: payload.isPaid ?? false,
          price: payload.price != null ? new Prisma.Decimal(payload.price) : null,
          authorId,
          status: IdeaStatus.DRAFT,
        },
      });

      if (imageUrls.length > 0) {
        await tx.ideaImage.createMany({
          data: imageUrls.map((url) => ({ url, ideaId: idea.id })),
        });
      }

      return tx.idea.findUniqueOrThrow({
        where: { id: idea.id },
        include: ideaInclude,
      });
    });
  },

  getAll: async (query: IQueryParams, requestUserId?: string, requestUserRole?: string) => {
    const qb = new QueryBuilder(
      prisma.idea,
      { ...query, status: IdeaStatus.APPROVED },
      { searchableFields: ideaSearchableFields, filterableFields: ideaFilterableFields }
    );
    const { data, meta } = await qb.search().filter().paginate().sort().execute();
    const total = await qb.count();

    const ideas = data as Array<{
      id: string;
      isPaid: boolean;
      authorId: string;
      status: IdeaStatus;
      description: string;
      proposedSolution: string;
    }>;

    const enriched = await Promise.all(
      ideas.map(async (idea) => {
        if (!idea.isPaid) return { ...idea, isLocked: false };

        let hasAccess = false;
        if (requestUserId) {
          const access = await prisma.ideaAccess.findUnique({
            where: { userId_ideaId: { userId: requestUserId, ideaId: idea.id } },
          });
          hasAccess = !!access;
        }

        const unlocked = canViewFullContent(idea, requestUserId, requestUserRole, hasAccess);
        if (!unlocked) {
          const { description: _d, proposedSolution: _ps, ...teaser } = idea;
          return { ...teaser, description: null, proposedSolution: null, isLocked: true };
        }
        return { ...idea, isLocked: false };
      })
    );

    return { data: enriched, meta: { ...meta, total, totalPages: Math.ceil(total / meta.limit) } };
  },

  getAllForAdmin: async (query: IQueryParams) => {
    const qb = new QueryBuilder(prisma.idea, query, {
      searchableFields: ideaSearchableFields,
      filterableFields: ideaFilterableFields,
    });
    const { data, meta } = await qb.search().filter().paginate().sort().execute();
    const total = await qb.count();
    return { data, meta: { ...meta, total, totalPages: Math.ceil(total / meta.limit) } };
  },

  getMyIdeas: async (authorId: string, query: IQueryParams) => {
    const qb = new QueryBuilder(
      prisma.idea,
      { ...query, authorId },
      { searchableFields: ideaSearchableFields, filterableFields: ideaFilterableFields }
    );
    const { data, meta } = await qb.search().filter().paginate().sort().execute();
    const total = await qb.count();
    return { data, meta: { ...meta, total, totalPages: Math.ceil(total / meta.limit) } };
  },

  getById: async (
    id: string,
    requestUserId?: string,
    requestUserRole?: string
  ) => {
    const idea = await prisma.idea.findUnique({
      where: { id },
      include: {
        ...ideaInclude,
        votes: requestUserId
          ? { where: { userId: requestUserId }, select: { type: true } }
          : false,
      },
    });

    if (!idea) throw new AppError(StatusCodes.NOT_FOUND, "Idea not found");

    // Non-APPROVED ideas are visible only to author or admin
    if (idea.status !== IdeaStatus.APPROVED) {
      if (idea.authorId !== requestUserId && requestUserRole !== Role.ADMIN) {
        throw new AppError(StatusCodes.NOT_FOUND, "Idea not found");
      }
    }

    // Check paid access
    let hasAccess = false;
    if (requestUserId && idea.isPaid) {
      const access = await prisma.ideaAccess.findUnique({
        where: { userId_ideaId: { userId: requestUserId, ideaId: id } },
      });
      hasAccess = !!access;
    }

    const unlocked = canViewFullContent(idea, requestUserId, requestUserRole, hasAccess);

    // rejectionFeedback visible only to author or admin
    const rejectionFeedback =
      idea.authorId === requestUserId || requestUserRole === Role.ADMIN
        ? idea.rejectionFeedback
        : null;

    if (!unlocked) {
      return {
        ...idea,
        description: null,
        proposedSolution: null,
        rejectionFeedback,
        isLocked: true,
        price: idea.price,
      };
    }

    return { ...idea, rejectionFeedback, isLocked: false };
  },

  update: async (
    id: string,
    authorId: string,
    payload: IUpdateIdea,
    files: Express.Multer.File[]
  ) => {
    const idea = await prisma.idea.findUnique({ where: { id } });
    if (!idea) throw new AppError(StatusCodes.NOT_FOUND, "Idea not found");
    if (idea.authorId !== authorId) throw new AppError(StatusCodes.FORBIDDEN, "Not authorized");
    assertIdeaIsEditable(idea.status);

    const imageUrls = files.length > 0 ? await uploadManyImages(files) : [];

    return prisma.$transaction(async (tx) => {
      const updated = await tx.idea.update({
        where: { id },
        data: {
          ...payload,
          estimatedBudgetMin:
            payload.estimatedBudgetMin != null
              ? new Prisma.Decimal(payload.estimatedBudgetMin)
              : undefined,
          estimatedBudgetMax:
            payload.estimatedBudgetMax != null
              ? new Prisma.Decimal(payload.estimatedBudgetMax)
              : undefined,
          price: payload.price != null ? new Prisma.Decimal(payload.price) : undefined,
        },
        include: ideaInclude,
      });

      if (imageUrls.length > 0) {
        await tx.ideaImage.createMany({
          data: imageUrls.map((url) => ({ url, ideaId: id })),
        });
      }

      return updated;
    });
  },

  remove: async (id: string, actorId: string, actorRole?: string) => {
    const idea = await prisma.idea.findUnique({ where: { id } });
    if (!idea) throw new AppError(StatusCodes.NOT_FOUND, "Idea not found");
    if (actorRole !== "ADMIN") {
      if (idea.authorId !== actorId) throw new AppError(StatusCodes.FORBIDDEN, "Not authorized");
      assertIdeaIsEditable(idea.status);
    }
    return prisma.idea.delete({ where: { id } });
  },

  submit: async (id: string, authorId: string) => {
    const idea = await prisma.idea.findUnique({ where: { id } });
    if (!idea) throw new AppError(StatusCodes.NOT_FOUND, "Idea not found");
    if (idea.authorId !== authorId) throw new AppError(StatusCodes.FORBIDDEN, "Not authorized");
    if (idea.status !== IdeaStatus.DRAFT && idea.status !== IdeaStatus.REJECTED) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Only DRAFT or REJECTED ideas can be submitted");
    }
    return prisma.idea.update({ where: { id }, data: { status: IdeaStatus.UNDER_REVIEW } });
  },

  approve: async (id: string) => {
    const idea = await prisma.idea.findUnique({ where: { id } });
    if (!idea) throw new AppError(StatusCodes.NOT_FOUND, "Idea not found");
    if (idea.status !== IdeaStatus.UNDER_REVIEW) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Only UNDER_REVIEW ideas can be approved");
    }
    return prisma.idea.update({
      where: { id },
      data: { status: IdeaStatus.APPROVED, rejectionFeedback: null },
    });
  },

  reject: async (id: string, payload: IRejectIdea) => {
    const idea = await prisma.idea.findUnique({ where: { id } });
    if (!idea) throw new AppError(StatusCodes.NOT_FOUND, "Idea not found");
    if (idea.status !== IdeaStatus.UNDER_REVIEW) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Only UNDER_REVIEW ideas can be rejected");
    }
    return prisma.idea.update({
      where: { id },
      data: { status: IdeaStatus.REJECTED, rejectionFeedback: payload.rejectionFeedback },
    });
  },

  autoSeed: async (adminUserId: string) => {
    const { envVars } = await import("../../config/env.js");
    if (!envVars.GEMINI_API_KEY) {
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "GEMINI_API_KEY is not configured.");
    }

    const categories = await prisma.category.findMany();
    if (categories.length === 0) throw new AppError(StatusCodes.BAD_REQUEST, "No categories exist.");
    const categoryNames = categories.map(c => c.name).join(", ");

    const prompt = `Generate exactly 3 unique, high-quality, practical sustainability project ideas. Return strictly valid JSON array of objects.
Each object must have the following properties:
- title: string
- problemStatement: string (1-2 sentences)
- proposedSolution: string (2-3 sentences)
- description: string (Markdown formatted with bullet points)
- category: string (Must be exactly one of: ${categoryNames})
Do not wrap the array in markdown code blocks like \`\`\`json, return just the array string.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${envVars.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.8,
        }
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Gemini API Error:", JSON.stringify(err, null, 2));
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "AI Seeding failed. Check API key and quota.");
    }

    const jsonResponse = await response.json();
    let text = jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "AI did not return any ideas.");
    }

    // Strip markdown code blocks if the AI included them despite instructions
    text = text.replace(/```json\s?/, "").replace(/```\s?/, "").trim();

    let generatedIdeas: IGeneratedIdea[];
    try {
      generatedIdeas = JSON.parse(text) as IGeneratedIdea[];
    } catch (err) {
      console.error("Parse Error:", text);
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "AI output was not valid JSON.");
    }

    const createdIdeas = [];
    for (const idea of generatedIdeas) {
      const cat = categories.find(c => c.name.toLowerCase() === idea.category.toLowerCase()) || categories[0];
      const newIdea = await prisma.idea.create({
        data: {
          title: idea.title,
          problemStatement: idea.problemStatement,
          proposedSolution: idea.proposedSolution,
          description: idea.description,
          authorId: adminUserId,
          categoryId: cat.id,
          status: IdeaStatus.APPROVED,
          isPaid: false
        }
      });
      createdIdeas.push(newIdea);
    }

    return createdIdeas;
  },
};
