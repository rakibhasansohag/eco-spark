import { z } from "zod";

export const createReviewZodSchema = z.object({
  ideaId: z.string({ required_error: "Idea ID is required" }),
  rating: z.number().min(1).max(10),
  effectiveness: z.number().min(1).max(10),
  experience: z.string(),
});
