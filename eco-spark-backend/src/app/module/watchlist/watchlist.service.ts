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
    const { data, meta } = await qb.search().filter().paginate().sort().execute();
    const total = await qb.count();
    return { data, meta: { ...meta, total, totalPages: Math.ceil(total / meta.limit) } };
  },
  remove: async (id: string, userId: string) => {
    return prisma.watchlist.delete({ where: { id, userId } });
  },
};
