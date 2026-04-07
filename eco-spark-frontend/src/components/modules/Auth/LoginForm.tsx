"use client"

import { useEffect, useMemo, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppField } from "@/components/shared/form/AppField"
import { AppSubmitButton } from "@/components/shared/form/AppSubmitButton"
import { Button } from "@/components/ui/button"
import { GoogleIcon } from "@/components/shared/icons/GoogleIcon"
import { getDefaultDashboardRoute } from "@/lib/authUtils"
import { getAuthErrorMessage } from "@/lib/authErrorMessages"
import { loginAction } from "@/app/(commonLayout)/(authRouteGroup)/login/_action"
import { loginZodSchema } from "@/zod/auth.validation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1"

const normalizeErrors = (errors: unknown[]): string[] =>
  errors.map((error) => {
    if (typeof error === "string") return error
    if (error && typeof error === "object" && "message" in error) {
      const maybeMessage = (error as { message?: unknown }).message
      return typeof maybeMessage === "string" ? maybeMessage : "Invalid value"
    }
    return "Invalid value"
  })

export function LoginForm() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const mutation = useMutation({ mutationFn: loginAction })
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const oauthError = searchParams.get("error")
  const oauthErrorMessage = useMemo(() => getAuthErrorMessage(oauthError), [oauthError])

  useEffect(() => {
    if (!oauthErrorMessage) return
    void fetch("/api/telemetry/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "oauth_error_query",
        errorCode: oauthError,
      }),
    }).catch(() => undefined)
    toast.error(oauthErrorMessage)
    const next = new URLSearchParams(searchParams.toString())
    next.delete("error")
    const nextQuery = next.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname)
  }, [oauthError, oauthErrorMessage, pathname, router, searchParams])

  const displayFormError = formError ?? oauthErrorMessage

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true)
    window.location.href = `${API_BASE_URL}/auth/google`
  }

  const clearFieldError = (field: string) => {
    setServerErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const result = await mutation.mutateAsync(value)

      if (!result.success || !result.data) {
        setServerErrors(result.errors ?? {})
        setFormError(result.message)
        toast.error(result.message)
        return
      }

      setServerErrors({})
      setFormError(null)
      toast.success(result.message)
      const redirectPath = getDefaultDashboardRoute(result.data.role)
      router.push(redirectPath)
      router.refresh()
    },
  })

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Sign in to your EcoSpark Hub account</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full rounded-xl"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
          <GoogleIcon className="size-4" />
          {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
        </Button>
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          {displayFormError ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {displayFormError}
            </p>
          ) : null}

          <form.Field
            name="email"
            validators={{ onChange: loginZodSchema.shape.email }}
          >
            {(field) => (
              (() => {
                const mergedErrors = [
                  ...normalizeErrors(field.state.meta.errors),
                  ...(serverErrors.email ?? []),
                ]
                return (
              <AppField
                id={field.name}
                label="Email"
                type="email"
                value={field.state.value}
                onChange={(value) => {
                  clearFieldError("email")
                  setFormError(null)
                  field.handleChange(value)
                }}
                onBlur={field.handleBlur}
                touched={field.state.meta.isTouched || (serverErrors.email?.length ?? 0) > 0}
                errors={mergedErrors}
                placeholder="you@example.com"
              />
                )
              })()
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onChange: loginZodSchema.shape.password }}
          >
            {(field) => (
              (() => {
                const mergedErrors = [
                  ...normalizeErrors(field.state.meta.errors),
                  ...(serverErrors.password ?? []),
                ]
                return (
              <AppField
                id={field.name}
                label="Password"
                type="password"
                value={field.state.value}
                onChange={(value) => {
                  clearFieldError("password")
                  setFormError(null)
                  field.handleChange(value)
                }}
                onBlur={field.handleBlur}
                touched={field.state.meta.isTouched || (serverErrors.password?.length ?? 0) > 0}
                errors={mergedErrors}
                placeholder="Enter your password"
              />
                )
              })()
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                label="Login"
                loadingLabel="Logging in..."
                canSubmit={canSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </form.Subscribe>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
