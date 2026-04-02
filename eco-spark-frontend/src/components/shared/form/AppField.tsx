"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AppFieldProps {
  id: string
  label: string
  type?: "text" | "email" | "password"
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  touched: boolean
  errors: string[]
  placeholder?: string
}

export function AppField({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  touched,
  errors,
  placeholder,
}: AppFieldProps) {
  const hasError = touched && errors.length > 0

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={hasError}
      />
      {hasError ? <p className="text-sm text-destructive">{errors[0]}</p> : null}
    </div>
  )
}
