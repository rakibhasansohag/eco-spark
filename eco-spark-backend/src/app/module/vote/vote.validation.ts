import { z } from "zod/v4";

export const createVoteZodSchema = z.object({
  ideaId: z.string({ error: "Idea ID is required" }),
  type: z.enum(["UPVOTE", "DOWNVOTE"]),
});
