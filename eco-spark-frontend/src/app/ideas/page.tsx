import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getIdeaList } from "@/services/idea.services"
import IdeasListing from "@/components/modules/Idea/IdeasListing"

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["public-ideas-list", params],
    queryFn: () => getIdeaList(params),
  })

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">All Ideas</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <IdeasListing searchParams={params} />
      </HydrationBoundary>
    </main>
  )
}
