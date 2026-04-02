import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { VoteService } from "./vote.service.js";

export const VoteController = {
  castOrSwitch: catchAsync(async (req: Request, res: Response) => {
    const result = await VoteService.castOrSwitch(req.user!.userId, req.body);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Vote submitted successfully",
      data: result,
    });
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    const result = await VoteService.remove(req.user!.userId, req.params["ideaId"] as string);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Vote removed successfully",
      data: result,
    });
  }),

  getCounts: catchAsync(async (req: Request, res: Response) => {
    const result = await VoteService.getCounts(req.params["ideaId"] as string, req.user?.userId);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Vote counts fetched successfully",
      data: result,
    });
  }),
};
