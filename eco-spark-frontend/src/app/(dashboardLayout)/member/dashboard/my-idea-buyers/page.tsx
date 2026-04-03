import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getMyIdeaSales } from "@/services/payment.services"
import MyIdeaBuyersManagement from "@/components/modules/Member/Payments/MyIdeaBuyersManagement"
import { PageHeader } from "@/components/shared/PageHeader"

export default async function MyIdeaBuyersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["my-idea-sales", params],
    queryFn: () => getMyIdeaSales(params),
  })

  return (
    <section className="space-y-6">
      <PageHeader title="My Idea Buyers" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MyIdeaBuyersManagement searchParams={params} />
      </HydrationBoundary>
    </section>
  )
}
