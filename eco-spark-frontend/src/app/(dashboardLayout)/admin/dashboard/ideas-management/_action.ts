"use server"

import { AxiosError } from "axios"
import { approveIdea, rejectIdea } from "@/services/idea.services"
import { rejectIdeaZodSchema } from "@/zod/idea.validation"

interface IActionResult {
  success: boolean
  message: string
}

export const approveIdeaAction = async (id: string): Promise<IActionResult> => {
  try {
    const result = await approveIdea(id)
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Approval failed" }
  }
}

export const rejectIdeaAction = async (
  id: string,
  values: unknown
): Promise<IActionResult> => {
  const parsed = rejectIdeaZodSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, message: "Validation failed" }
  }

  try {
    const result = await rejectIdea(id, parsed.data)
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Rejection failed" }
  }
}
