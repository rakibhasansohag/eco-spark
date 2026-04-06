import { SectionHeader } from "@/components/shared/SectionHeader"
import { ImpactMetricCard } from "@/components/modules/Home/ImpactMetricCard"

export function ImpactSection() {
  return (
    <section className="space-y-5">
      <SectionHeader
        title="Why EcoSpark"
        description="A focused product environment for measurable sustainability collaboration."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <ImpactMetricCard
          title="Community Members"
          description="Growing eco-focused network"
          target={2000}
          mode="compact-plus"
        />
        <ImpactMetricCard
          title="Ideas Shared"
          description="Across energy, water and waste"
          target={1200}
          mode="compact-plus"
        />
        <ImpactMetricCard
          title="Ideas Funded"
          description="Premium solutions unlocked"
          target={180}
          mode="plus"
        />
        <ImpactMetricCard
          title="Avg. Response Time"
          description="Fast feedback from peers"
          target={24}
          mode="lt-hours"
        />
      </div>
    </section>
  )
}
