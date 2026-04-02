"use server"

import { AxiosError } from "axios"
import { deleteComment } from "@/services/comment.services"

interface IActionResult {
  success: boolean
  message: string
}

export const deleteCommentAction = async (
  commentId: string
): Promise<IActionResult> => {
  try {
    const result = await deleteComment(commentId)
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Comment deletion failed" }
  }
}
