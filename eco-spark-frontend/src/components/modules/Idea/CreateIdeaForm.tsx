"use client"

import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { AppField } from "@/components/shared/form/AppField"
import { AppSubmitButton } from "@/components/shared/form/AppSubmitButton"
import { createIdeaZodSchema } from "@/zod/idea.validation"
import { createIdeaAction } from "@/app/(dashboardLayout)/member/dashboard/create-idea/_action"

const normalizeErrors = (errors: unknown[]): string[] =>
  errors.map((error) => {
    if (typeof error === "string") return error
    if (error && typeof error === "object" && "message" in error) {
      const maybeMessage = (error as { message?: unknown }).message
      return typeof maybeMessage === "string" ? maybeMessage : "Invalid value"
    }
    return "Invalid value"
  })

export function CreateIdeaForm() {
  const mutation = useMutation({ mutationFn: createIdeaAction })

  const form = useForm({
    defaultValues: {
      title: "",
      problemStatement: "",
      proposedSolution: "",
      description: "",
      categoryId: "",
      isPaid: false as boolean | undefined,
      price: undefined as number | undefined,
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
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field name="title" validators={{ onChange: createIdeaZodSchema.shape.title }}>
        {(field) => (
          <AppField
            id={field.name}
            label="Title"
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            touched={field.state.meta.isTouched}
            errors={normalizeErrors(field.state.meta.errors)}
            placeholder="A concise title"
          />
        )}
      </form.Field>

      <form.Field
        name="problemStatement"
        validators={{ onChange: createIdeaZodSchema.shape.problemStatement }}
      >
        {(field) => (
          <AppField
            id={field.name}
            label="Problem Statement"
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            touched={field.state.meta.isTouched}
            errors={normalizeErrors(field.state.meta.errors)}
            placeholder="What's the problem?"
          />
        )}
      </form.Field>

      <form.Field
        name="proposedSolution"
        validators={{ onChange: createIdeaZodSchema.shape.proposedSolution }}
      >
        {(field) => (
          <AppField
            id={field.name}
            label="Proposed Solution"
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            touched={field.state.meta.isTouched}
            errors={normalizeErrors(field.state.meta.errors)}
            placeholder="Your approach"
          />
        )}
      </form.Field>

      <form.Field
        name="description"
        validators={{ onChange: createIdeaZodSchema.shape.description }}
      >
        {(field) => (
          <AppField
            id={field.name}
            label="Description"
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            touched={field.state.meta.isTouched}
            errors={normalizeErrors(field.state.meta.errors)}
            placeholder="Detailed description"
          />
        )}
      </form.Field>

      <form.Field
        name="categoryId"
        validators={{ onChange: createIdeaZodSchema.shape.categoryId }}
      >
        {(field) => (
          <AppField
            id={field.name}
            label="Category ID"
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            touched={field.state.meta.isTouched}
            errors={normalizeErrors(field.state.meta.errors)}
            placeholder="Category ID"
          />
        )}
      </form.Field>

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <AppSubmitButton
            label="Create Idea"
            loadingLabel="Creating..."
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </form.Subscribe>
    </form>
  )
}
