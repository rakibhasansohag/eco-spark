"use server"

import { revalidatePath } from "next/cache"
import { AxiosError } from "axios"
import { deleteComment } from "@/services/comment.services"

interface ActionResult {
  success: boolean
  message: string
}

export async function deleteCommentByAdminAction(id: string): Promise<ActionResult> {
  try {
    const result = await deleteComment(id)
    revalidatePath("/admin/dashboard/comments-management")
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Failed to delete comment" }
  }
}
