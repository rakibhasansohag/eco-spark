"use client"

import { SectionHeader } from "@/components/shared/SectionHeader"
import { StatsCard } from "@/components/shared/StatsCard"

export function ImpactSection() {
  return (
    <section>
      <SectionHeader title="Why EcoSpark" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Community Members"
          value="2K+"
          description="Growing eco-focused network"
        />
        <StatsCard
          title="Ideas Shared"
          value="1.2K+"
          description="Across energy, water and waste"
        />
        <StatsCard
          title="Ideas Funded"
          value="180+"
          description="Premium solutions unlocked"
        />
        <StatsCard
          title="Avg. Response Time"
          value="<24h"
          description="Fast feedback from peers"
        />
      </div>
    </section>
  )
}
