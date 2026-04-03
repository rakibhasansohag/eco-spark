import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getIdeaList } from "@/services/idea.services"
import HomeFeatured from "@/components/modules/Home/HomeFeatured"
import { HeroSection } from "@/components/modules/Home/HeroSection"
import { ServicesSection } from "@/components/modules/Home/ServicesSection"
import { ImpactSection } from "@/components/modules/Home/ImpactSection"
import { NewsletterForm } from "@/components/modules/Home/NewsletterForm"
import { HowItWorksSection } from "@/components/modules/Home/HowItWorksSection"

export default async function Home() {
  const queryClient = new QueryClient()
  const params = { limit: "6", sortBy: "createdAt", sortOrder: "desc" }
  await queryClient.prefetchQuery({
    queryKey: ["public-ideas", params],
    queryFn: () => getIdeaList(params),
  })

  return (
    <main className="container mx-auto space-y-12 px-4 py-10 md:px-6">
      <HeroSection />

      <ServicesSection />

      <HowItWorksSection />

      <section>
        <h2 className="mb-4 text-xl font-semibold">Latest Ideas</h2>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <HomeFeatured initialParams={params} />
        </HydrationBoundary>
      </section>

      <ImpactSection />

      <NewsletterForm />
    </main>
  )
}
