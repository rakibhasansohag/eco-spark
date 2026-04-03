import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getMyPayments, verifyPayment } from "@/services/payment.services"
import MyPaymentsManagement from "@/components/modules/Member/Payments/MyPaymentsManagement"
import { PageHeader } from "@/components/shared/PageHeader"

export default async function MyPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const { session_id, ...listParams } = params
  const queryClient = new QueryClient()
  let paymentNotice: string | null = null

  if (session_id) {
    try {
      const verification = await verifyPayment(session_id)
      if (verification.data.status === "SUCCESS") {
        paymentNotice = "Payment verified successfully. Idea access has been unlocked."
      } else {
        paymentNotice = `Payment status: ${verification.data.status}`
      }
    } catch {
      paymentNotice = "Unable to verify payment yet. Please refresh in a few moments."
    }
  }

  await queryClient.prefetchQuery({
    queryKey: ["member-payments", listParams],
    queryFn: () => getMyPayments(listParams),
  })

  return (
    <section className="space-y-6">
      <PageHeader title="My Payments" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MyPaymentsManagement searchParams={listParams} paymentNotice={paymentNotice} />
      </HydrationBoundary>
    </section>
  )
}
