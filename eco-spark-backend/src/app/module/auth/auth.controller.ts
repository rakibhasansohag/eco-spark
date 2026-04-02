import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { AuthService } from "./auth.service.js";
import { setAuthCookies, clearAuthCookies } from "../../utils/cookie.js";

export const AuthController = {
  register: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    sendResponse(res, {
      httpStatusCode: StatusCodes.CREATED,
      success: true,
      message: "Registration successful",
      data: result.user,
    });
  }),

  login: catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Login successful",
      data: result.user,
    });
  }),

  refreshToken: catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    if (!refreshToken) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Refresh token not found",
        errorSources: [],
      });
      return;
    }
    const tokens = await AuthService.refreshToken(refreshToken);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Token refreshed",
      data: null,
    });
  }),

  logout: catchAsync(async (_req: Request, res: Response) => {
    clearAuthCookies(res);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Logged out successfully",
      data: null,
    });
  }),
};
