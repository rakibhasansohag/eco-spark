"use client"

import { useEffect } from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Leaf, Loader2 } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1"

export default function GoogleFinalizePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get("next") || "/dashboard"
  const [statusText, setStatusText] = useState("Securing your session")
  const [subText, setSubText] = useState("Please wait while we complete sign-in.")

  useEffect(() => {
    let finished = false
    const run = async () => {
      const timeoutId = window.setTimeout(() => {
        if (finished) return
        finished = true
        setStatusText("Sign-in is taking longer than expected")
        setSubText("Redirecting you to login so you can retry safely.")
        router.replace("/login?error=google_login_timeout")
      }, 10000)

      try {
        setStatusText("Refreshing secure access")
        await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
        })
      } catch {
        if (!finished) {
          finished = true
          window.clearTimeout(timeoutId)
          setStatusText("Unable to finalize sign-in")
          setSubText("Redirecting you to login to try again.")
          router.replace("/login?error=google_finalize_failed")
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
