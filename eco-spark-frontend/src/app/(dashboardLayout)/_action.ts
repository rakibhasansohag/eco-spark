"use server"

import { cookies } from "next/headers"
import httpClient from "@/lib/axios/httpClient"

export async function logoutAction(): Promise<void> {
  try {
    await httpClient.post("/auth/sign-out")
  } catch {
    // proceed with cookie cleanup even if the server call fails
  }
  const store = await cookies()
  store.delete("accessToken")
  store.delete("refreshToken")
}
