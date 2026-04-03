"use server"

import { revalidatePath } from "next/cache"
import { AxiosError } from "axios"
import { updateUserByAdmin } from "@/services/user.services"

interface ActionResult {
  success: boolean
  message: string
}

export async function updateUserByAdminAction(
  id: string,
  data: { role?: "ADMIN" | "MEMBER"; status?: "ACTIVE" | "INACTIVE" },
): Promise<ActionResult> {
  try {
    await updateUserByAdmin(id, data)
    revalidatePath("/admin/dashboard/users-management")
    return { success: true, message: "User updated successfully" }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Failed to update user" }
  }
}
