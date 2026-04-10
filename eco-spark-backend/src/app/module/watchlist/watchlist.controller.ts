import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { WatchlistService } from "./watchlist.service.js";

export const WatchlistController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const result = await WatchlistService.create({ ...req.body, userId: req.user!.userId });
    sendResponse(res, { httpStatusCode: StatusCodes.CREATED, success: true, message: "Watchlist created successfully", data: result });
  }),
  getAll: catchAsync(async (req: Request, res: Response) => {
    const result = await WatchlistService.getAll({ ...req.query, userId: req.user!.userId });
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Watchlist list fetched successfully", data: result.data, meta: result.meta });
  }),
  remove: catchAsync(async (req: Request, res: Response) => {
    const result = await WatchlistService.remove(req.params.id as string, req.user!.userId);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Watchlist deleted successfully", data: result });
  }),
};
