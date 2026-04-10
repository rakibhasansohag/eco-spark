import { Request, Response } from "express";
import { StatusCodes } from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { ReviewService } from "./review.service.js";

export const ReviewController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewService.create({ ...req.body, userId: req.user.userId });
    sendResponse(res, { httpStatusCode: StatusCodes.CREATED, success: true, message: "Review created successfully", data: result });
  }),
  getAll: catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewService.getAll(req.query);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Review list fetched successfully", data: result.data, meta: result.meta });
  }),
};
