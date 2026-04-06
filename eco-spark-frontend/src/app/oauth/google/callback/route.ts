import { NextRequest, NextResponse } from "next/server"

const getDashboardPath = (role: string | null) =>
  role === "ADMIN" ? "/admin/dashboard" : "/member/dashboard"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const accessToken = url.searchParams.get("accessToken")
  const refreshToken = url.searchParams.get("refreshToken")
  const role = url.searchParams.get("role")
  const error = url.searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, req.url))
  }

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/login?error=google_login_failed", req.url))
  }

  const nextPath = getDashboardPath(role)
  const finalizeURL = new URL("/oauth/google/finalize", req.url)
  finalizeURL.searchParams.set("next", nextPath)
  const response = NextResponse.redirect(finalizeURL)
  const secure = process.env.NODE_ENV === "production"

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 15 * 60,
  })

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  })

  return response
}
