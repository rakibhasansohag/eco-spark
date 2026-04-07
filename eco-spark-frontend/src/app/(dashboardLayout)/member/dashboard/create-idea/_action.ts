"use server"

import { createIdea } from "@/services/idea.services"
import { IIdea } from "@/types/idea.types"
import { createIdeaZodSchema } from "@/zod/idea.validation"
import { extractActionError, firstFieldErrorMessage } from "@/lib/actionErrorUtils"

export interface ICreateIdeaActionResult {
  success: boolean
  message: string
  data: IIdea | null
  errors?: Record<string, string[]>
}

export const createIdeaAction = async (
  formData: FormData,
): Promise<ICreateIdeaActionResult> => {
  const rawValues = {
    title: formData.get("title") as string,
    problemStatement: formData.get("problemStatement") as string,
    proposedSolution: formData.get("proposedSolution") as string,
    description: formData.get("description") as string,
    targetAudience: (formData.get("targetAudience") as string) || undefined,
    implementationStage: (formData.get("implementationStage") as string) || undefined,
    estimatedBudgetMin: formData.get("estimatedBudgetMin")
      ? Number(formData.get("estimatedBudgetMin"))
      : undefined,
    estimatedBudgetMax: formData.get("estimatedBudgetMax")
      ? Number(formData.get("estimatedBudgetMax"))
      : undefined,
    timelineWeeks: formData.get("timelineWeeks") ? Number(formData.get("timelineWeeks")) : undefined,
    locationScope: (formData.get("locationScope") as string) || undefined,
    expectedImpact: (formData.get("expectedImpact") as string) || undefined,
    risksAndMitigation: (formData.get("risksAndMitigation") as string) || undefined,
    externalLinks: (formData.get("externalLinks") as string)
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    categoryId: formData.get("categoryId") as string,
    isPaid: formData.get("isPaid") === "true",
    price: formData.get("price") ? Number(formData.get("price")) : undefined,
  }

  const parsed = createIdeaZodSchema.safeParse(rawValues)
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return {
      success: false,
      message: firstFieldErrorMessage(errors, "Please check the highlighted fields"),
      data: null,
      errors,
    }
  }

  // Build multipart FormData for the backend
  const backendFormData = new FormData()
  backendFormData.append("title", parsed.data.title)
  backendFormData.append("problemStatement", parsed.data.problemStatement)
  backendFormData.append("proposedSolution", parsed.data.proposedSolution)
  backendFormData.append("description", parsed.data.description)
  if (parsed.data.targetAudience) backendFormData.append("targetAudience", parsed.data.targetAudience)
  if (parsed.data.implementationStage)
    backendFormData.append("implementationStage", parsed.data.implementationStage)
  if (parsed.data.estimatedBudgetMin !== undefined)
    backendFormData.append("estimatedBudgetMin", String(parsed.data.estimatedBudgetMin))
  if (parsed.data.estimatedBudgetMax !== undefined)
    backendFormData.append("estimatedBudgetMax", String(parsed.data.estimatedBudgetMax))
  if (parsed.data.timelineWeeks !== undefined)
    backendFormData.append("timelineWeeks", String(parsed.data.timelineWeeks))
  if (parsed.data.locationScope) backendFormData.append("locationScope", parsed.data.locationScope)
  if (parsed.data.expectedImpact) backendFormData.append("expectedImpact", parsed.data.expectedImpact)
  if (parsed.data.risksAndMitigation)
    backendFormData.append("risksAndMitigation", parsed.data.risksAndMitigation)
  if (parsed.data.externalLinks && parsed.data.externalLinks.length > 0) {
    backendFormData.append("externalLinks", parsed.data.externalLinks.join(","))
  }
  backendFormData.append("categoryId", parsed.data.categoryId)
  if (parsed.data.isPaid) backendFormData.append("isPaid", "true")
  if (parsed.data.price !== undefined)
    backendFormData.append("price", String(parsed.data.price))

  const images = formData.getAll("images") as File[]
  for (const img of images) {
    backendFormData.append("images", img, img.name)
  }

  try {
    const result = await createIdea(backendFormData)
    return {
      success: result.success,
      message: result.message,
      data: result.data,
    }
  } catch (error) {
    const parsedError = extractActionError(error, "Idea creation failed")
    return {
      success: false,
      message: parsedError.message,
      data: null,
      errors: parsedError.errors,
    }
  }
}
