import { z } from "zod/v4";

export const initiatePaymentZodSchema = z.object({
  ideaId: z.string({ error: "Idea ID is required" }),
});
