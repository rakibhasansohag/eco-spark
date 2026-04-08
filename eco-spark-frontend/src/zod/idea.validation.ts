import { z } from "zod/v4";

export const ideaStageOptions = ["CONCEPT", "PILOT", "SCALING", "IMPLEMENTED"] as const;
const requiredText = (label: string, min: number) =>
  z
    .string()
    .trim()
    .min(min, `${label} must be at least ${min} characters`);

const optionalText = (label: string, min: number) =>
  z.preprocess((value) => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed || undefined;
    }
    return value;
  }, z.string().min(min, `${label} must be at least ${min} characters`).optional());

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
    title: requiredText("Title", 5),
    problemStatement: requiredText("Problem statement", 10),
    proposedSolution: requiredText("Proposed solution", 10),
    description: requiredText("Description", 20),
    targetAudience: optionalText("Target audience", 5),
    implementationStage: z.enum(ideaStageOptions).optional(),
    estimatedBudgetMin: z.number().nonnegative().optional(),
    estimatedBudgetMax: z.number().nonnegative().optional(),
    timelineWeeks: z.number().int().positive().optional(),
    locationScope: optionalText("Location scope", 2),
    expectedImpact: optionalText("Expected impact", 10),
    risksAndMitigation: optionalText("Risks and mitigation", 10),
    externalLinks: linksFromInput.optional(),
    categoryId: z.string().trim().min(1, "Category is required"),
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
    title: optionalText("Title", 5),
    problemStatement: optionalText("Problem statement", 10),
    proposedSolution: optionalText("Proposed solution", 10),
    description: optionalText("Description", 20),
    targetAudience: optionalText("Target audience", 5),
    implementationStage: z.enum(ideaStageOptions).optional(),
    estimatedBudgetMin: z.number().nonnegative().optional(),
    estimatedBudgetMax: z.number().nonnegative().optional(),
    timelineWeeks: z.number().int().positive().optional(),
    locationScope: optionalText("Location scope", 2),
    expectedImpact: optionalText("Expected impact", 10),
    risksAndMitigation: optionalText("Risks and mitigation", 10),
    externalLinks: linksFromInput.optional(),
    categoryId: z.string().trim().min(1, "Category is required").optional(),
    isPaid: z.boolean().optional(),
    price: z.number().positive().optional(),
  });

export const rejectIdeaZodSchema = z.object({
  rejectionFeedback: z.string().min(10),
});
