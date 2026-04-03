"use client"

import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { AppField } from "@/components/shared/form/AppField"
import { AppSubmitButton } from "@/components/shared/form/AppSubmitButton"
import { normalizeErrors } from "@/lib/formUtils"
import { updateProfileAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/my-profile/_action"

interface MyProfileFormProps {
  initialName: string
  initialImage: string
}

export function MyProfileForm({ initialName, initialImage }: MyProfileFormProps) {
  const mutation = useMutation({ mutationFn: updateProfileAction })

  const form = useForm({
    defaultValues: {
      name: initialName,
      image: initialImage,
    },
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
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field name="name">
        {(field) => (
          <AppField
            id={field.name}
            label="Name"
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            touched={field.state.meta.isTouched}
            errors={normalizeErrors(field.state.meta.errors)}
            placeholder="Your full name"
          />
        )}
      </form.Field>

      <form.Field name="image">
        {(field) => (
          <AppField
            id={field.name}
            label="Profile Image URL"
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            touched={field.state.meta.isTouched}
            errors={normalizeErrors(field.state.meta.errors)}
            placeholder="https://example.com/avatar.jpg"
          />
        )}
      </form.Field>

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <AppSubmitButton
            label="Save Changes"
            loadingLabel="Saving…"
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </form.Subscribe>
    </form>
  )
}
