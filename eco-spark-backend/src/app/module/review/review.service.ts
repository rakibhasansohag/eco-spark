import prisma from "../../lib/prisma.js";
import QueryBuilder from "../../utils/QueryBuilder.js";

export const ReviewService = {
  create: async (payload: any) => {
    return prisma.review.create({ data: payload });
  },
  getAll: async (query: any) => {
    const qb = new QueryBuilder(prisma.review, query, {
      searchableFields: [],
      filterableFields: ["ideaId", "userId"],
    });
    const { data, meta } = await qb.search().filter().paginate().sort().include().execute();
    const total = await qb.count();
    return { data, meta: { ...meta, total, totalPages: Math.ceil(total / meta.limit) } };
  },
};
