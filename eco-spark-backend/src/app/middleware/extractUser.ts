import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import prisma from "../lib/prisma.js";

/**
 * Optional authentication middleware.
 * It tries to identify the user from cookies but does NOT throw error if missing.
 * Useful for public routes that have enhanced content for logged-in users (like Admins).
 */
export const extractUser = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies?.accessToken as string | undefined;
    if (!accessToken) return next();

    let decoded;
    try {
      decoded = verifyAccessToken(accessToken);
    } catch {
      return next();
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (user && user.status === "ACTIVE") {
      req.user = { 
        userId: user.id, 
        role: user.role, 
        name: user.name, 
        email: user.email 
      };
    }
    next();
  } catch {
    next();
  }
};
