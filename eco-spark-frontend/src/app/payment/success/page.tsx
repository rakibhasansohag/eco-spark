import Link from "next/link"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { verifyPayment } from "@/services/payment.services"

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  let title = "Payment Processing"
  let message =
    "We are verifying your payment. This may take a few seconds. If this persists, refresh this page."
  let Icon = Clock

  if (session_id) {
    try {
      const verification = await verifyPayment(session_id)
      if (verification.data.status === "SUCCESS") {
        title = "Payment Successful"
        message =
          "Your payment was verified and access to the idea has been unlocked. You can view it from your ideas or continue browsing."
        Icon = CheckCircle
      } else {
        title = "Payment Status"
        message = `Current status: ${verification.data.status}`
        Icon = Clock
      }
    } catch {
      title = "Verification Pending"
      message = "We couldn't verify the payment yet. Please try refreshing shortly."
      Icon = XCircle
    }
  }

  return (
    <main className="container mx-auto px-4 py-10 md:px-6">
      <div className="mx-auto max-w-lg rounded-lg border bg-card p-8 text-center">
        <Icon className="mx-auto size-12 text-muted-foreground" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/ideas">Browse Ideas</Link>
          </Button>
          <Button asChild>
            <Link href="/member/dashboard/my-payments">View My Payments</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
