"use server"

import { revalidatePath } from "next/cache"
import { AxiosError } from "axios"
import { updateMyProfile } from "@/services/user.services"
import { updateProfileZodSchema } from "@/zod/user.validation"

interface ActionResult {
  success: boolean
  message: string
}

export async function updateProfileAction(values: unknown): Promise<ActionResult> {
  const parsed = updateProfileZodSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, message: "Validation failed" }
  }
  try {
    await updateMyProfile(parsed.data)
    revalidatePath("/my-profile")
    return { success: true, message: "Profile updated successfully" }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Failed to update profile" }
  }
}
