import { NextRequest, NextResponse } from "next/server"

const ALLOWED_EVENTS = new Set([
  "oauth_finalize_timeout",
  "oauth_finalize_failed",
  "oauth_error_query",
])
const ALLOWED_ERROR_CODES = new Set([
  "state_mismatch",
  "google_login_failed",
  "google_login_timeout",
  "google_finalize_failed",
  "access_denied",
])

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      event?: string
      errorCode?: string
    }

    const event = body.event ?? ""
    if (!ALLOWED_EVENTS.has(event)) {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    const safeErrorCode =
      typeof body.errorCode === "string" && ALLOWED_ERROR_CODES.has(body.errorCode)
        ? body.errorCode
        : null

    const payload = {
      event,
      errorCode: safeErrorCode,
      timestamp: new Date().toISOString(),
    }

    if (process.env.NODE_ENV !== "production" || process.env.ENABLE_AUTH_TELEMETRY === "true") {
      console.info("[auth-telemetry]", payload)
    }
    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ success: false }, { status: 400 })
  }
}
