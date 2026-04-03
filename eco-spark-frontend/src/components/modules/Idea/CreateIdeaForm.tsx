"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { AppField } from "@/components/shared/form/AppField"
import { AppTextarea } from "@/components/shared/form/AppTextarea"
import { AppSubmitButton } from "@/components/shared/form/AppSubmitButton"
import { normalizeErrors } from "@/lib/formUtils"
import { createIdeaZodSchema } from "@/zod/idea.validation"
import { createIdeaAction } from "@/app/(dashboardLayout)/member/dashboard/create-idea/_action"
import { ApiResponse } from "@/types/api.types"
import { ICategory } from "@/types/category.types"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1"

function CategorySelect({
  field,
}: {
  field: {
    name: string
    state: { value: string; meta: { isTouched: boolean; errors: unknown[] } }
    handleChange: (value: string) => void
    handleBlur: () => void
  }
}) {
  const { data } = useQuery({
    queryKey: ["categories", { limit: "100" }],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/categories?limit=100`, {
        credentials: "include",
      })
      return (await res.json()) as ApiResponse<ICategory[]>
    },
  })

  const errors = normalizeErrors(field.state.meta.errors)
  const hasError = field.state.meta.isTouched && errors.length > 0

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>Category</Label>
      <Select value={field.state.value} onValueChange={field.handleChange} required>
        <SelectTrigger className="w-full" aria-invalid={hasError}>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {data?.data?.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError ? <p className="text-sm text-destructive">{errors[0]}</p> : null}
    </div>
  )
}

export function CreateIdeaForm() {
  const [isPaid, setIsPaid] = useState(false)
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
      const result = await mutation.mutateAsync({ ...value, isPaid })
      if (result.success) {
        toast.success(result.message)
        form.reset()
        setIsPaid(false)
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
            placeholder="A concise, descriptive title"
          />
        )}
      </form.Field>

      <form.Field name="categoryId" validators={{ onChange: createIdeaZodSchema.shape.categoryId }}>
        {(field) => <CategorySelect field={field} />}
      </form.Field>

      <form.Field
        name="problemStatement"
        validators={{ onChange: createIdeaZodSchema.shape.problemStatement }}
      >
        {(field) => (
          <AppTextarea
            id={field.name}
            label="Problem Statement"
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            touched={field.state.meta.isTouched}
            errors={normalizeErrors(field.state.meta.errors)}
            placeholder="Describe the environmental or sustainability problem you're addressing."
            rows={3}
          />
        )}
      </form.Field>

      <form.Field
        name="proposedSolution"
        validators={{ onChange: createIdeaZodSchema.shape.proposedSolution }}
      >
        {(field) => (
          <AppTextarea
            id={field.name}
            label="Proposed Solution"
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            touched={field.state.meta.isTouched}
            errors={normalizeErrors(field.state.meta.errors)}
            placeholder="Explain your approach to solving the problem."
            rows={3}
          />
        )}
      </form.Field>

      <form.Field
        name="description"
        validators={{ onChange: createIdeaZodSchema.shape.description }}
      >
        {(field) => (
          <AppTextarea
            id={field.name}
            label="Full Description"
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            touched={field.state.meta.isTouched}
            errors={normalizeErrors(field.state.meta.errors)}
            placeholder="Provide detailed information, implementation steps, expected impact…"
            rows={5}
          />
        )}
      </form.Field>

      {/* Monetisation toggle */}
      <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
        <div className="flex items-center gap-3">
          <input
            id="isPaid"
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={isPaid}
            onChange={(e) => {
              setIsPaid(e.target.checked)
              form.setFieldValue("isPaid", e.target.checked)
              if (!e.target.checked) form.setFieldValue("price", undefined)
            }}
          />
          <Label htmlFor="isPaid" className="cursor-pointer">
            Monetise this idea (charge for full access)
          </Label>
        </div>

        {isPaid ? (
          <form.Field
            name="price"
            validators={{ onChange: createIdeaZodSchema.shape.price }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Price (USD)</Label>
                <Input
                  id={field.name}
                  type="number"
                  min={1}
                  step={0.01}
                  placeholder="e.g. 9.99"
                  value={field.state.value ?? ""}
                  onChange={(e) =>
                    field.handleChange(e.target.value ? Number(e.target.value) : undefined)
                  }
                  onBlur={field.handleBlur}
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                  <p className="text-sm text-destructive">
                    {normalizeErrors(field.state.meta.errors)[0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
        ) : null}
      </div>

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <AppSubmitButton
            label="Create Idea"
            loadingLabel="Creating…"
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </form.Subscribe>
    </form>
  )
}
