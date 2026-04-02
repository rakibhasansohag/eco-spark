import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getMyIdeas } from "@/services/idea.services"
import MyIdeasManagement from "@/components/modules/Member/Ideas/MyIdeasManagement"

export default async function MyIdeasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["member-my-ideas", params],
    queryFn: () => getMyIdeas(params),
  })

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">My Ideas</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MyIdeasManagement searchParams={params} />
      </HydrationBoundary>
    </section>
  )
}
