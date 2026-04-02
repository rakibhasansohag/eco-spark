import { Prisma } from "../../generated/prisma/index.js";
import { StatusCodes } from "http-status-codes";
import { IErrorSource } from "../interfaces/error.interface.js";

const handlePrismaErrors = (
  error: Prisma.PrismaClientKnownRequestError
): { statusCode: number; message: string; errorSources: IErrorSource[] } => {
  const errorSources: IErrorSource[] = [];
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Database error";

  switch (error.code) {
    case "P2002": {
      statusCode = StatusCodes.CONFLICT;
      const fields = (error.meta?.target as string[]) ?? [];
      message = `Duplicate value on: ${fields.join(", ")}`;
      errorSources.push({ path: fields.join(", "), message });
      break;
    }
    case "P2025": {
      statusCode = StatusCodes.NOT_FOUND;
      message = "Record not found";
      errorSources.push({ path: "", message: error.message });
      break;
    }
    case "P2003": {
      statusCode = StatusCodes.BAD_REQUEST;
      message = "Related record not found";
      errorSources.push({ path: (error.meta?.field_name as string) ?? "", message });
      break;
    }
    case "P2014": {
      statusCode = StatusCodes.BAD_REQUEST;
      message = "Invalid relation";
      errorSources.push({ path: "", message: error.message });
      break;
    }
    default:
      errorSources.push({ path: "", message: error.message });
  }

  return { statusCode, message, errorSources };
};

export default handlePrismaErrors;
