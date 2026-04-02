"use server"

import { AxiosError } from "axios"
import { subscribeNewsletter } from "@/services/newsletterSubscription.services"
import { createNewsletterSubscriptionZodSchema } from "@/zod/newsletterSubscription.validation"

export interface INewsletterActionResult {
  success: boolean
  message: string
}

export const subscribeNewsletterAction = async (
  values: unknown
): Promise<INewsletterActionResult> => {
  const parsed = createNewsletterSubscriptionZodSchema.safeParse(values)
  if (!parsed.success) {
    return { success: false, message: "Validation failed" }
  }

  try {
    const result = await subscribeNewsletter(parsed.data)
    return { success: result.success, message: result.message }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return { success: false, message: String(error.response.data.message) }
    }
    return { success: false, message: "Subscription failed" }
  }
}
