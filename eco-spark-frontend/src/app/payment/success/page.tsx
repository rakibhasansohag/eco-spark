import { verifyPayment } from "@/services/payment.services"
import Link from "next/link"

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  let title = "Payment Processing"
  let message =
    "We are verifying your payment. This may take a few seconds. If this persists, refresh this page."

  if (session_id) {
    try {
      const verification = await verifyPayment(session_id)
      if (verification.data.status === "SUCCESS") {
        title = "Payment Successful"
        message =
          "Your payment was verified and access to the idea has been unlocked. You can view it from your ideas or continue browsing."
      } else {
        title = "Payment Status"
        message = `Current status: ${verification.data.status}`
      }
    } catch {
      title = "Verification Pending"
      message = "We couldn't verify the payment yet. Please try refreshing shortly."
    }
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <section className="mx-auto max-w-2xl rounded-lg border bg-background p-6 text-center">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/ideas" className="text-sm font-medium text-primary hover:underline">
            Browse Ideas
          </Link>
          <Link
            href="/member/dashboard/my-payments"
            className="text-sm font-medium text-primary hover:underline"
          >
            View My Payments
          </Link>
        </div>
      </section>
    </main>
  )
}
