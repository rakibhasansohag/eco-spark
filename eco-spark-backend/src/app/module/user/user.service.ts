import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma.js";
import AppError from "../../errorHelpers/AppError.js";
import QueryBuilder from "../../utils/QueryBuilder.js";
import { userSearchableFields, userFilterableFields } from "./user.constant.js";
import { IUpdateUserProfile } from "./user.interface.js";
import { Role, UserStatus } from "../../../generated/prisma/index.js";
import { IQueryParams } from "../../interfaces/query.interface.js";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const UserService = {
  getAll: async (query: IQueryParams) => {
    const qb = new QueryBuilder(prisma.user, query, {
      searchableFields: userSearchableFields,
      filterableFields: userFilterableFields,
    });
    const { data, meta } = await qb.search().filter().paginate().sort().execute();
    const total = await qb.count();
    return { data, meta: { ...meta, total, totalPages: Math.ceil(total / meta.limit) } };
  },

  getById: async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id }, select: publicUserSelect });
    if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    return user;
  },

  getMyProfile: async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUserSelect });
    if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    return user;
  },

  updateMyProfile: async (userId: string, payload: IUpdateUserProfile) => {
    return prisma.user.update({ where: { id: userId }, data: payload, select: publicUserSelect });
  },

  updateByAdmin: async (id: string, payload: { role?: string; status?: string }) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    return prisma.user.update({
      where: { id },
      data: {
        ...(payload.role && { role: payload.role as Role }),
        ...(payload.status && { status: payload.status as UserStatus }),
      },
      select: publicUserSelect,
    });
  },
};
