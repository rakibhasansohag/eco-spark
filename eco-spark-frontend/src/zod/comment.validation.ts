import { z } from "zod/v4";

export const createCommentZodSchema = z.object({
  content: z.string().min(1),
  ideaId: z.string().min(1),
  parentId: z.string().optional(),
});

export const updateCommentZodSchema = z.object({
  content: z.string().min(1).optional(),
});
