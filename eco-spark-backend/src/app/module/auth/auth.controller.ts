import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { AuthService } from "./auth.service.js";
import { setAuthCookies, clearAuthCookies } from "../../utils/cookie.js";
import { IRequestUser } from "../../interfaces/requestUser.interface.js";
import { envVars } from "../../config/env.js";

export const AuthController = {
  googleSignIn: catchAsync(async (_req: Request, res: Response) => {
    const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/callback`;
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Redirecting...</title>
  </head>
  <body>
    <script>
      (async () => {
        try {
          const response = await fetch("/api/auth/sign-in/social", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              provider: "google",
              callbackURL: "${callbackURL}",
              disableRedirect: true
            })
          });
          const payload = await response.json();
          if (!response.ok || !payload || !payload.url) {
            window.location.href = "${envVars.FRONTEND_URL}/login?error=google_login_failed";
            return;
          }
          window.location.href = payload.url;
        } catch {
          window.location.href = "${envVars.FRONTEND_URL}/login?error=google_login_failed";
        }
      })();
    </script>
  </body>
</html>`;
    res.status(StatusCodes.OK).setHeader("Content-Type", "text/html; charset=utf-8").send(html);
  }),

  googleCallback: catchAsync(async (req: Request, res: Response) => {
    const oauthError = req.query.error;
    const redirectURL = new URL("/oauth/google/callback", envVars.FRONTEND_URL);

    if (typeof oauthError === "string" && oauthError.length > 0) {
      redirectURL.searchParams.set("error", oauthError);
      res.redirect(redirectURL.toString());
      return;
    }

    try {
      const result = await AuthService.resolveGoogleCallback(req.headers);
      redirectURL.searchParams.set("accessToken", result.accessToken);
      redirectURL.searchParams.set("refreshToken", result.refreshToken);
      redirectURL.searchParams.set("role", result.user.role);
      res.redirect(redirectURL.toString());
    } catch {
      redirectURL.searchParams.set("error", "google_login_failed");
      res.redirect(redirectURL.toString());
    }
  }),

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

  changePassword: catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    await AuthService.changePassword(user.userId, req.body);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Password changed successfully",
      data: null,
    });
  }),
};
