"use client"

import { Lock, Sparkles, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { initiateIdeaPaymentAction } from "@/app/ideas/[id]/_action"
import { formatCurrency } from "@/lib/formatUtils"
import Link from "next/link"

interface PaidIdeaGateProps {
  ideaId: string
  price: string | null
  isLoggedIn: boolean
  userRole?: string
  problemStatement: string
}

export function PaidIdeaGate({ ideaId, price, isLoggedIn, userRole, problemStatement }: PaidIdeaGateProps) {
  const mutation = useMutation({
    mutationFn: () => initiateIdeaPaymentAction(ideaId),
    onSuccess: (result) => {
      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      } else {
        toast.error(result.message ?? "Could not initiate payment")
      }
    },
    onError: () => toast.error("Payment could not be initiated. Please try again."),
  })

  return (
    <div className="relative mt-4 overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-b from-card to-muted/40">
      {/* Teaser: blurred preview of problem statement */}
      <div className="relative px-6 pt-6 pb-2 select-none pointer-events-none">
        <h2 className="text-base font-semibold mb-1">Proposed Solution</h2>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 blur-sm">
          {problemStatement}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-2 line-clamp-3 blur-[5px]">
          This content contains the full proposed solution, implementation strategy, expected impact,
          risk analysis, and external references for this sustainability project...
        </p>
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
      </div>

      {/* Gate UI */}
      <div className="relative flex flex-col items-center gap-4 px-6 py-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 shadow-lg">
          <Lock className="size-6 text-primary" />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="border-primary/40 text-primary text-xs font-semibold px-2.5">
              <Sparkles className="size-3 mr-1" />
              Premium Idea
            </Badge>
          </div>
          <h3 className="text-lg font-bold tracking-tight">Full Content Locked</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            This is a premium sustainability idea. Purchase one-time access to unlock the complete
            solution, implementation roadmap, impact analysis, and all supporting details.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 w-full max-w-xs">
          {!isLoggedIn ? (
            <>
              <Button asChild className="w-full gap-2">
                <Link href="/login">
                  <Eye className="size-4" />
                  Log in to Purchase
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Already have access?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          ) : userRole === "ADMIN" ? (
            <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-3 text-sm text-muted-foreground w-full text-center">
              Admin accounts can view all content without purchasing.
            </div>
          ) : (
            <>
              <Button
                className="w-full gap-2 shadow-md"
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
              >
                <Lock className="size-4" />
                {mutation.isPending
                  ? "Processing…"
                  : price
                    ? `Unlock for ${formatCurrency(parseFloat(price), "USD", true)}`
                    : "Purchase Access"}
              </Button>
              <p className="text-xs text-muted-foreground">
                One-time payment · Instant access · No subscription
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
