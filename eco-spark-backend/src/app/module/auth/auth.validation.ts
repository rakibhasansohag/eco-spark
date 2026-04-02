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
