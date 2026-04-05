import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getIdeaList } from "@/services/idea.services"
import HomeFeatured from "@/components/modules/Home/HomeFeatured"
import { HeroSection } from "@/components/modules/Home/HeroSection"
import { ServicesSection } from "@/components/modules/Home/ServicesSection"
import { ImpactSection } from "@/components/modules/Home/ImpactSection"
import { NewsletterForm } from "@/components/modules/Home/NewsletterForm"
import { HowItWorksSection } from "@/components/modules/Home/HowItWorksSection"
import { FadeInSection } from "@/components/shared/motion/FadeInSection"
import { UseCasesSection } from "@/components/modules/Home/UseCasesSection"
import { HomeFaqSection } from "@/components/modules/Home/HomeFaqSection"
import { ActionCtaSection } from "@/components/modules/Home/ActionCtaSection"

export default async function Home() {
  const queryClient = new QueryClient()
  const params = { limit: "6", sortBy: "createdAt", sortOrder: "desc" }
  await queryClient.prefetchQuery({
    queryKey: ["public-ideas", params],
    queryFn: () => getIdeaList(params),
  })

  return (
    <main className="container mx-auto max-w-7xl space-y-14 px-4 py-12 md:px-6">
      <FadeInSection>
        <HeroSection />
      </FadeInSection>

      <FadeInSection delay={0.04}>
        <ServicesSection />
      </FadeInSection>

      <FadeInSection delay={0.08}>
        <HowItWorksSection />
      </FadeInSection>

      <FadeInSection delay={0.12}>
        <UseCasesSection />
      </FadeInSection>

      <FadeInSection delay={0.16}>
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
      </FadeInSection>

      <FadeInSection delay={0.2}>
        <ImpactSection />
      </FadeInSection>

      <FadeInSection delay={0.24}>
        <HomeFaqSection />
      </FadeInSection>

      <FadeInSection delay={0.28}>
        <ActionCtaSection />
      </FadeInSection>

      <FadeInSection delay={0.32}>
        <NewsletterForm />
      </FadeInSection>
    </main>
  )
}
