"use client"

import { Button } from "@/components/ui/button"

interface AppSubmitButtonProps {
  label: string
  loadingLabel: string
  canSubmit: boolean
  isSubmitting: boolean
}

export function AppSubmitButton({
  label,
  loadingLabel,
  canSubmit,
  isSubmitting,
}: AppSubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
      {isSubmitting ? loadingLabel : label}
    </Button>
  )
}
