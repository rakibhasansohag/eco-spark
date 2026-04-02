import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import { CategoryService } from "./category.service.js";

export const CategoryController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.create(req.body);
    sendResponse(res, { httpStatusCode: StatusCodes.CREATED, success: true, message: "Category created successfully", data: result });
  }),

  getAll: catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.getAll(req.query as Record<string, string>);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Categories fetched successfully", data: result.data, meta: result.meta });
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.getById(req.params["id"] as string);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Category fetched successfully", data: result });
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.update(req.params["id"] as string, req.body);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Category updated successfully", data: result });
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    const result = await CategoryService.remove(req.params["id"] as string);
    sendResponse(res, { httpStatusCode: StatusCodes.OK, success: true, message: "Category deleted successfully", data: result });
  }),
};
