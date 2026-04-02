import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getUserList } from "@/services/user.services"
import AdminUsersManagement from "@/components/modules/Admin/Users/UsersManagement"

export default async function UsersManagementPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["admin-users", params],
    queryFn: () => getUserList(params),
  })

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Users Management</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminUsersManagement searchParams={params} />
      </HydrationBoundary>
    </section>
  )
}
