import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { DashboardService } from "./dashboard.service.js";

export const DashboardController = {
  getAdminStats: catchAsync(async (_req: Request, res: Response) => {
    const result = await DashboardService.getAdminStats();
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Admin dashboard stats fetched successfully",
      data: result,
    });
  }),

  getMemberStats: catchAsync(async (req: Request, res: Response) => {
    const result = await DashboardService.getMemberStats(req.user!.userId);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Member dashboard stats fetched successfully",
      data: result,
    });
  }),
};
