"use client"

import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { AppField } from "@/components/shared/form/AppField"
import { Button } from "@/components/ui/button"
import { createNewsletterSubscriptionZodSchema } from "@/zod/newsletterSubscription.validation"
import { subscribeNewsletterAction } from "@/app/(commonLayout)/newsletter/_action"
import { normalizeErrors } from "@/lib/formUtils"
import { SectionHeader } from "@/components/shared/SectionHeader"

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
    <section className="rounded-lg border bg-card p-6">
      <SectionHeader
        title="Stay Updated"
        description="Get updates on trending sustainability ideas and featured discussions."
        className="mb-4"
      />
      <form
        className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
      >
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

        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Subscribing…" : "Subscribe"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </section>
  )
}
