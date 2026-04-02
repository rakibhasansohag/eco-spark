import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getIdeaList } from "@/services/idea.services"
import HomeFeatured from "@/components/modules/Home/HomeFeatured"

export default async function Home() {
  const queryClient = new QueryClient()
  const params = { limit: "6", sortBy: "createdAt", sortOrder: "desc" }
  await queryClient.prefetchQuery({
    queryKey: ["public-ideas", params],
    queryFn: () => getIdeaList(params),
  })

  return (
    <main className="container mx-auto px-4 py-10">
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-semibold">EcoSpark Hub</h1>
        <p className="mt-2 text-muted-foreground">
          Share sustainability ideas, get feedback, and unlock paid insights.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-xl font-semibold">Latest Ideas</h2>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <HomeFeatured initialParams={params} />
        </HydrationBoundary>
      </section>
    </main>
  )
}
