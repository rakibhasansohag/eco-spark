import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { NewsletterSubscriptionService } from "./newsletterSubscription.service.js";

export const NewsletterSubscriptionController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const result = await NewsletterSubscriptionService.create(req.body);
    sendResponse(res, {
      httpStatusCode: StatusCodes.CREATED,
      success: true,
      message: "Subscribed successfully",
      data: result,
    });
  }),

  getAll: catchAsync(async (req: Request, res: Response) => {
    const result = await NewsletterSubscriptionService.getAll(req.query as Record<string, string>);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Subscriptions fetched successfully",
      data: result.data,
      meta: result.meta,
    });
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    const result = await NewsletterSubscriptionService.remove(req.params["id"] as string);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Subscription deleted successfully",
      data: result,
    });
  }),
};
