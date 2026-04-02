"use client"

import { useMutation } from "@tanstack/react-query"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppField } from "@/components/shared/form/AppField"
import { AppSubmitButton } from "@/components/shared/form/AppSubmitButton"
import { getDefaultDashboardRoute } from "@/lib/authUtils"
import { loginAction } from "@/app/(commonLayout)/(authRouteGroup)/login/_action"
import { loginZodSchema } from "@/zod/auth.validation"

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
  const mutation = useMutation({ mutationFn: loginAction })

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const result = await mutation.mutateAsync(value)

      if (!result.success || !result.data) {
        toast.error(result.message)
        return
      }

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
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.Field
            name="email"
            validators={{ onChange: loginZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                id={field.name}
                label="Email"
                type="email"
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                touched={field.state.meta.isTouched}
                errors={normalizeErrors(field.state.meta.errors)}
                placeholder="you@example.com"
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onChange: loginZodSchema.shape.password }}
          >
            {(field) => (
              <AppField
                id={field.name}
                label="Password"
                type="password"
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                touched={field.state.meta.isTouched}
                errors={normalizeErrors(field.state.meta.errors)}
                placeholder="Enter your password"
              />
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
