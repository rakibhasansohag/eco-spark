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
    <main className="container mx-auto px-4 py-10 md:px-6">
      <h1 className="text-2xl font-bold tracking-tight">All Ideas</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Browse sustainability ideas shared by our community.
      </p>

      <div className="mt-6">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <IdeasListing searchParams={params} />
        </HydrationBoundary>
      </div>
    </main>
  )
}
