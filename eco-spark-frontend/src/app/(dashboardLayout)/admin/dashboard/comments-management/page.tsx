import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getCommentList } from "@/services/comment.services"
import AdminCommentsManagement from "@/components/modules/Admin/Comments/CommentsManagement"

export default async function CommentsManagementPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["admin-comments", params],
    queryFn: () => getCommentList(params),
  })

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Comments Management</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AdminCommentsManagement searchParams={params} />
      </HydrationBoundary>
    </section>
  )
}
