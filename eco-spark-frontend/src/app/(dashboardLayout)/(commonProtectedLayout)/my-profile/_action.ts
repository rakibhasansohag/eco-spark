"use server"

import { revalidatePath } from "next/cache"
import { updateMyProfile } from "@/services/user.services"
import { updateProfileZodSchema } from "@/zod/user.validation"
import { extractActionError, firstFieldErrorMessage } from "@/lib/actionErrorUtils"

interface ActionResult {
  success: boolean
  message: string
}

export async function updateProfileAction(values: unknown): Promise<ActionResult> {
  const raw = (values ?? {}) as Record<string, unknown>
  const parsed = updateProfileZodSchema.safeParse({
    name: raw.name,
    image: raw.image,
    bio: raw.bio,
    organization: raw.organization,
    jobTitle: raw.jobTitle,
    location: raw.location,
    website: raw.website,
    phone: raw.phone,
  })
  if (!parsed.success) {
    return {
      success: false,
      message: firstFieldErrorMessage(parsed.error.flatten().fieldErrors, "Validation failed"),
    }
  }

  const payload = new FormData()
  const entries = Object.entries(parsed.data)
  for (const [key, value] of entries) {
    if (typeof value === "string" && value.trim().length > 0) {
      payload.append(key, value.trim())
    }
  }
  const avatar = raw.avatar
  if (avatar instanceof File && avatar.size > 0) {
    payload.append("avatar", avatar, avatar.name)
  }

  try {
    await updateMyProfile(payload)
    revalidatePath("/my-profile")
    revalidatePath("/dashboard")
    revalidatePath("/member/dashboard")
    revalidatePath("/admin/dashboard")
    return { success: true, message: "Profile updated successfully" }
  } catch (error) {
    const parsedError = extractActionError(error, "Failed to update profile")
    return { success: false, message: parsedError.message }
  }
}
