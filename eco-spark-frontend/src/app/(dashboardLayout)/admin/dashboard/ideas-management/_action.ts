"use server"

import { revalidatePath } from "next/cache"
import { AxiosError } from "axios"
import { approveIdea, rejectIdea, deleteIdea } from "@/services/idea.services"
import { rejectIdeaZodSchema } from "@/zod/idea.validation"

interface ActionResult {
  success: boolean
  message: string
}

export async function approveIdeaAction(id: string): Promise<ActionResult> {
  try {
    const result = await approveIdea(id)
    revalidatePath("/admin/dashboard/ideas-management")
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Failed to approve idea" }
  }
}

export async function rejectIdeaAction(
  id: string,
  values: unknown,
): Promise<ActionResult> {
  const parsed = rejectIdeaZodSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, message: "Rejection feedback is required (min 10 chars)" }
  }
  try {
    const result = await rejectIdea(id, parsed.data)
    revalidatePath("/admin/dashboard/ideas-management")
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Failed to reject idea" }
  }
}

export async function deleteIdeaByAdminAction(id: string): Promise<ActionResult> {
  try {
    const result = await deleteIdea(id)
    revalidatePath("/admin/dashboard/ideas-management")
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Failed to delete idea" }
  }
}
