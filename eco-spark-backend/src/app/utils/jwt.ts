import jwt from "jsonwebtoken";
import { envVars } from "../config/env.js";
import { IRequestUser } from "../interfaces/requestUser.interface.js";

type AccessTokenPayload = Omit<IRequestUser, never>;

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, envVars.ACCESS_TOKEN_SECRET, {
    expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (payload: { userId: string }): string => {
  return jwt.sign(payload, envVars.REFRESH_TOKEN_SECRET, {
    expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, envVars.ACCESS_TOKEN_SECRET) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, envVars.REFRESH_TOKEN_SECRET) as { userId: string };
};

export const isTokenExpiringSoon = (token: string, thresholdSeconds = 60): boolean => {
  try {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    if (!decoded?.exp) return true;
    const secondsLeft = decoded.exp - Math.floor(Date.now() / 1000);
    return secondsLeft < thresholdSeconds;
  } catch {
    return true;
  }
};
