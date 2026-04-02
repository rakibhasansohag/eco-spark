import { Response } from "express";

interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ISendResponse<T> {
  httpStatusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: IMeta;
}

const sendResponse = <T>(res: Response, options: ISendResponse<T>): void => {
  const { httpStatusCode, success, message, data, meta } = options;
  res.status(httpStatusCode).json({
    success,
    message,
    ...(data !== undefined && { data }),
    ...(meta && { meta }),
  });
};

export default sendResponse;
