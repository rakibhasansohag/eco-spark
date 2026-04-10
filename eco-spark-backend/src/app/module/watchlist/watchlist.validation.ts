import { z } from "zod";

export const createWatchlistZodSchema = z.object({
  ideaId: z.string({ required_error: "Idea ID is required" }),
});
