import { cloudinary } from "../../config/cloudinary.config.js";

export const uploadAvatarToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "eco-spark/profiles", resource_type: "image" },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary upload failed"));
          } else {
            resolve(result.secure_url);
          }
        }
      )
      .end(buffer);
  });
};
