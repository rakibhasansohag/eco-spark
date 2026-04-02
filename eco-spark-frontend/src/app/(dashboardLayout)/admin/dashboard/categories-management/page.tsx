import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getCategoryList } from "@/services/category.services"
import AdminCategoriesManagement from "@/components/modules/Admin/Categories/CategoriesManagement"

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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminCategoriesManagement searchParams={params} />
    </HydrationBoundary>
  )
}
