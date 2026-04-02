import { StatusCodes } from "http-status-codes";
import { auth } from "../../lib/auth.js";
import prisma from "../../lib/prisma.js";
import AppError from "../../errorHelpers/AppError.js";
import { generateTokenPair } from "../../utils/token.js";
import { verifyRefreshToken } from "../../utils/jwt.js";
import { UserStatus } from "../../../generated/prisma/index.js";

export const AuthService = {
  register: async (payload: { name: string; email: string; password: string }) => {
    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      throw new AppError(StatusCodes.CONFLICT, "Email is already registered");
    }

    const result = await auth.api.signUpEmail({
      body: { name: payload.name, email: payload.email, password: payload.password },
    });

    if (!result?.user) {
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "Registration failed");
    }

    const user = await prisma.user.findUnique({ where: { id: result.user.id } });
    if (!user) throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "User creation failed");

    const tokens = generateTokenPair({
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      ...tokens,
    };
  },

  login: async (payload: { email: string; password: string }) => {
    const result = await auth.api.signInEmail({
      body: { email: payload.email, password: payload.password },
    });

    if (!result?.user) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    const user = await prisma.user.findUnique({ where: { id: result.user.id } });
    if (!user) throw new AppError(StatusCodes.UNAUTHORIZED, "User not found");

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError(StatusCodes.FORBIDDEN, "Account is deactivated");
    }

    const tokens = generateTokenPair({
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      ...tokens,
    };
  },

  refreshToken: async (refreshToken: string) => {
    let decoded: { userId: string };
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired refresh token");
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "User not found or deactivated");
    }

    const tokens = generateTokenPair({
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    return tokens;
  },
};
