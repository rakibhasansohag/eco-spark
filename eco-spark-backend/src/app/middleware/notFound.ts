import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const notFound = (_req: Request, res: Response): void => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Route not found",
    errorSources: [{ path: _req.originalUrl, message: "This route does not exist" }],
  });
};
