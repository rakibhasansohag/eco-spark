import prisma from "../../lib/prisma.js";

export const NotificationService = {
  create: async (payload: { userId: string; title: string; message: string; link?: string }) => {
    return prisma.notification.create({ data: payload });
  },

  getAll: async (userId: string) => {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20
    });
  },

  markAsRead: async (id: string, userId: string) => {
    return prisma.notification.update({
      where: { id, userId },
      data: { isRead: true }
    });
  },

  getUnreadCount: async (userId: string) => {
    return prisma.notification.count({
      where: { userId, isRead: false }
    });
  }
};
