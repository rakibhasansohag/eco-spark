import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma.js";
import AppError from "../../errorHelpers/AppError.js";
import QueryBuilder from "../../utils/QueryBuilder.js";
import { categorySearchableFields, categoryFilterableFields } from "./category.constant.js";
import { ICreateCategory, IUpdateCategory } from "./category.interface.js";
import { IQueryParams } from "../../interfaces/query.interface.js";

const toSlug = (name: string): string =>
  name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export const CategoryService = {
  create: async (payload: ICreateCategory) => {
    const slug = payload.slug ?? toSlug(payload.name);
    return prisma.category.create({ data: { name: payload.name, slug } });
  },

  getAll: async (query: IQueryParams) => {
    const qb = new QueryBuilder(prisma.category, query, {
      searchableFields: categorySearchableFields,
      filterableFields: categoryFilterableFields,
    });
    const { data, meta } = await qb.search().filter().paginate().sort().execute();
    const total = await qb.count();
    return { data, meta: { ...meta, total, totalPages: Math.ceil(total / meta.limit) } };
  },

  getById: async (id: string) => {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
    return category;
  },

  update: async (id: string, payload: IUpdateCategory) => {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new AppError(StatusCodes.NOT_FOUND, "Category not found");

    const data: IUpdateCategory = { ...payload };
    if (payload.name && !payload.slug) {
      data.slug = toSlug(payload.name);
    }

    return prisma.category.update({ where: { id }, data });
  },

  remove: async (id: string) => {
    const category = await prisma.category.findUnique({ where: { id }, include: { _count: { select: { ideas: true } } } });
    if (!category) throw new AppError(StatusCodes.NOT_FOUND, "Category not found");
    if ((category as typeof category & { _count: { ideas: number } })._count.ideas > 0) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Cannot delete a category that has ideas");
    }
    return prisma.category.delete({ where: { id } });
  },
};
