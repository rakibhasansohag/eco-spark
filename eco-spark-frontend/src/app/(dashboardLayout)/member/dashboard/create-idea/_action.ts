"use server"

import { AxiosError } from "axios"
import { createIdea } from "@/services/idea.services"
import { IIdea } from "@/types/idea.types"
import { createIdeaZodSchema } from "@/zod/idea.validation"

export interface ICreateIdeaActionResult {
  success: boolean
  message: string
  data: IIdea | null
  errors?: Record<string, string[]>
}

export const createIdeaAction = async (
  values: unknown
): Promise<ICreateIdeaActionResult> => {
  const parsed = createIdeaZodSchema.safeParse(values)

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      data: null,
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const result = await createIdea(parsed.data)
    return {
      success: result.success,
      message: result.message,
      data: result.data,
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return {
        success: false,
        message: String(error.response.data.message),
        data: null,
      }
    }

    return {
      success: false,
      message: "Idea creation failed",
      data: null,
    }
  }
}
