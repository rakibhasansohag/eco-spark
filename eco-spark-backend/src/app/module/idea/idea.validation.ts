import { z } from "zod/v4";

const booleanFromForm = z.preprocess((value) => {
  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }
  return value;
}, z.boolean());

export const createIdeaZodSchema = z.object({
  title: z.string({ error: "Title is required" }).min(5, "Title must be at least 5 characters"),
  problemStatement: z.string({ error: "Problem statement is required" }).min(10, "Problem statement must be at least 10 characters"),
  proposedSolution: z.string({ error: "Proposed solution is required" }).min(10, "Proposed solution must be at least 10 characters"),
  description: z.string({ error: "Description is required" }).min(20, "Description must be at least 20 characters"),
  categoryId: z.string({ error: "Category is required" }),
  isPaid: booleanFromForm.optional(),
  price: z.coerce.number().positive("Price must be positive").optional(),
}).refine(
  (data) => !data.isPaid || (data.price !== undefined && data.price > 0),
  { error: "Price is required for paid ideas", path: ["price"] }
);

export const updateIdeaZodSchema = z.object({
  title: z.string().min(5).optional(),
  problemStatement: z.string().min(10).optional(),
  proposedSolution: z.string().min(10).optional(),
  description: z.string().min(20).optional(),
  categoryId: z.string().optional(),
  isPaid: booleanFromForm.optional(),
  price: z.coerce.number().positive().optional(),
});

export const rejectIdeaZodSchema = z.object({
  rejectionFeedback: z
    .string({ error: "Rejection feedback is required" })
    .min(10, "Feedback must be at least 10 characters"),
});
