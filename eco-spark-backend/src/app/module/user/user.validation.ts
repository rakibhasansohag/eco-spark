import { z } from "zod/v4";

const optionalString = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().optional());

export const updateProfileZodSchema = z.object({
  name: optionalString.refine((value) => !value || value.length >= 2, {
    error: "Name must be at least 2 characters",
  }),
  image: optionalString.refine((value) => !value || z.url().safeParse(value).success, {
    error: "Invalid image URL",
  }),
  bio: optionalString,
  organization: optionalString,
  jobTitle: optionalString,
  location: optionalString,
  website: optionalString.refine((value) => !value || z.url().safeParse(value).success, {
    error: "Invalid website URL",
  }),
  phone: optionalString,
});

export const updateUserByAdminZodSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
