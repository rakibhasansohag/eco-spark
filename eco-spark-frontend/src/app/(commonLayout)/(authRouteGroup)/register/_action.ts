"use server"

import { AxiosError } from "axios"
import { register } from "@/services/auth.services"
import { IAuthUser } from "@/types/auth.types"
import { registerZodSchema } from "@/zod/auth.validation"

export interface IRegisterActionResult {
  success: boolean
  message: string
  data: IAuthUser | null
  errors?: Record<string, string[]>
}

export const registerAction = async (values: unknown): Promise<IRegisterActionResult> => {
  const parsed = registerZodSchema.safeParse(values)

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      data: null,
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const result = await register(parsed.data)
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
      message: "Registration failed",
      data: null,
    }
  }
}
