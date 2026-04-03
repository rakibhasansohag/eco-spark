import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getIdeasForAdmin } from "@/services/idea.services"
import AdminIdeasManagement from "@/components/modules/Admin/Ideas/IdeasManagement"
import { PageHeader } from "@/components/shared/PageHeader"

export default async function IdeasManagementPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["admin-ideas", params],
    queryFn: () => getIdeasForAdmin(params),
  })

  return (
    <section className="space-y-6">
      <PageHeader title="Ideas Management" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminIdeasManagement searchParams={params} />
      </HydrationBoundary>
    </section>
  )
}
