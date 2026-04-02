import { z } from "zod/v4";

export const createVoteZodSchema = z.object({
  ideaId: z.string().min(1),
  type: z.enum(["UPVOTE", "DOWNVOTE"]),
});
