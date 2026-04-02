import { JwtPayload, decode } from "jsonwebtoken";

interface ITokenPayload extends JwtPayload {
  userId?: string;
  role?: string;
  name?: string;
  email?: string;
}

export const decodeAccessToken = (token?: string): ITokenPayload | null => {
  if (!token) return null;
  const decoded = decode(token);
  if (!decoded || typeof decoded === "string") return null;
  return decoded as ITokenPayload;
};

export const isTokenExpiringSoon = (token?: string, thresholdSeconds = 120): boolean => {
  const decoded = decodeAccessToken(token);
  if (!decoded?.exp) return true;
  const current = Math.floor(Date.now() / 1000);
  return decoded.exp - current <= thresholdSeconds;
};
