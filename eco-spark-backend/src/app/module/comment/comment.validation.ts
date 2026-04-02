import { z } from "zod/v4";

export const createCommentZodSchema = z.object({
  content: z.string({ error: "Content is required" }).min(1, "Content is required"),
  ideaId: z.string({ error: "Idea ID is required" }),
  parentId: z.string().optional(),
});

export const updateCommentZodSchema = z.object({
  content: z.string().min(1, "Content is required").optional(),
});
