import prisma from "../../lib/prisma.js";
import QueryBuilder from "../../utils/QueryBuilder.js";
import { IQueryParams } from "../../interfaces/query.interface.js";

export const WatchlistService = {
  create: async (payload: { ideaId: string; userId: string }) => {
    return prisma.watchlist.create({ data: payload });
  },
  getAll: async (query: IQueryParams) => {
    const qb = new QueryBuilder(prisma.watchlist, query, {
      searchableFields: [],
      filterableFields: ["userId", "ideaId"],
    });

    // We hardcode the include for the idea details so the frontend can render Idea Cards
    const { data, meta } = await qb
      .search()
      .filter()
      .paginate()
      .sort()
      .execute();

    // Enriched with idea data
    const enrichedData = await Promise.all(
      data.map(async (item: any) => {
        const idea = await prisma.idea.findUnique({
          where: { id: item.ideaId },
          include: {
            author: { select: { id: true, name: true, email: true, image: true } },
            category: true,
            images: true,
            _count: { select: { votes: true, comments: true } },
          },
        });
        return { ...item, idea };
      })
    );

    const total = await qb.count();
    return { data: enrichedData, meta: { ...meta, total, totalPages: Math.ceil(total / meta.limit) } };
  },
  remove: async (id: string, userId: string) => {
    return prisma.watchlist.delete({ where: { id, userId } });
  },
};
