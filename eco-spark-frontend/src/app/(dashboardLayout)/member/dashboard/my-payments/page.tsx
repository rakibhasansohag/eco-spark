import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getMyPayments } from "@/services/payment.services"
import MyPaymentsManagement from "@/components/modules/Member/Payments/MyPaymentsManagement"

export default async function MyPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["member-payments", params],
    queryFn: () => getMyPayments(params),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MyPaymentsManagement searchParams={params} />
    </HydrationBoundary>
  )
}
