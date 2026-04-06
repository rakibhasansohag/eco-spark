import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../errorHelpers/AppError.js";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt.js";
import prisma from "../lib/prisma.js";
import { Role, UserStatus } from "../../generated/prisma/index.js";

const checkAuth = (...allowedRoles: Role[]) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // 1. Read access token from cookie
      const accessToken = req.cookies?.accessToken as string | undefined;
      const refreshToken = req.cookies?.refreshToken as string | undefined;
      if (!accessToken && !refreshToken) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Authentication required");
      }

      // 2. Verify access token first; if missing/expired use refresh token as fallback for SSR calls
      let decoded: { userId: string; role: string; name: string; email: string } | null = null;
      if (accessToken) {
        try {
          decoded = verifyAccessToken(accessToken);
        } catch {
          decoded = null;
        }
      }
      if (!decoded && refreshToken) {
        try {
          const refreshDecoded = verifyRefreshToken(refreshToken);
          decoded = { userId: refreshDecoded.userId, role: "", name: "", email: "" };
        } catch {
          throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired token");
        }
      }
      if (!decoded) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid or expired token");
      }

      // 3. Load user from DB and verify status
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "User not found");
      }
      if (user.status !== UserStatus.ACTIVE) {
        throw new AppError(StatusCodes.FORBIDDEN, "Account is deactivated");
      }

      // 4. Check role
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role as Role)) {
        throw new AppError(StatusCodes.FORBIDDEN, "Insufficient permissions");
      }

      // 5. Attach to request
      req.user = { userId: user.id, role: user.role, name: user.name, email: user.email };
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkAuth;
