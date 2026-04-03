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
