import { z } from "zod/v4";

export const ideaStageOptions = ["CONCEPT", "PILOT", "SCALING", "IMPLEMENTED"] as const;
const linksFromInput = z.preprocess((value) => {
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

export const createIdeaZodSchema = z
  .object({
    title: z.string().min(5),
    problemStatement: z.string().min(10),
    proposedSolution: z.string().min(10),
    description: z.string().min(20),
    targetAudience: z.string().min(5).optional(),
    implementationStage: z.enum(ideaStageOptions).optional(),
    estimatedBudgetMin: z.number().nonnegative().optional(),
    estimatedBudgetMax: z.number().nonnegative().optional(),
    timelineWeeks: z.number().int().positive().optional(),
    locationScope: z.string().min(2).optional(),
    expectedImpact: z.string().min(10).optional(),
    risksAndMitigation: z.string().min(10).optional(),
    externalLinks: linksFromInput.optional(),
    categoryId: z.string().min(1),
    isPaid: z.boolean().optional(),
    price: z.number().positive().optional(),
  })
  .refine((data) => !data.isPaid || (data.price !== undefined && data.price > 0), {
    error: "Price is required for paid ideas",
    path: ["price"],
  })
  .refine(
    (data) =>
      data.estimatedBudgetMin === undefined ||
      data.estimatedBudgetMax === undefined ||
      data.estimatedBudgetMin <= data.estimatedBudgetMax,
    {
      error: "Minimum budget cannot be greater than maximum budget",
      path: ["estimatedBudgetMin"],
    },
  );

export const updateIdeaZodSchema = z
  .object({
    title: z.string().min(5).optional(),
    problemStatement: z.string().min(10).optional(),
    proposedSolution: z.string().min(10).optional(),
    description: z.string().min(20).optional(),
    targetAudience: z.string().min(5).optional(),
    implementationStage: z.enum(ideaStageOptions).optional(),
    estimatedBudgetMin: z.number().nonnegative().optional(),
    estimatedBudgetMax: z.number().nonnegative().optional(),
    timelineWeeks: z.number().int().positive().optional(),
    locationScope: z.string().min(2).optional(),
    expectedImpact: z.string().min(10).optional(),
    risksAndMitigation: z.string().min(10).optional(),
    externalLinks: linksFromInput.optional(),
    categoryId: z.string().optional(),
    isPaid: z.boolean().optional(),
    price: z.number().positive().optional(),
  });

export const rejectIdeaZodSchema = z.object({
  rejectionFeedback: z.string().min(10),
});
