import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma.js";
import AppError from "../../errorHelpers/AppError.js";
import QueryBuilder from "../../utils/QueryBuilder.js";
import { commentSearchableFields, commentFilterableFields } from "./comment.constant.js";
import { ICreateComment, IUpdateComment, ICommentNode } from "./comment.interface.js";
import { IQueryParams } from "../../interfaces/query.interface.js";

const buildCommentTree = (comments: ICommentNode[]): ICommentNode[] => {
  const map = new Map<string, ICommentNode>();
  const roots: ICommentNode[] = [];

  for (const comment of comments) {
    map.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of map.values()) {
    if (comment.parentId && map.has(comment.parentId)) {
      map.get(comment.parentId)!.replies.push(comment);
    } else {
      roots.push(comment);
    }
  }

  return roots;
};

export const CommentService = {
  create: async (authorId: string, payload: ICreateComment) => {
    const idea = await prisma.idea.findUnique({ where: { id: payload.ideaId } });
    if (!idea || idea.status !== "APPROVED") {
      throw new AppError(StatusCodes.NOT_FOUND, "Idea not found");
    }

    if (payload.parentId) {
      const parent = await prisma.comment.findUnique({ where: { id: payload.parentId } });
      if (!parent || parent.ideaId !== payload.ideaId) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Invalid parent comment");
      }
    }

    const newComment = await prisma.comment.create({
      data: {
        content: payload.content,
        ideaId: payload.ideaId,
        authorId,
        parentId: payload.parentId,
      },
      include: { author: { select: { id: true, name: true, email: true, image: true } } },
    });

    // Determine notification recipient
    const recipientId = payload.parentId 
      ? (await prisma.comment.findUnique({ where: { id: payload.parentId } }))?.authorId
      : idea.authorId;

    if (recipientId && recipientId !== authorId) {
      await prisma.notification.create({
        data: {
          userId: recipientId,
          title: payload.parentId ? "New Reply to Your Comment" : "New Comment on Your Idea",
          message: `${newComment.author.name} replied: "${payload.content.substring(0, 50)}..."`,
          link: `/ideas/${idea.id}`
        }
      });
    }

    return newComment;
  },

  getAll: async (query: IQueryParams) => {
    const qb = new QueryBuilder(prisma.comment, query, {
      searchableFields: commentSearchableFields,
      filterableFields: commentFilterableFields,
    });
    const { data, meta } = await qb.search().filter().paginate().sort().execute();
    const total = await qb.count();

    const ids = (data as Array<{ id: string }>).map((c) => c.id);
    const comments = await prisma.comment.findMany({
      where: { id: { in: ids } },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    const transformed = comments.map((comment) => ({
      ...comment,
      content: comment.isDeleted ? "[deleted]" : comment.content,
      replies: [],
    })) as ICommentNode[];

    return {
      data: buildCommentTree(transformed),
      meta: { ...meta, total, totalPages: Math.ceil(total / meta.limit) },
    };
  },

  update: async (id: string, userId: string, payload: IUpdateComment) => {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new AppError(StatusCodes.NOT_FOUND, "Comment not found");
    if (comment.authorId !== userId) {
      throw new AppError(StatusCodes.FORBIDDEN, "Not authorized to edit this comment");
    }
    if (comment.isDeleted) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Deleted comments cannot be edited");
    }
    return prisma.comment.update({ where: { id }, data: payload });
  },

  remove: async (id: string, userId: string, role: string) => {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new AppError(StatusCodes.NOT_FOUND, "Comment not found");
    if (role !== "ADMIN" && comment.authorId !== userId) {
      throw new AppError(StatusCodes.FORBIDDEN, "Not authorized to delete this comment");
    }
    return prisma.comment.update({
      where: { id },
      data: { isDeleted: true, content: "[deleted]" },
    });
  },
};
