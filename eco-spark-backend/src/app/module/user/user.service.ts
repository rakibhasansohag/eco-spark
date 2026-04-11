import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma.js";
import AppError from "../../errorHelpers/AppError.js";
import QueryBuilder from "../../utils/QueryBuilder.js";
import { userSearchableFields, userFilterableFields } from "./user.constant.js";
import { IUpdateUserProfile } from "./user.interface.js";
import { Role, User, UserStatus, Prisma } from "../../../generated/prisma/index.js";
import { IQueryParams } from "../../interfaces/query.interface.js";
import { uploadAvatarToCloudinary } from "./user.utils.js";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  bio: true,
  organization: true,
  jobTitle: true,
  location: true,
  website: true,
  phone: true,
  role: true,
  status: true,
  reputation: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const UserService = {
  getAll: async (query: IQueryParams) => {
    const qb = new QueryBuilder<User>(prisma.user, query, {
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...publicUserSelect,
        accounts: {
          select: {
            providerId: true,
            password: true,
          },
        },
      },
    });
    if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

    const canChangePassword = user.accounts.some(
      (account) => account.providerId === "credential" && Boolean(account.password),
    );
    const connectedProviders = Array.from(new Set(user.accounts.map((account) => account.providerId)));
    const { accounts: _accounts, ...publicUser } = user;

    return {
      ...publicUser,
      canChangePassword,
      connectedProviders,
    };
  },

  updateMyProfile: async (userId: string, payload: IUpdateUserProfile, file?: Express.Multer.File) => {
    const avatarUrl = file ? await uploadAvatarToCloudinary(file.buffer) : undefined;
    const data: Prisma.UserUpdateInput = {
      ...payload,
      ...(avatarUrl ? { image: avatarUrl } : {}),
    };
    return prisma.user.update({
      where: { id: userId },
      data,
      select: publicUserSelect,
    });
  },

  updateByAdmin: async (id: string, payload: { role?: string; status?: string }) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

    // RULE: Cannot demote an ADMIN to MEMBER
    if (user.role === Role.ADMIN && payload.role === Role.MEMBER) {
      throw new AppError(StatusCodes.FORBIDDEN, "Administrative protection: Admins cannot be demoted to members.");
    }

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
