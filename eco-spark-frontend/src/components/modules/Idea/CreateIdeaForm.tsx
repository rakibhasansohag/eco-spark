"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AppField } from "@/components/shared/form/AppField"
import { AppTextarea } from "@/components/shared/form/AppTextarea"
import { RichTextEditor } from "@/components/shared/form/RichTextEditor"
import { AppFileInput } from "@/components/shared/form/AppFileInput"
import { AppSubmitButton } from "@/components/shared/form/AppSubmitButton"
import { normalizeErrors } from "@/lib/formUtils"
import { cn } from "@/lib/utils"
import { createIdeaZodSchema, ideaStageOptions } from "@/zod/idea.validation"
import { createIdeaAction } from "@/app/(dashboardLayout)/member/dashboard/create-idea/_action"
import { ApiResponse } from "@/types/api.types"
import { ICategory } from "@/types/category.types"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1"
const IDEA_DRAFT_STORAGE_KEY = "ecoSpark:createIdeaDraft:v1"
type IdeaDraftShape = {
  activeStep?: "core" | "context" | "publishing"
  isPaid?: boolean
  values?: {
    title?: string
    problemStatement?: string
    proposedSolution?: string
    description?: string
    targetAudience?: string
    implementationStage?: "" | (typeof ideaStageOptions)[number]
    estimatedBudgetMin?: number
    estimatedBudgetMax?: number
    timelineWeeks?: number
    locationScope?: string
    expectedImpact?: string
    risksAndMitigation?: string
    externalLinks?: string
    categoryId?: string
    price?: number
  }
}

const getInitialIdeaDraft = (): IdeaDraftShape | null => {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(IDEA_DRAFT_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as IdeaDraftShape
  } catch {
    return null
  }
}

