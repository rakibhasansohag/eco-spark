import { z } from "zod/v4";

export const createNewsletterSubscriptionZodSchema = z.object({
  email: z.email("Invalid email address"),
});
