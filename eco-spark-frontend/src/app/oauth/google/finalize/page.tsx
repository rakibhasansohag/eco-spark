"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Leaf, Loader2 } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1"
const TELEMETRY_URL = "/api/telemetry/auth"

export default function GoogleFinalizePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get("next") || "/dashboard"
  const [statusText, setStatusText] = useState("Securing your session")
  const [subText, setSubText] = useState("Please wait while we complete sign-in.")

  useEffect(() => {
    let finished = false
    const postTelemetry = async (event: string, errorCode: string) => {
      try {
        await fetch(TELEMETRY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event, errorCode }),
        })
      } catch {}
    }

    const refreshWithRetry = async () => {
      await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      })
      await new Promise((resolve) => window.setTimeout(resolve, 250))
      await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      })
    }

    const run = async () => {
      const timeoutId = window.setTimeout(() => {
        if (finished) return
        finished = true
        setStatusText("Sign-in is taking longer than expected")
        setSubText("Redirecting you to a recovery page.")
        void postTelemetry("oauth_finalize_timeout", "google_login_timeout")
        router.replace("/auth/error?error=google_login_timeout")
      }, 10000)

      try {
        setStatusText("Refreshing secure access")
        await refreshWithRetry()
      } catch {
        if (!finished) {
          finished = true
          window.clearTimeout(timeoutId)
          setStatusText("Unable to finalize sign-in")
          setSubText("Redirecting you to a recovery page.")
          void postTelemetry("oauth_finalize_failed", "google_finalize_failed")
          router.replace("/auth/error?error=google_finalize_failed")
          return
        }
      }
      if (finished) return
      finished = true
      window.clearTimeout(timeoutId)
      setStatusText("Redirecting to your workspace")
      setSubText("Your session is ready.")
      router.replace(nextPath)
    }

    void run()
  }, [nextPath, router])

  return (
    <section className="flex min-h-[40vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border bg-card p-6 text-center shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Leaf className="h-5 w-5 text-primary" />
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          {statusText}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{subText}</p>
      </div>
    </section>
  )
}
