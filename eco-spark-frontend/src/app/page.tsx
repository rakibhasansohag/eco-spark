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
    <main className="container mx-auto max-w-7xl space-y-14 px-4 py-12 md:px-6">
      <HeroSection />

      <ServicesSection />

      <HowItWorksSection />

      <section className="space-y-5">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Latest Ideas</h2>
          <p className="mt-2 text-base leading-7 text-muted-foreground">
            Recently approved ideas from the EcoSpark community.
          </p>
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <HomeFeatured initialParams={params} />
        </HydrationBoundary>
      </section>

      <ImpactSection />

      <NewsletterForm />
    </main>
  )
}
