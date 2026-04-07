import { z } from "zod/v4";

const booleanFromForm = z.preprocess((value) => {
  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }
  return value;
}, z.boolean());

const linksFromForm = z.preprocess((value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return value;
}, z.array(z.string().url("Each external link must be a valid URL")));

const ideaStage = z.enum(["CONCEPT", "PILOT", "SCALING", "IMPLEMENTED"]);

export const createIdeaZodSchema = z.object({
  title: z.string({ error: "Title is required" }).min(5, "Title must be at least 5 characters"),
  problemStatement: z.string({ error: "Problem statement is required" }).min(10, "Problem statement must be at least 10 characters"),
  proposedSolution: z.string({ error: "Proposed solution is required" }).min(10, "Proposed solution must be at least 10 characters"),
  description: z.string({ error: "Description is required" }).min(20, "Description must be at least 20 characters"),
  targetAudience: z.string().min(5, "Target audience must be at least 5 characters").optional(),
  implementationStage: ideaStage.optional(),
  estimatedBudgetMin: z.coerce.number().nonnegative("Minimum budget must be zero or greater").optional(),
  estimatedBudgetMax: z.coerce.number().nonnegative("Maximum budget must be zero or greater").optional(),
  timelineWeeks: z.coerce.number().int("Timeline must be a whole number").positive("Timeline must be positive").optional(),
  locationScope: z.string().min(2, "Location scope must be at least 2 characters").optional(),
  expectedImpact: z.string().min(10, "Expected impact must be at least 10 characters").optional(),
  risksAndMitigation: z.string().min(10, "Risks and mitigation must be at least 10 characters").optional(),
  externalLinks: linksFromForm.optional(),
  categoryId: z.string({ error: "Category is required" }),
  isPaid: booleanFromForm.optional(),
  price: z.coerce.number().positive("Price must be positive").optional(),
}).refine(
  (data) => !data.isPaid || (data.price !== undefined && data.price > 0),
  { error: "Price is required for paid ideas", path: ["price"] }
).refine(
  (data) =>
    data.estimatedBudgetMin === undefined ||
    data.estimatedBudgetMax === undefined ||
    data.estimatedBudgetMin <= data.estimatedBudgetMax,
  { error: "Minimum budget cannot be greater than maximum budget", path: ["estimatedBudgetMin"] }
);

export const updateIdeaZodSchema = z.object({
  title: z.string().min(5).optional(),
  problemStatement: z.string().min(10).optional(),
  proposedSolution: z.string().min(10).optional(),
  description: z.string().min(20).optional(),
  targetAudience: z.string().min(5).optional(),
  implementationStage: ideaStage.optional(),
  estimatedBudgetMin: z.coerce.number().nonnegative().optional(),
  estimatedBudgetMax: z.coerce.number().nonnegative().optional(),
  timelineWeeks: z.coerce.number().int().positive().optional(),
  locationScope: z.string().min(2).optional(),
  expectedImpact: z.string().min(10).optional(),
  risksAndMitigation: z.string().min(10).optional(),
  externalLinks: linksFromForm.optional(),
  categoryId: z.string().optional(),
  isPaid: booleanFromForm.optional(),
  price: z.coerce.number().positive().optional(),
}).refine(
  (data) =>
    data.estimatedBudgetMin === undefined ||
    data.estimatedBudgetMax === undefined ||
    data.estimatedBudgetMin <= data.estimatedBudgetMax,
  { error: "Minimum budget cannot be greater than maximum budget", path: ["estimatedBudgetMin"] }
);

export const rejectIdeaZodSchema = z.object({
  rejectionFeedback: z
    .string({ error: "Rejection feedback is required" })
    .min(10, "Feedback must be at least 10 characters"),
});
