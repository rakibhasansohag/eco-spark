import { Response } from "express";
import { envVars } from "../config/env.js";

const cookieBase = (() => {
  const isProd = envVars.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "lax" | "none",
  };
})();

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
): void => {
  res.cookie("accessToken", accessToken, {
    ...cookieBase,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieBase,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("accessToken", cookieBase);
  res.clearCookie("refreshToken", cookieBase);
};
