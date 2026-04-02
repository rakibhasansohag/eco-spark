import { ZodError } from "zod/v4";
import { IErrorSource } from "../interfaces/error.interface.js";

const handleZodError = (
  error: ZodError
): { message: string; errorSources: IErrorSource[] } => {
  const errorSources: IErrorSource[] = error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
  return { message: "Validation Error", errorSources };
};

export default handleZodError;
