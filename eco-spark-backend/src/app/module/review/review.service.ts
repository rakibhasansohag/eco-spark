import prisma from "../../lib/prisma.js";
import QueryBuilder from "../../utils/QueryBuilder.js";
import AppError from "../../errorHelpers/AppError.js";
import { StatusCodes } from "http-status-codes";
import { IQueryParams } from "../../interfaces/query.interface.js";

interface ICreateReview {
  ideaId: string;
  userId: string;
  rating: number;
  effectiveness: number;
  experience: string;
}

export const ReviewService = {
  create: async (payload: ICreateReview) => {
    // Check for existing review (unique constraint: userId + ideaId)
    const existing = await prisma.review.findUnique({
      where: { userId_ideaId: { userId: payload.userId, ideaId: payload.ideaId } },
    });
    if (existing) {
      throw new AppError(StatusCodes.CONFLICT, "You have already reviewed this idea.");
    }
    return prisma.review.create({
      data: {
        ideaId: payload.ideaId,
        userId: payload.userId,
        rating: payload.rating,
        effectiveness: payload.effectiveness,
        experience: payload.experience,
      },
    });
  },
  getAll: async (query: IQueryParams) => {
    const qb = new QueryBuilder(prisma.review, query, {
      searchableFields: [],
      filterableFields: ["ideaId", "userId"],
    });
    const { data, meta } = await qb.search().filter().paginate().sort().execute();
    const total = await qb.count();
    return { data, meta: { ...meta, total, totalPages: Math.ceil(total / meta.limit) } };
  },
};
