import { z } from "zod/v4";

export const registerZodSchema = z.object({
  name: z.string({ error: "Name is required" }).min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string({ error: "Password is required" }).min(8, "Password must be at least 8 characters"),
});

export const loginZodSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string({ error: "Password is required" }).min(1, "Password is required"),
});

export const changePasswordZodSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});
