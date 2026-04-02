import { z } from "zod/v4";

export const createCategoryZodSchema = z.object({
  name: z.string({ error: "Name is required" }).min(2, "Name must be at least 2 characters"),
});

export const updateCategoryZodSchema = z.object({
  name: z.string().min(2).optional(),
});
