import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod/v4";
import { Prisma } from "@prisma/client";
import { StatusCodes } from "http-status";
import AppError from "../errorHelpers/AppError.js";
import handleZodError from "../errorHelpers/handleZodError.js";
import handlePrismaErrors from "../errorHelpers/handlePrismaErrors.js";
import { IErrorSource } from "../interfaces/error.interface.js";
import { envVars } from "../config/env.js";

export const globalErrorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Clean up any uploaded files on error
  if (req.file) {
    // Cloudinary upload_stream handles cleanup; multer memoryStorage has no disk files
  }

  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorSources: IErrorSource[] = [{ path: "", message: "Internal server error" }];

  if (error instanceof ZodError) {
    const parsed = handleZodError(error);
    statusCode = StatusCodes.BAD_REQUEST;
    message = parsed.message;
    errorSources = parsed.errorSources;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const parsed = handlePrismaErrors(error);
    statusCode = parsed.statusCode;
    message = parsed.message;
    errorSources = parsed.errorSources;
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorSources = [{ path: "", message: error.message }];
  } else if (error instanceof Error) {
    message = error.message;
    errorSources = [{ path: "", message: error.message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    ...(envVars.NODE_ENV === "development" && {
      error,
      stack: error instanceof Error ? error.stack : undefined,
    }),
  });
};
