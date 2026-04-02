import { z } from "zod/v4";

export const createIdeaZodSchema = z
  .object({
    title: z.string().min(5),
    problemStatement: z.string().min(10),
    proposedSolution: z.string().min(10),
    description: z.string().min(20),
    categoryId: z.string().min(1),
    isPaid: z.boolean().optional(),
    price: z.number().positive().optional(),
  })
  .refine((data) => !data.isPaid || (data.price !== undefined && data.price > 0), {
    error: "Price is required for paid ideas",
    path: ["price"],
  });

export const updateIdeaZodSchema = z.object({
  title: z.string().min(5).optional(),
  problemStatement: z.string().min(10).optional(),
  proposedSolution: z.string().min(10).optional(),
  description: z.string().min(20).optional(),
  categoryId: z.string().optional(),
  isPaid: z.boolean().optional(),
  price: z.number().positive().optional(),
});

export const rejectIdeaZodSchema = z.object({
  rejectionFeedback: z.string().min(10),
});
