"use server"

import { initiatePayment } from "@/services/payment.services"
import { extractActionError } from "@/lib/actionErrorUtils"

interface IPaymentInitiationResult {
  success: boolean
  message: string
  checkoutUrl: string | null
}

export async function initiateIdeaPaymentAction(
  ideaId: string
): Promise<IPaymentInitiationResult> {
  try {
    const result = await initiatePayment({ ideaId })
    return {
      success: true,
      message: result.message,
      checkoutUrl: result.data.checkoutUrl,
    }
  } catch (error) {
    const parsed = extractActionError(error, "Payment could not be initiated. Please try again.")
    return {
      success: false,
      message: parsed.message,
      checkoutUrl: null,
    }
  }
}
