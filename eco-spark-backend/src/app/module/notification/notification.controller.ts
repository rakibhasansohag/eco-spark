import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { NotificationService } from "./notification.service.js";

export const NotificationController = {
  getAll: catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationService.getAll(req.user!.userId);
    const unreadCount = await NotificationService.getUnreadCount(req.user!.userId);
    sendResponse(res, { 
      httpStatusCode: StatusCodes.OK, 
      success: true, 
      message: "Notifications fetched successfully", 
      data: { notifications: result, unreadCount } 
    });
  }),
  markAsRead: catchAsync(async (req: Request, res: Response) => {
    const result = await NotificationService.markAsRead(req.params.id as string, req.user!.userId);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Notification marked as read", data: result });
  })
};
