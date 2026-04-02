"use client"

import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { AppField } from "@/components/shared/form/AppField"
import { AppSubmitButton } from "@/components/shared/form/AppSubmitButton"
import { createNewsletterSubscriptionZodSchema } from "@/zod/newsletterSubscription.validation"
import { subscribeNewsletterAction } from "@/app/(commonLayout)/newsletter/_action"

const normalizeErrors = (errors: unknown[]): string[] =>
  errors.map((error) => {
    if (typeof error === "string") return error
    if (error && typeof error === "object" && "message" in error) {
      const maybeMessage = (error as { message?: unknown }).message
      return typeof maybeMessage === "string" ? maybeMessage : "Invalid value"
    }
    return "Invalid value"
  })

export function NewsletterForm() {
  const mutation = useMutation({ mutationFn: subscribeNewsletterAction })

  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      const result = await mutation.mutateAsync(value)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    },
  })

  return (
    <section className="rounded-lg border bg-background p-6">
      <h2 className="text-xl font-semibold">Stay Updated</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Get updates on trending sustainability ideas and featured discussions.
      </p>
      <form
        className="mt-4 flex flex-col gap-3 md:flex-row md:items-start"
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
      >
        <div className="flex-1">
          <form.Field
            name="email"
            validators={{ onChange: createNewsletterSubscriptionZodSchema.shape.email }}
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
        </div>

        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <div className="md:pt-7 md:w-40">
              <AppSubmitButton
                label="Subscribe"
                loadingLabel="Subscribing..."
                canSubmit={canSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          )}
        </form.Subscribe>
      </form>
    </section>
  )
}
