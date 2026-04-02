import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod/v4";

const validateRequest = (schema: ZodType<unknown>) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(result.error);
      return;
    }
    req.body = result.data;
    next();
  };
};

export default validateRequest;
