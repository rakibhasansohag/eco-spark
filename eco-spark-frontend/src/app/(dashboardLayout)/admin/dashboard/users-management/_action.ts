"use server"

import { AxiosError } from "axios"
import { updateUserByAdmin } from "@/services/user.services"
import { updateUserByAdminZodSchema } from "@/zod/user.validation"

interface IActionResult {
  success: boolean
  message: string
}

export const updateUserByAdminAction = async (
  userId: string,
  values: unknown
): Promise<IActionResult> => {
  const parsed = updateUserByAdminZodSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, message: "Validation failed" }
  }

  try {
    const result = await updateUserByAdmin(userId, parsed.data)
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "User update failed" }
  }
}
