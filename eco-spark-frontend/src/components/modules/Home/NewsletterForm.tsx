"use client"

import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { createNewsletterSubscriptionZodSchema } from "@/zod/newsletterSubscription.validation"
import { subscribeNewsletterAction } from "@/app/(commonLayout)/newsletter/_action"
import { normalizeErrors } from "@/lib/formUtils"
import { SectionHeader } from "@/components/shared/SectionHeader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function NewsletterForm() {
  const mutation = useMutation({ mutationFn: subscribeNewsletterAction })

  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      const result = await mutation.mutateAsync(value)
      if (result.success) {
        toast.success(result.message)
        form.reset()
      } else {
        toast.error(result.message)
      }
    },
  })

  return (
    <section className="rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)] md:p-8">
      <SectionHeader
        title="Stay Updated"
        description="Get updates on trending sustainability ideas and featured discussions."
        className="mb-5"
      />
      <form
        className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="email"
          validators={{ onChange: createNewsletterSubscriptionZodSchema.shape.email }}
        >
          {(field) => {
            const errors = normalizeErrors(field.state.meta.errors)
            const hasError = field.state.meta.isTouched && errors.length > 0

            return (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  type="email"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="you@example.com"
                  aria-invalid={hasError}
                  className="h-10 rounded-xl bg-background px-3"
                />
                {hasError ? (
                  <p className="text-xs text-destructive">{errors[0]}</p>
                ) : null}
              </div>
            )
          }}
        </form.Field>

        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="h-10 rounded-xl px-6"
            >
              {isSubmitting ? "Subscribing…" : "Subscribe"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </section>
  )
}
