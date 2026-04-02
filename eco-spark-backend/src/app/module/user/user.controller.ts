import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { UserService } from "./user.service.js";

export const UserController = {
  getAll: catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getAll(req.query as Record<string, string>);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Users fetched successfully", data: result.data, meta: result.meta });
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getById(req.params["id"] as string);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "User fetched successfully", data: result });
  }),

  getMyProfile: catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getMyProfile(req.user!.userId);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Profile fetched successfully", data: result });
  }),

  updateMyProfile: catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.updateMyProfile(req.user!.userId, req.body);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Profile updated successfully", data: result });
  }),

  updateByAdmin: catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.updateByAdmin(req.params["id"] as string, req.body);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "User updated successfully", data: result });
  }),
};
