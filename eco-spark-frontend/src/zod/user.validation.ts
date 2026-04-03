import { z } from "zod/v4";

export const updateProfileZodSchema = z.object({
  name: z.string().trim().min(2).optional(),
  image: z.url().optional().or(z.literal("")),
  bio: z.string().trim().max(300).optional(),
  organization: z.string().trim().max(120).optional(),
  jobTitle: z.string().trim().max(120).optional(),
  location: z.string().trim().max(120).optional(),
  website: z.url().optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional(),
});

export const updateUserByAdminZodSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
