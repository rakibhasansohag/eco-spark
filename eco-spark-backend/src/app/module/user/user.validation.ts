import { z } from "zod/v4";

export const updateProfileZodSchema = z.object({
  name: z.string().min(2).optional(),
  image: z.url("Invalid image URL").optional(),
});

export const updateUserByAdminZodSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
