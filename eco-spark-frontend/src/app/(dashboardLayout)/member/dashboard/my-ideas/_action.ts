"use server"

import { revalidatePath } from "next/cache"
import { AxiosError } from "axios"
import { submitIdea, deleteIdea } from "@/services/idea.services"

interface ActionResult {
  success: boolean
  message: string
}

export async function submitIdeaAction(id: string): Promise<ActionResult> {
  try {
    const result = await submitIdea(id)
    revalidatePath("/member/dashboard/my-ideas")
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Failed to submit idea" }
  }
}

export async function deleteMyIdeaAction(id: string): Promise<ActionResult> {
  try {
    const result = await deleteIdea(id)
    revalidatePath("/member/dashboard/my-ideas")
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Failed to delete idea" }
  }
}
