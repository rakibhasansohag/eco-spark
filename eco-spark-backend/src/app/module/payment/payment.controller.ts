import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { PaymentService } from "./payment.service.js";
import { getStripeWebhookEvent } from "./payment.utils.js";

export const PaymentController = {
  initiate: catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.initiate(req.user!.userId, req.body);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Payment session created successfully",
      data: result,
    });
  }),

  webhook: catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string | undefined;
    if (!signature) {
      sendResponse(res, {
        httpStatusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: "Missing stripe-signature header",
        data: null,
      });
      return;
    }

    const event = getStripeWebhookEvent(req.body as Buffer, signature);
    const result = await PaymentService.handleWebhook(event);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Webhook processed",
      data: result,
    });
  }),

  getMyPayments: catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.getMyPayments(req.user!.userId, req.query as Record<string, string>);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Payments fetched successfully",
      data: result.data,
      meta: result.meta,
    });
  }),

  verify: catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.verify(req.params["transactionId"] as string, req.user!.userId);
    sendResponse(res, {
      httpStatusCode: StatusCodes.OK,
      success: true,
      message: "Payment verified successfully",
      data: result,
    });
  }),
};
