"use server"

import { AxiosError } from "axios"
import { login } from "@/services/auth.services"
import { IAuthUser } from "@/types/auth.types"
import { loginZodSchema } from "@/zod/auth.validation"

export interface ILoginActionResult {
  success: boolean
  message: string
  data: IAuthUser | null
  errors?: Record<string, string[]>
}

export const loginAction = async (values: unknown): Promise<ILoginActionResult> => {
  const parsed = loginZodSchema.safeParse(values)

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      data: null,
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const result = await login(parsed.data)
    return {
      success: result.success,
      message: result.message,
      data: result.data,
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      return {
        success: false,
        message: String(error.response.data.message),
        data: null,
      }
    }

    return {
      success: false,
      message: "Login failed",
      data: null,
    }
  }
}
