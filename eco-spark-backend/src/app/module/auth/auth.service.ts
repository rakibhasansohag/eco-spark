import { StatusCodes } from "http-status-codes";
import { auth } from "../../lib/auth.js";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import prisma from "../../lib/prisma.js";
import AppError from "../../errorHelpers/AppError.js";
import { generateTokenPair } from "../../utils/token.js";
import { verifyRefreshToken } from "../../utils/jwt.js";
import { Role, UserStatus } from "../../../generated/prisma/index.js";
import { envVars } from "../../config/env.js";

export const AuthService = {
  getGoogleSignInUrl: () => {
    const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/callback`;
    const params = new URLSearchParams({
      provider: "google",
      callbackURL,
    });

    return `${envVars.BETTER_AUTH_URL}/api/auth/sign-in/social?${params.toString()}`;
  },

  resolveGoogleCallback: async (headers: Record<string, string | string[] | undefined>) => {
    const session = await auth.api.getSession({
      headers: headers as Record<string, string>,
    });

    const sessionUser = session?.user;
    if (!sessionUser?.id) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Google sign-in session was not found");
    }

    let user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
    if (!user && sessionUser.email) {
      user = await prisma.user.findUnique({ where: { email: sessionUser.email } });
    }

    if (!user) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "User not found after Google sign-in");
    }

    if (user.email.toLowerCase() === "admin@ecosparkhub.com" && user.role !== Role.ADMIN) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: Role.ADMIN },
      });
    }

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

    let user = await prisma.user.findUnique({ where: { id: result.user.id } });
    if (!user) throw new AppError(StatusCodes.UNAUTHORIZED, "User not found");

    if (
      user.email.toLowerCase() === "admin@ecosparkhub.com" &&
      user.role !== Role.ADMIN
    ) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: Role.ADMIN },
      });
    }

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

  changePassword: async (
    userId: string,
    payload: { currentPassword: string; newPassword: string },
  ) => {
    const account = await prisma.account.findFirst({
      where: { userId, providerId: "credential" },
    });

    if (!account?.password) {
      throw new AppError(StatusCodes.BAD_REQUEST, "No password set for this account");
    }

    const isValid = await verifyPassword({ hash: account.password, password: payload.currentPassword });
    if (!isValid) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Current password is incorrect");
    }

    const newHash = await hashPassword(payload.newPassword);
    await prisma.account.update({ where: { id: account.id }, data: { password: newHash } });
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
