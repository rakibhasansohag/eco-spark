import prisma from "../../lib/prisma.js";
import QueryBuilder from "../../utils/QueryBuilder.js";
import { ideaAccessSearchableFields, ideaAccessFilterableFields } from "./ideaAccess.constant.js";
import { IQueryParams } from "../../interfaces/query.interface.js";

export const IdeaAccessService = {
  getMyAccesses: async (userId: string, query: IQueryParams) => {
    const qb = new QueryBuilder(
      prisma.ideaAccess,
      { ...query, userId },
      { searchableFields: ideaAccessSearchableFields, filterableFields: ideaAccessFilterableFields }
    );
    const { data, meta } = await qb.search().filter().paginate().sort().execute();
    const total = await qb.count();
    return { data, meta: { ...meta, total, totalPages: Math.ceil(total / meta.limit) } };
  },

  checkAccess: async (userId: string, ideaId: string) => {
    const access = await prisma.ideaAccess.findUnique({
      where: { userId_ideaId: { userId, ideaId } },
    });
    return { hasAccess: !!access };
  },
};
