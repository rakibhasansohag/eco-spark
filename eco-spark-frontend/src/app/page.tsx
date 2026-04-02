import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getIdeaList } from "@/services/idea.services"
import HomeFeatured from "@/components/modules/Home/HomeFeatured"
import { HeroSection } from "@/components/modules/Home/HeroSection"
import { ServicesSection } from "@/components/modules/Home/ServicesSection"
import { ImpactSection } from "@/components/modules/Home/ImpactSection"
import { NewsletterForm } from "@/components/modules/Home/NewsletterForm"

export default async function Home() {
  const queryClient = new QueryClient()
  const params = { limit: "6", sortBy: "createdAt", sortOrder: "desc" }
  await queryClient.prefetchQuery({
    queryKey: ["public-ideas", params],
    queryFn: () => getIdeaList(params),
  })

  return (
    <main className="container mx-auto px-4 py-10">
      <HeroSection />

      <section className="mt-10">
        <ServicesSection />
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold">Latest Ideas</h2>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <HomeFeatured initialParams={params} />
        </HydrationBoundary>
      </section>

      <section className="mt-10">
        <ImpactSection />
      </section>

      <section className="mt-10">
        <NewsletterForm />
      </section>
    </main>
  )
}
