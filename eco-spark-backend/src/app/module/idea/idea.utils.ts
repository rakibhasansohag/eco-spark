import { IdeaStatus, Role } from "../../../generated/prisma/index.js";
import AppError from "../../errorHelpers/AppError.js";
import { StatusCodes } from "http-status-codes";
import { cloudinary } from "../../config/cloudinary.config.js";

interface AccessCheckParams {
  isPaid: boolean;
  authorId: string;
  status: IdeaStatus;
}

export const canViewFullContent = (
  idea: AccessCheckParams,
  requestUserId: string | undefined,
  requestUserRole: string | undefined,
  hasIdeaAccess: boolean
): boolean => {
  if (!idea.isPaid) return true;
  if (requestUserRole === Role.ADMIN) return true;
  if (requestUserId && idea.authorId === requestUserId) return true;
  return hasIdeaAccess;
};

export const assertIdeaIsEditable = (status: IdeaStatus): void => {
  if (status !== IdeaStatus.DRAFT && status !== IdeaStatus.REJECTED) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Ideas can only be edited when in DRAFT or REJECTED status"
    );
  }
};

export const uploadImageToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "eco-spark/ideas", resource_type: "image" }, (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
        } else {
          resolve(result.secure_url);
        }
      })
      .end(buffer);
  });
};

export const uploadManyImages = async (
  files: Express.Multer.File[]
): Promise<string[]> => {
  return Promise.all(files.map((f) => uploadImageToCloudinary(f.buffer)));
};
