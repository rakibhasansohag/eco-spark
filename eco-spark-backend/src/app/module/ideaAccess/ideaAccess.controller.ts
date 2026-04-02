import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { IdeaAccessService } from "./ideaAccess.service.js";

export const IdeaAccessController = {
  getMyAccesses: catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaAccessService.getMyAccesses(req.user!.userId, req.query as Record<string, string>);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Idea accesses fetched successfully",
      data: result.data,
      meta: result.meta,
    });
  }),

  checkAccess: catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaAccessService.checkAccess(req.user!.userId, req.params["ideaId"] as string);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Idea access status fetched successfully",
      data: result,
    });
  }),
};