const IDEA_STAGE_LABELS: Record<(typeof ideaStageOptions)[number], string> = {
  CONCEPT: "Concept",
  PILOT: "Pilot",
  SCALING: "Scaling",
  IMPLEMENTED: "Implemented",
}
const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  categoryId: "Category",
  problemStatement: "Problem Statement",
  proposedSolution: "Proposed Solution",
  description: "Description",
  targetAudience: "Target Audience",
  implementationStage: "Implementation Stage",
  estimatedBudgetMin: "Budget Minimum",
  estimatedBudgetMax: "Budget Maximum",
  timelineWeeks: "Timeline",
  locationScope: "Location Scope",
  expectedImpact: "Expected Impact",
  risksAndMitigation: "Risks and Mitigation",
  externalLinks: "External Links",
  price: "Price",
}
const FIELD_STEPS: Record<string, "core" | "context" | "publishing"> = {
  title: "core",
  categoryId: "core",
  problemStatement: "core",
  proposedSolution: "core",
  description: "core",
  targetAudience: "context",
  implementationStage: "context",
  estimatedBudgetMin: "context",
  estimatedBudgetMax: "context",
  timelineWeeks: "context",
  locationScope: "context",
  expectedImpact: "context",
  risksAndMitigation: "context",
  externalLinks: "context",
  price: "publishing",
}
const EMPTY_FORM_VALUES = {
  title: "",
  problemStatement: "",
  proposedSolution: "",
  description: "",
  targetAudience: "",
  implementationStage: "" as "" | (typeof ideaStageOptions)[number],
  estimatedBudgetMin: undefined as number | undefined,
  estimatedBudgetMax: undefined as number | undefined,
  timelineWeeks: undefined as number | undefined,
  locationScope: "",
  expectedImpact: "",
  risksAndMitigation: "",
  externalLinks: "",
  categoryId: "",
  price: undefined as number | undefined,
}

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
  const router = useRouter()
  const initialDraft = useMemo(() => getInitialIdeaDraft(), [])
  const [isPaid, setIsPaid] = useState(initialDraft?.isPaid ?? false)
  const [activeStep, setActiveStep] = useState<"core" | "context" | "publishing">(
    initialDraft?.activeStep ?? "core",
  )
  const [coreSnapshot, setCoreSnapshot] = useState({
    title: initialDraft?.values?.title ?? "",
    problemStatement: initialDraft?.values?.problemStatement ?? "",
    proposedSolution: initialDraft?.values?.proposedSolution ?? "",
    description: initialDraft?.values?.description ?? "",
    categoryId: initialDraft?.values?.categoryId ?? "",
  })
  const [priceSnapshot, setPriceSnapshot] = useState<number | undefined>(initialDraft?.values?.price)
  const [images, setImages] = useState<File[]>([])
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const mutation = useMutation({ mutationFn: createIdeaAction })
  const steps: Array<{
    id: "core" | "context" | "publishing"
    title: string
    subtitle: string
  }> = [
    { id: "core", title: "Core Idea", subtitle: "Problem, solution, category" },
    { id: "context", title: "Impact Context", subtitle: "Execution and outcomes" },
    { id: "publishing", title: "Media & Access", subtitle: "Images and monetization" },
  ]

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
      title: initialDraft?.values?.title ?? EMPTY_FORM_VALUES.title,
      problemStatement: initialDraft?.values?.problemStatement ?? EMPTY_FORM_VALUES.problemStatement,
      proposedSolution: initialDraft?.values?.proposedSolution ?? EMPTY_FORM_VALUES.proposedSolution,
      description: initialDraft?.values?.description ?? EMPTY_FORM_VALUES.description,
      targetAudience: initialDraft?.values?.targetAudience ?? EMPTY_FORM_VALUES.targetAudience,
      implementationStage:
        initialDraft?.values?.implementationStage ?? EMPTY_FORM_VALUES.implementationStage,
      estimatedBudgetMin: initialDraft?.values?.estimatedBudgetMin ?? EMPTY_FORM_VALUES.estimatedBudgetMin,
      estimatedBudgetMax: initialDraft?.values?.estimatedBudgetMax ?? EMPTY_FORM_VALUES.estimatedBudgetMax,
      timelineWeeks: initialDraft?.values?.timelineWeeks ?? EMPTY_FORM_VALUES.timelineWeeks,
      locationScope: initialDraft?.values?.locationScope ?? EMPTY_FORM_VALUES.locationScope,
      expectedImpact: initialDraft?.values?.expectedImpact ?? EMPTY_FORM_VALUES.expectedImpact,
      risksAndMitigation: initialDraft?.values?.risksAndMitigation ?? EMPTY_FORM_VALUES.risksAndMitigation,
      externalLinks: initialDraft?.values?.externalLinks ?? EMPTY_FORM_VALUES.externalLinks,
      categoryId: initialDraft?.values?.categoryId ?? EMPTY_FORM_VALUES.categoryId,
      price: initialDraft?.values?.price ?? EMPTY_FORM_VALUES.price,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData()
      formData.append("title", value.title)
      formData.append("problemStatement", value.problemStatement)
      formData.append("proposedSolution", value.proposedSolution)
      formData.append("description", value.description)
      if (value.targetAudience) formData.append("targetAudience", value.targetAudience)
      if (value.implementationStage)
        formData.append("implementationStage", value.implementationStage)
      if (value.estimatedBudgetMin !== undefined)
        formData.append("estimatedBudgetMin", String(value.estimatedBudgetMin))
      if (value.estimatedBudgetMax !== undefined)
        formData.append("estimatedBudgetMax", String(value.estimatedBudgetMax))
      if (value.timelineWeeks !== undefined)
        formData.append("timelineWeeks", String(value.timelineWeeks))
      if (value.locationScope) formData.append("locationScope", value.locationScope)
      if (value.expectedImpact) formData.append("expectedImpact", value.expectedImpact)
      if (value.risksAndMitigation) formData.append("risksAndMitigation", value.risksAndMitigation)
      if (value.externalLinks) formData.append("externalLinks", value.externalLinks)
      formData.append("categoryId", value.categoryId)
      formData.append("isPaid", String(isPaid))
      if (isPaid && value.price !== undefined) {
        formData.append("price", String(value.price))
      }
      images.forEach((img) => formData.append("images", img))

      const result = await mutation.mutateAsync(formData)
      if (result.success) {
        setIsRedirecting(true)
        setServerErrors({})
        setFormError(null)
        toast.success(result.message)
        resetFormState()
        setImages([])
        setIsPaid(false)
        setCoreSnapshot({
          title: "",
          problemStatement: "",
          proposedSolution: "",
          description: "",
          categoryId: "",
        })
        setPriceSnapshot(undefined)
        setActiveStep("core")
        window.localStorage.removeItem(IDEA_DRAFT_STORAGE_KEY)
        router.replace("/member/dashboard/my-ideas")
        window.setTimeout(() => {
          window.location.href = "/member/dashboard/my-ideas"
        }, 350)
      } else {
        const nextErrors = result.errors ?? {}
        const firstErrorKey = Object.keys(nextErrors)[0]
        if (firstErrorKey) {
          const targetStep = FIELD_STEPS[firstErrorKey]
          if (targetStep) setActiveStep(targetStep)
        }
        const inlineMessage =
          firstErrorKey && nextErrors[firstErrorKey]?.[0]
            ? `${FIELD_LABELS[firstErrorKey] ?? firstErrorKey}: ${nextErrors[firstErrorKey][0]}`
            : result.message

        setServerErrors(nextErrors)
        setFormError(inlineMessage)
        toast.error(inlineMessage)
      }
    },
  })
  useEffect(() => {
    if (isRedirecting) return
    const saveDraft = () => {
      const payload = {
        activeStep,
        isPaid,
        values: form.state.values,
      }
      window.localStorage.setItem(IDEA_DRAFT_STORAGE_KEY, JSON.stringify(payload))
    }
    saveDraft()
    const interval = window.setInterval(saveDraft, 800)
    return () => window.clearInterval(interval)
  }, [activeStep, form, isPaid, isRedirecting])

  const resetFormState = () => {
    form.setFieldValue("title", EMPTY_FORM_VALUES.title)
    form.setFieldValue("problemStatement", EMPTY_FORM_VALUES.problemStatement)
    form.setFieldValue("proposedSolution", EMPTY_FORM_VALUES.proposedSolution)
    form.setFieldValue("description", EMPTY_FORM_VALUES.description)
    form.setFieldValue("targetAudience", EMPTY_FORM_VALUES.targetAudience)
    form.setFieldValue("implementationStage", EMPTY_FORM_VALUES.implementationStage)
    form.setFieldValue("estimatedBudgetMin", EMPTY_FORM_VALUES.estimatedBudgetMin)
    form.setFieldValue("estimatedBudgetMax", EMPTY_FORM_VALUES.estimatedBudgetMax)
    form.setFieldValue("timelineWeeks", EMPTY_FORM_VALUES.timelineWeeks)
    form.setFieldValue("locationScope", EMPTY_FORM_VALUES.locationScope)
    form.setFieldValue("expectedImpact", EMPTY_FORM_VALUES.expectedImpact)
    form.setFieldValue("risksAndMitigation", EMPTY_FORM_VALUES.risksAndMitigation)
    form.setFieldValue("externalLinks", EMPTY_FORM_VALUES.externalLinks)
    form.setFieldValue("categoryId", EMPTY_FORM_VALUES.categoryId)
    form.setFieldValue("price", EMPTY_FORM_VALUES.price)
  }

  const stepCompletion = useMemo(() => {
    const coreComplete =
      createIdeaZodSchema.shape.title.safeParse(coreSnapshot.title).success &&
      createIdeaZodSchema.shape.problemStatement.safeParse(coreSnapshot.problemStatement).success &&
      createIdeaZodSchema.shape.proposedSolution.safeParse(coreSnapshot.proposedSolution).success &&
      createIdeaZodSchema.shape.description.safeParse(coreSnapshot.description).success &&
      createIdeaZodSchema.shape.categoryId.safeParse(coreSnapshot.categoryId).success

    const contextComplete = true

    const publishingComplete =
      !isPaid || createIdeaZodSchema.shape.price.safeParse(priceSnapshot).success

    return {
      core: coreComplete,
      context: contextComplete,
      publishing: publishingComplete,
    }
  }, [coreSnapshot, isPaid, priceSnapshot])
  const canAccessStep = (step: "core" | "context" | "publishing") => {
    if (step === "core") return true
    if (step === "context") return stepCompletion.core
    return stepCompletion.core && stepCompletion.context
  }
  const goToStep = (step: "core" | "context" | "publishing") => {
    if (!canAccessStep(step)) {
      toast.error("Complete the current required step before moving ahead.")
      return
    }
    setActiveStep(step)
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        if (activeStep !== "publishing") {
          goToStep(activeStep === "core" ? "context" : "publishing")
          return
        }
        form.handleSubmit()
      }}
    >
      {isRedirecting ? (
        <div className="rounded-md border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Idea created successfully. Redirecting to your ideas...
          </div>
        </div>
      ) : null}
      {formError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      <div className="rounded-xl border bg-card p-3">
        <div className="grid gap-2 md:grid-cols-3">
          {steps.map((step, index) => {
            const complete = stepCompletion[step.id]
            const active = activeStep === step.id
            const unlocked = canAccessStep(step.id)
            return (
              <div key={step.id}>
                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => goToStep(step.id)}
                  className={cn(
                    "w-full rounded-md p-2 text-center transition",
                    active ? "bg-primary/10" : "bg-background/80",
                    !unlocked && "cursor-not-allowed opacity-60",
                  )}
                >
                  <div
                    className={cn(
                      "mx-auto flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold",
                      active ? "border-primary bg-primary/15 text-primary" : "border-border bg-card",
                    )}
                  >
                    {complete ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <span>{index + 1}</span>}
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-none">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.subtitle}</p>
                  {!unlocked ? <p className="mt-1 text-[11px] text-muted-foreground">Locked</p> : null}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="space-y-5"
        >
      {activeStep === "core" ? (
        <>
      <form.Field name="title" validators={{ onChange: createIdeaZodSchema.shape.title }}>
        {(field) => (
          (() => {
            const mergedErrors = [
              ...normalizeErrors(field.state.meta.errors),
              ...(serverErrors.title ?? []),
            ]
            return (
          <AppField
            id={field.name}
            label="Title"
            value={field.state.value}
            onChange={(value) => {
              clearFieldError("title")
              setFormError(null)
              setCoreSnapshot((prev) => ({ ...prev, title: value }))
              field.handleChange(value)
            }}
            onBlur={field.handleBlur}
            touched={field.state.meta.isTouched || (serverErrors.title?.length ?? 0) > 0}
            errors={mergedErrors}
            placeholder="A concise, descriptive title"
          />
            )
          })()
        )}
      </form.Field>

      <form.Field name="categoryId" validators={{ onChange: createIdeaZodSchema.shape.categoryId }}>
        {(field) => (
          <CategorySelect
            field={{
              ...field,
              handleChange: (value) => {
                clearFieldError("categoryId")
                setFormError(null)
                setCoreSnapshot((prev) => ({ ...prev, categoryId: value }))
                field.handleChange(value)
              },
              state: {
                ...field.state,
                meta: {
                  ...field.state.meta,
                  errors: [
                    ...field.state.meta.errors,
                    ...(serverErrors.categoryId ?? []),
                  ],
                  isTouched:
                    field.state.meta.isTouched || (serverErrors.categoryId?.length ?? 0) > 0,
                },
              },
            }}
          />
        )}
      </form.Field>

      <form.Field
        name="problemStatement"
        validators={{ onChange: createIdeaZodSchema.shape.problemStatement }}
      >
        {(field) => (
          (() => {
            const mergedErrors = [
              ...normalizeErrors(field.state.meta.errors),
              ...(serverErrors.problemStatement ?? []),
            ]
            return (
          <AppTextarea
            id={field.name}
            label="Problem Statement"
            value={field.state.value}
            onChange={(value) => {
              clearFieldError("problemStatement")
              setFormError(null)
              setCoreSnapshot((prev) => ({ ...prev, problemStatement: value }))
              field.handleChange(value)
            }}
            onBlur={field.handleBlur}
            touched={
              field.state.meta.isTouched || (serverErrors.problemStatement?.length ?? 0) > 0
            }
            errors={mergedErrors}
            placeholder="Describe the sustainability problem you're addressing."
            rows={3}
          />
            )
          })()
        )}
      </form.Field>

      <form.Field
        name="proposedSolution"
        validators={{ onChange: createIdeaZodSchema.shape.proposedSolution }}
      >
        {(field) => (
          (() => {
            const mergedErrors = [
              ...normalizeErrors(field.state.meta.errors),
              ...(serverErrors.proposedSolution ?? []),
            ]
            return (
          <AppTextarea
            id={field.name}
            label="Proposed Solution"
            value={field.state.value}
            onChange={(value) => {
              clearFieldError("proposedSolution")
              setFormError(null)
              setCoreSnapshot((prev) => ({ ...prev, proposedSolution: value }))
              field.handleChange(value)
            }}
            onBlur={field.handleBlur}
            touched={
              field.state.meta.isTouched || (serverErrors.proposedSolution?.length ?? 0) > 0
            }
            errors={mergedErrors}
            placeholder="Explain your approach to solving the problem."
            rows={3}
          />
            )
          })()
        )}
      </form.Field>

      <form.Field
        name="description"
        validators={{ onChange: createIdeaZodSchema.shape.description }}
      >
        {(field) => (
          (() => {
            const mergedErrors = [
              ...normalizeErrors(field.state.meta.errors),
              ...(serverErrors.description ?? []),
            ]
            return (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Full Description</Label>
            <RichTextEditor
              value={field.state.value}
              onChange={(value) => {
                clearFieldError("description")
                setFormError(null)
                setCoreSnapshot((prev) => ({ ...prev, description: value }))
                field.handleChange(value)
              }}
              onBlur={field.handleBlur}
              placeholder="Detailed information, implementation steps, expected impact…"
            />
            {field.state.meta.isTouched || (serverErrors.description?.length ?? 0) > 0 ? (
              <p className="text-sm text-destructive">{mergedErrors[0]}</p>
            ) : null}
          </div>
            )
          })()
        )}
      </form.Field>
        </>
      ) : null}
        </motion.div>
      </AnimatePresence>

      {activeStep === "context" ? (
      <>
      <div className="space-y-4 rounded-lg border bg-muted/40 p-4">
        <h3 className="text-sm font-semibold text-foreground">Implementation context</h3>
        <form.Field name="targetAudience">
          {(field) => (
            <AppField
              id={field.name}
              label="Target Audience (optional)"
              value={field.state.value}
              onChange={(value) => {
                clearFieldError("targetAudience")
                setFormError(null)
                field.handleChange(value)
              }}
              onBlur={field.handleBlur}
              touched={field.state.meta.isTouched || (serverErrors.targetAudience?.length ?? 0) > 0}
              errors={[...normalizeErrors(field.state.meta.errors), ...(serverErrors.targetAudience ?? [])]}
              placeholder="Students, local farmers, city households..."
            />
          )}
        </form.Field>

        <form.Field name="implementationStage">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Implementation Stage (optional)</Label>
              <Select
                value={field.state.value || "none"}
                onValueChange={(value) => {
                  clearFieldError("implementationStage")
                  setFormError(null)
                  field.handleChange(value === "none" ? "" : (value as (typeof ideaStageOptions)[number]))
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose current stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not specified</SelectItem>
                  {ideaStageOptions.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {IDEA_STAGE_LABELS[stage]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(field.state.meta.isTouched || (serverErrors.implementationStage?.length ?? 0) > 0) &&
              [...normalizeErrors(field.state.meta.errors), ...(serverErrors.implementationStage ?? [])][0] ? (
                <p className="text-sm text-destructive">
                  {[...normalizeErrors(field.state.meta.errors), ...(serverErrors.implementationStage ?? [])][0]}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-4 rounded-lg border bg-muted/40 p-4">
        <h3 className="text-sm font-semibold text-foreground">Impact planning</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="estimatedBudgetMin">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Budget Min (USD)</Label>
                <Input
                  id={field.name}
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="e.g. 1000"
                  value={field.state.value ?? ""}
                  onChange={(e) => {
                    clearFieldError("estimatedBudgetMin")
                    setFormError(null)
                    field.handleChange(e.target.value ? Number(e.target.value) : undefined)
                  }}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.isTouched || (serverErrors.estimatedBudgetMin?.length ?? 0) > 0 ? (
                  <p className="text-sm text-destructive">
                    {[
                      ...normalizeErrors(field.state.meta.errors),
                      ...(serverErrors.estimatedBudgetMin ?? []),
                    ][0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
          <form.Field name="estimatedBudgetMax">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Budget Max (USD)</Label>
                <Input
                  id={field.name}
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="e.g. 5000"
                  value={field.state.value ?? ""}
                  onChange={(e) => {
                    clearFieldError("estimatedBudgetMax")
                    setFormError(null)
                    field.handleChange(e.target.value ? Number(e.target.value) : undefined)
                  }}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.isTouched || (serverErrors.estimatedBudgetMax?.length ?? 0) > 0 ? (
                  <p className="text-sm text-destructive">
                    {[
                      ...normalizeErrors(field.state.meta.errors),
                      ...(serverErrors.estimatedBudgetMax ?? []),
                    ][0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
          <form.Field name="timelineWeeks">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Timeline (weeks)</Label>
                <Input
                  id={field.name}
                  type="number"
                  min={1}
                  step={1}
                  placeholder="e.g. 12"
                  value={field.state.value ?? ""}
                  onChange={(e) => {
                    clearFieldError("timelineWeeks")
                    setFormError(null)
                    field.handleChange(e.target.value ? Number(e.target.value) : undefined)
                  }}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.isTouched || (serverErrors.timelineWeeks?.length ?? 0) > 0 ? (
                  <p className="text-sm text-destructive">
                    {[
                      ...normalizeErrors(field.state.meta.errors),
                      ...(serverErrors.timelineWeeks ?? []),
                    ][0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
          <form.Field name="locationScope">
            {(field) => (
              <AppField
                id={field.name}
                label="Location Scope"
                value={field.state.value}
                onChange={(value) => {
                  clearFieldError("locationScope")
                  setFormError(null)
                  field.handleChange(value)
                }}
                onBlur={field.handleBlur}
                touched={field.state.meta.isTouched || (serverErrors.locationScope?.length ?? 0) > 0}
                errors={[...normalizeErrors(field.state.meta.errors), ...(serverErrors.locationScope ?? [])]}
                placeholder="City-wide, regional, global..."
              />
            )}
          </form.Field>
        </div>
        <form.Field name="expectedImpact">
          {(field) => (
            <AppTextarea
              id={field.name}
              label="Expected Impact"
              value={field.state.value}
              onChange={(value) => {
                clearFieldError("expectedImpact")
                setFormError(null)
                field.handleChange(value)
              }}
              onBlur={field.handleBlur}
              touched={field.state.meta.isTouched || (serverErrors.expectedImpact?.length ?? 0) > 0}
              errors={[...normalizeErrors(field.state.meta.errors), ...(serverErrors.expectedImpact ?? [])]}
              placeholder="What measurable environmental or social impact is expected?"
              rows={3}
            />
          )}
        </form.Field>
        <form.Field name="risksAndMitigation">
          {(field) => (
            <AppTextarea
              id={field.name}
              label="Risks and Mitigation"
              value={field.state.value}
              onChange={(value) => {
                clearFieldError("risksAndMitigation")
                setFormError(null)
                field.handleChange(value)
              }}
              onBlur={field.handleBlur}
              touched={field.state.meta.isTouched || (serverErrors.risksAndMitigation?.length ?? 0) > 0}
              errors={[
                ...normalizeErrors(field.state.meta.errors),
                ...(serverErrors.risksAndMitigation ?? []),
              ]}
              placeholder="List key risks and how you plan to mitigate them."
              rows={3}
            />
          )}
        </form.Field>
        <form.Field name="externalLinks">
          {(field) => (
            <AppField
              id={field.name}
              label="External Links (comma separated URLs)"
              value={field.state.value}
              onChange={(value) => {
                clearFieldError("externalLinks")
                setFormError(null)
                field.handleChange(value)
              }}
              onBlur={field.handleBlur}
              touched={field.state.meta.isTouched || (serverErrors.externalLinks?.length ?? 0) > 0}
              errors={[...normalizeErrors(field.state.meta.errors), ...(serverErrors.externalLinks ?? [])]}
              placeholder="https://demo.com, https://docs.com"
            />
          )}
        </form.Field>
      </div>
      </>
      ) : null}

      {activeStep === "publishing" ? (
        <>
      <AppFileInput
        id="idea-images"
        label="Images (optional)"
        onChange={setImages}
        maxFiles={5}
        maxSizeMb={5}
      />

      {/* Monetisation */}
      <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
        <div className="flex items-center gap-3">
          <input
            id="isPaid"
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={isPaid}
            onChange={(e) => {
              setIsPaid(e.target.checked)
              if (!e.target.checked) {
                setPriceSnapshot(undefined)
                form.setFieldValue("price", undefined)
              }
            }}
          />
          <Label htmlFor="isPaid" className="cursor-pointer">
            Monetise this idea (charge for full access)
          </Label>
        </div>

        {isPaid ? (
          <form.Field name="price" validators={{ onChange: createIdeaZodSchema.shape.price }}>
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
                    {
                      clearFieldError("price")
                      setFormError(null)
                      const next = e.target.value ? Number(e.target.value) : undefined
                      setPriceSnapshot(next)
                      field.handleChange(next)
                    }
                  }
                  onBlur={field.handleBlur}
                />
                {field.state.meta.isTouched || (serverErrors.price?.length ?? 0) > 0 ? (
                  <p className="text-sm text-destructive">
                    {[
                      ...normalizeErrors(field.state.meta.errors),
                      ...(serverErrors.price ?? []),
                    ][0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>
        ) : null}
      </div>
        </>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-3">
        <Button
          type="button"
          variant="outline"
          disabled={activeStep === "core"}
          onClick={() => goToStep(activeStep === "publishing" ? "context" : "core")}
        >
          Previous Step
        </Button>
        <div className="flex items-center gap-2">
          {activeStep !== "publishing" ? (
            <Button
              type="button"
              disabled={
                activeStep === "core"
                  ? !stepCompletion.core
                  : activeStep === "context"
                    ? !stepCompletion.context
                    : false
              }
              onClick={() =>
                goToStep(activeStep === "core" ? "context" : "publishing")
              }
            >
              Next Step
            </Button>
          ) : null}
        </div>
      </div>

      {activeStep === "publishing" ? (
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
      ) : (
        <Button type="button" className="w-full" onClick={() => goToStep("publishing")}>
          Review Media & Publish
        </Button>
      )}
    </form>
  )
}
