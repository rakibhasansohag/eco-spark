"use server"

import { cookies } from "next/headers"
import { loginForServerAction } from "@/services/auth.services"
import { IAuthUser } from "@/types/auth.types"
import { loginZodSchema } from "@/zod/auth.validation"
import { extractActionError, firstFieldErrorMessage } from "@/lib/actionErrorUtils"

export interface ILoginActionResult {
  success: boolean
  message: string
  data: IAuthUser | null
  errors?: Record<string, string[]>
}

const cookieValueFromHeader = (header: string, name: string): string | undefined => {
  const matched = header.match(new RegExp(`^${name}=([^;]+)`))
  return matched?.[1]
}

export const loginAction = async (values: unknown): Promise<ILoginActionResult> => {
  const parsed = loginZodSchema.safeParse(values)

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return {
      success: false,
      message: firstFieldErrorMessage(errors, "Please check your credentials"),
      data: null,
      errors,
    }
  }

  try {
    const { result, setCookies } = await loginForServerAction(parsed.data)
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
    const parsedError = extractActionError(error, "Login failed")
    return {
      success: false,
      message: parsedError.message,
      data: null,
      errors: parsedError.errors,
    }
  }
}
