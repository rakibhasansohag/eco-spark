import { z } from "zod/v4";

export const createCategoryZodSchema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().optional(),
});

export const updateCategoryZodSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().optional(),
});
