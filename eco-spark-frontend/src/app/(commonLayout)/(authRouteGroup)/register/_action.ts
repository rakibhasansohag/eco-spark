"use server"

import { AxiosError } from "axios"
import { cookies } from "next/headers"
import { registerForServerAction } from "@/services/auth.services"
import { IAuthUser } from "@/types/auth.types"
import { registerZodSchema } from "@/zod/auth.validation"

export interface IRegisterActionResult {
  success: boolean
  message: string
  data: IAuthUser | null
  errors?: Record<string, string[]>
}

const cookieValueFromHeader = (header: string, name: string): string | undefined => {
  const matched = header.match(new RegExp(`^${name}=([^;]+)`))
  return matched?.[1]
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
    const { result, setCookies } = await registerForServerAction(parsed.data)
    const store = await cookies()
    const accessTokenHeader = setCookies.find((cookie) => cookie.startsWith("accessToken="))
    const refreshTokenHeader = setCookies.find((cookie) => cookie.startsWith("refreshToken="))
    const accessToken = accessTokenHeader
      ? cookieValueFromHeader(accessTokenHeader, "accessToken")
      : undefined
    const refreshToken = refreshTokenHeader
      ? cookieValueFromHeader(refreshTokenHeader, "refreshToken")
      : undefined

    if (accessToken) {
      store.set("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 15 * 60,
      })
    }

    if (refreshToken) {
      store.set("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      })
    }

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
