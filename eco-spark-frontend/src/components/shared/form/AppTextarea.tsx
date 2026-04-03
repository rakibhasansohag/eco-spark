"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface AppTextareaProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  touched: boolean
  errors: string[]
  placeholder?: string
  rows?: number
}

export function AppTextarea({
  id,
  label,
  value,
  onChange,
  onBlur,
  touched,
  errors,
  placeholder,
  rows = 4,
}: AppTextareaProps) {
  const hasError = touched && errors.length > 0

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={hasError}
        className="resize-none"
      />
      {hasError ? <p className="text-sm text-destructive">{errors[0]}</p> : null}
    </div>
  )
}
