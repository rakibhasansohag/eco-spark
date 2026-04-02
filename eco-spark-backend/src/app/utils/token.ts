import { generateAccessToken, generateRefreshToken } from "./jwt.js";
import { IRequestUser } from "../interfaces/requestUser.interface.js";

export const generateTokenPair = (
  user: IRequestUser
): { accessToken: string; refreshToken: string } => {
  const accessToken = generateAccessToken({
    userId: user.userId,
    role: user.role,
    name: user.name,
    email: user.email,
  });
  const refreshToken = generateRefreshToken({ userId: user.userId });
  return { accessToken, refreshToken };
};
