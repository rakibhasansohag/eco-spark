import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { IdeaService } from "./idea.service.js";

export const IdeaController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const files = (req.files as Express.Multer.File[]) ?? [];
    const result = await IdeaService.create(req.user!.userId, req.body, files);
    sendResponse(res, { httpStatusCode: StatusCodes.CREATED, success: true, message: "Idea created successfully", data: result });
  }),

  getAll: catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaService.getAll(req.query as Record<string, string>, req.user?.userId, req.user?.role);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Ideas fetched successfully", data: result.data, meta: result.meta });
  }),

  getAllForAdmin: catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaService.getAllForAdmin(req.query as Record<string, string>);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "All ideas fetched successfully", data: result.data, meta: result.meta });
  }),

  getMyIdeas: catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaService.getMyIdeas(req.user!.userId, req.query as Record<string, string>);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Your ideas fetched successfully", data: result.data, meta: result.meta });
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaService.getById(req.params["id"] as string, req.user?.userId, req.user?.role);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Idea fetched successfully", data: result });
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const files = (req.files as Express.Multer.File[]) ?? [];
    const result = await IdeaService.update(req.params["id"] as string, req.user!.userId, req.body, files);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Idea updated successfully", data: result });
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaService.remove(req.params["id"] as string, req.user!.userId);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Idea deleted successfully", data: result });
  }),

  submit: catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaService.submit(req.params["id"] as string, req.user!.userId);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Idea submitted for review", data: result });
  }),

  approve: catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaService.approve(req.params["id"] as string);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Idea approved successfully", data: result });
  }),

  reject: catchAsync(async (req: Request, res: Response) => {
    const result = await IdeaService.reject(req.params["id"] as string, req.body);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Idea rejected", data: result });
  }),
};
