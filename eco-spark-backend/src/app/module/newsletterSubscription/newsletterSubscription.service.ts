import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma.js";
import AppError from "../../errorHelpers/AppError.js";
import QueryBuilder from "../../utils/QueryBuilder.js";
import {
  newsletterSubscriptionSearchableFields,
  newsletterSubscriptionFilterableFields,
} from "./newsletterSubscription.constant.js";
import { ICreateNewsletterSubscription } from "./newsletterSubscription.interface.js";
import { IQueryParams } from "../../interfaces/query.interface.js";

export const NewsletterSubscriptionService = {
  create: async (payload: ICreateNewsletterSubscription) => {
    const exists = await prisma.newsletterSubscription.findUnique({
      where: { email: payload.email },
    });
    if (exists) {
      throw new AppError(StatusCodes.CONFLICT, "Email is already subscribed");
    }
    return prisma.newsletterSubscription.create({ data: payload });
  },

  getAll: async (query: IQueryParams) => {
    const qb = new QueryBuilder(prisma.newsletterSubscription, query, {
      searchableFields: newsletterSubscriptionSearchableFields,
      filterableFields: newsletterSubscriptionFilterableFields,
    });
    const { data, meta } = await qb.search().filter().paginate().sort().execute();
    const total = await qb.count();
    return { data, meta: { ...meta, total, totalPages: Math.ceil(total / meta.limit) } };
  },

  remove: async (id: string) => {
    const subscription = await prisma.newsletterSubscription.findUnique({ where: { id } });
    if (!subscription) throw new AppError(StatusCodes.NOT_FOUND, "Subscription not found");
    return prisma.newsletterSubscription.delete({ where: { id } });
  },
};
