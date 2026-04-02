"use server"

import { AxiosError } from "axios"
import { deleteIdea, submitIdea } from "@/services/idea.services"

interface IActionResult {
  success: boolean
  message: string
}

export const submitIdeaAction = async (ideaId: string): Promise<IActionResult> => {
  try {
    const result = await submitIdea(ideaId)
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Idea submission failed" }
  }
}

export const deleteIdeaAction = async (ideaId: string): Promise<IActionResult> => {
  try {
    const result = await deleteIdea(ideaId)
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Idea deletion failed" }
  }
}
