import prisma from "../../lib/prisma.js";
import { IdeaStatus } from "../../../generated/prisma/index.js";

export const DashboardService = {
  getAdminStats: async () => {
    const [totalMembers, totalIdeas, approvedIdeas, pendingIdeas, underReviewIdeas, rejectedIdeas] =
      await Promise.all([
        prisma.user.count({ where: { role: "MEMBER" } }),
        prisma.idea.count(),
        prisma.idea.count({ where: { status: IdeaStatus.APPROVED } }),
        prisma.idea.count({ where: { status: IdeaStatus.PENDING } }),
        prisma.idea.count({ where: { status: IdeaStatus.UNDER_REVIEW } }),
        prisma.idea.count({ where: { status: IdeaStatus.REJECTED } }),
      ]);

    return {
      totalMembers,
      totalIdeas,
      ideasByStatus: {
        approved: approvedIdeas,
        pending: pendingIdeas,
        underReview: underReviewIdeas,
        rejected: rejectedIdeas,
      },
    };
  },

  getMemberStats: async (userId: string) => {
    const [totalIdeas, approvedIdeas, pendingIdeas, rejectedIdeas, totalVotesReceived, totalCommentsReceived] =
      await Promise.all([
        prisma.idea.count({ where: { authorId: userId } }),
        prisma.idea.count({ where: { authorId: userId, status: IdeaStatus.APPROVED } }),
        prisma.idea.count({
          where: { authorId: userId, status: { in: [IdeaStatus.PENDING, IdeaStatus.UNDER_REVIEW] } },
        }),
        prisma.idea.count({ where: { authorId: userId, status: IdeaStatus.REJECTED } }),
        prisma.vote.count({ where: { idea: { authorId: userId } } }),
        prisma.comment.count({ where: { idea: { authorId: userId } } }),
      ]);

    return {
      totalIdeas,
      ideasByStatus: {
        approved: approvedIdeas,
        pending: pendingIdeas,
        rejected: rejectedIdeas,
      },
      totalVotesReceived,
      totalCommentsReceived,
    };
  },
};
