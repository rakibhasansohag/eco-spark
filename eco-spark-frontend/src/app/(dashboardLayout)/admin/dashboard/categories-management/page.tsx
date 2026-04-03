import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getCategoryList } from "@/services/category.services"
import AdminCategoriesManagement from "@/components/modules/Admin/Categories/CategoriesManagement"
import { PageHeader } from "@/components/shared/PageHeader"

export default async function CategoriesManagementPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["admin-categories", params],
    queryFn: () => getCategoryList(params),
  })

  return (
    <section className="space-y-6">
      <PageHeader title="Categories Management" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminCategoriesManagement searchParams={params} />
      </HydrationBoundary>
    </section>
  )
}
