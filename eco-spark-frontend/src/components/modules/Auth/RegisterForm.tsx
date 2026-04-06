"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppField } from "@/components/shared/form/AppField"
import { AppSubmitButton } from "@/components/shared/form/AppSubmitButton"
import { Button } from "@/components/ui/button"
import { GoogleIcon } from "@/components/shared/icons/GoogleIcon"
import { getDefaultDashboardRoute } from "@/lib/authUtils"
import { registerAction } from "@/app/(commonLayout)/(authRouteGroup)/register/_action"
import { registerZodSchema } from "@/zod/auth.validation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1"
const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, "")

const normalizeErrors = (errors: unknown[]): string[] =>
  errors.map((error) => {
    if (typeof error === "string") return error
    if (error && typeof error === "object" && "message" in error) {
      const maybeMessage = (error as { message?: unknown }).message
      return typeof maybeMessage === "string" ? maybeMessage : "Invalid value"
    }
    return "Invalid value"
  })

export function RegisterForm() {
  const router = useRouter()
  const mutation = useMutation({ mutationFn: registerAction })
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true)
      const callbackURL = `${window.location.origin}/oauth/google/callback`
      const response = await fetch(`${BACKEND_BASE_URL}/api/auth/sign-in/social`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          provider: "google",
          callbackURL,
          disableRedirect: true,
        }),
      })

      const payload = (await response.json()) as { url?: string }
      if (!response.ok || !payload?.url) {
        throw new Error("Google sign-in initiation failed")
      }

      window.location.href = payload.url
    } catch {
      toast.error("Google sign-in failed. Please try again.")
    } finally {
      setIsGoogleLoading(false)
    }
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
      name: "",
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
        <CardTitle>Register</CardTitle>
        <CardDescription>Create your EcoSpark Hub account</CardDescription>
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
          {formError ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {formError}
            </p>
          ) : null}

          <form.Field
            name="name"
            validators={{ onChange: registerZodSchema.shape.name }}
          >
            {(field) => (
              (() => {
                const mergedErrors = [
                  ...normalizeErrors(field.state.meta.errors),
                  ...(serverErrors.name ?? []),
                ]
                return (
              <AppField
                id={field.name}
                label="Full name"
                value={field.state.value}
                onChange={(value) => {
                  clearFieldError("name")
                  setFormError(null)
                  field.handleChange(value)
                }}
                onBlur={field.handleBlur}
                touched={field.state.meta.isTouched || (serverErrors.name?.length ?? 0) > 0}
                errors={mergedErrors}
                placeholder="Your full name"
              />
                )
              })()
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{ onChange: registerZodSchema.shape.email }}
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
            validators={{ onChange: registerZodSchema.shape.password }}
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
                placeholder="At least 6 characters"
              />
                )
              })()
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                label="Register"
                loadingLabel="Creating account..."
                canSubmit={canSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </form.Subscribe>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
