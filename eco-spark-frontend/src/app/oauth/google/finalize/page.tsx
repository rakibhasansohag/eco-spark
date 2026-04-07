"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1"

export default function GoogleFinalizePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get("next") || "/dashboard"

  useEffect(() => {
    const run = async () => {
      try {
        await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
        })
      } catch {}
      router.replace(nextPath)
    }

    void run()
  }, [nextPath, router])

  return (
    <section className="flex min-h-[40vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Securing your session</p>
        <p className="mt-1 text-xs text-muted-foreground">Please wait while we complete sign-in.</p>
      </div>
    </section>
  )
}
