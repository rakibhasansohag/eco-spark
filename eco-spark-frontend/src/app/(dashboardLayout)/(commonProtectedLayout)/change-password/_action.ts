"use server"

import { AxiosError } from "axios"
import { changePassword } from "@/services/auth.services"

interface ActionResult {
  success: boolean
  message: string
}

export async function changePasswordAction(values: unknown): Promise<ActionResult> {
  const payload = values as { currentPassword?: string; newPassword?: string }

  if (!payload.currentPassword || !payload.newPassword) {
    return { success: false, message: "All password fields are required" }
  }
  if (payload.newPassword.length < 8) {
    return { success: false, message: "New password must be at least 8 characters" }
  }

  try {
    const result = await changePassword({
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
    })
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Failed to change password" }
  }
}
