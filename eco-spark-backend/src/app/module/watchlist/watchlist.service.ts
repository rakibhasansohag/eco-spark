import prisma from "../../lib/prisma.js";
import QueryBuilder from "../../utils/QueryBuilder.js";

export const WatchlistService = {
  create: async (payload: any) => {
    return prisma.watchlist.create({ data: payload });
  },
  getAll: async (query: any) => {
    const qb = new QueryBuilder(prisma.watchlist, query, {
      searchableFields: [],
      filterableFields: ["userId", "ideaId"],
    });
    const { data, meta } = await qb.search().filter().paginate().sort().include().execute();
    const total = await qb.count();
    return { data, meta: { ...meta, total, totalPages: Math.ceil(total / meta.limit) } };
  },
  remove: async (id: string, userId: string) => {
    return prisma.watchlist.delete({ where: { id, userId } });
  },
};
