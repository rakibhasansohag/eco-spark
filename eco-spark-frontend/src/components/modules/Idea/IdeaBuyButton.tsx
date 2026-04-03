"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/formatUtils"
import { initiateIdeaPaymentAction } from "@/app/ideas/[id]/_action"

interface IdeaBuyButtonProps {
  ideaId: string
  price: string | null
  isLoggedIn: boolean
  userRole?: string
}

export function IdeaBuyButton({ ideaId, price, isLoggedIn, userRole }: IdeaBuyButtonProps) {
  const mutation = useMutation({
    mutationFn: () => initiateIdeaPaymentAction(ideaId),
    onSuccess: (result) => {
      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      } else {
        toast.error(result.message)
      }
    },
    onError: () => toast.error("Payment could not be initiated. Please try again."),
  })

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3">
        <Lock className="size-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          <a href="/login" className="font-medium text-primary hover:underline">
            Log in
          </a>{" "}
          to purchase access to this idea.
        </p>
      </div>
    )
  }

  if (userRole === "ADMIN") {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3">
        <Lock className="size-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Paid idea purchase is available only for member accounts.
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/40 px-4 py-3">
      <div className="flex items-center gap-2">
        <Lock className="size-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Full content is locked. Purchase to unlock.
        </p>
      </div>
      <Button
        size="sm"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
      >
        {mutation.isPending
          ? "Processing…"
          : price
            ? `Buy for ${formatCurrency(parseFloat(price), "USD", true)}`
            : "Purchase Access"}
      </Button>
    </div>
  )
}
