import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma.js";
import AppError from "../../errorHelpers/AppError.js";
import { VoteType } from "../../../generated/prisma/index.js";
import { ICreateVote } from "./vote.interface.js";

export const VoteService = {
  castOrSwitch: async (userId: string, payload: ICreateVote) => {
    const idea = await prisma.idea.findUnique({ where: { id: payload.ideaId } });
    if (!idea || idea.status !== "APPROVED") {
      throw new AppError(StatusCodes.NOT_FOUND, "Idea not found");
    }

    const vote = await prisma.vote.upsert({
      where: { userId_ideaId: { userId, ideaId: payload.ideaId } },
      update: { type: payload.type },
      create: { userId, ideaId: payload.ideaId, type: payload.type },
    });

    return vote;
  },

  remove: async (userId: string, ideaId: string) => {
    const vote = await prisma.vote.findUnique({
      where: { userId_ideaId: { userId, ideaId } },
    });
    if (!vote) {
      throw new AppError(StatusCodes.NOT_FOUND, "Vote not found");
    }
    return prisma.vote.delete({ where: { userId_ideaId: { userId, ideaId } } });
  },

  getCounts: async (ideaId: string, userId?: string) => {
    const [upvotes, downvotes, userVote] = await Promise.all([
      prisma.vote.count({ where: { ideaId, type: VoteType.UPVOTE } }),
      prisma.vote.count({ where: { ideaId, type: VoteType.DOWNVOTE } }),
      userId
        ? prisma.vote.findUnique({
            where: { userId_ideaId: { userId, ideaId } },
            select: { type: true },
          })
        : Promise.resolve(null),
    ]);

    return {
      upvotes,
      downvotes,
      userVote: userVote?.type ?? null,
    };
  },
};
