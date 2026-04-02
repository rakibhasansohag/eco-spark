import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { CommentService } from "./comment.service.js";

export const CommentController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const result = await CommentService.create(req.user!.userId, req.body);
    sendResponse(res, {
      httpStatusCode: StatusCodes.CREATED,
      success: true,
      message: "Comment created successfully",
      data: result,
    });
  }),

  getAll: catchAsync(async (req: Request, res: Response) => {
    const result = await CommentService.getAll(req.query as Record<string, string>);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Comments fetched successfully",
      data: result.data,
      meta: result.meta,
    });
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const result = await CommentService.update(req.params["id"] as string, req.user!.userId, req.body);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Comment updated successfully",
      data: result,
    });
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    const result = await CommentService.remove(req.params["id"] as string, req.user!.userId, req.user!.role);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Comment deleted successfully",
      data: result,
    });
  }),
};
