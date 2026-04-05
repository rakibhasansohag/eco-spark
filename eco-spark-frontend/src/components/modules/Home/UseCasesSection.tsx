import { Factory, GraduationCap, Users } from "lucide-react"
import { SectionHeader } from "@/components/shared/SectionHeader"

const useCases = [
  {
    title: "For Sustainability Teams",
    description:
      "Collect practical ideas from colleagues, prioritize by community votes, and move the strongest proposals into execution.",
    icon: Factory,
  },
  {
    title: "For Campuses & NGOs",
    description:
      "Run challenge-driven campaigns where members submit resource-saving initiatives and refine them through peer feedback.",
    icon: GraduationCap,
  },
  {
    title: "For Local Communities",
    description:
      "Document real environmental pain points and collaborate on low-cost solutions that can be replicated neighborhood to neighborhood.",
    icon: Users,
  },
]

export function UseCasesSection() {
  return (
    <section className="space-y-5">
      <SectionHeader
        title="Built for Real-World Sustainability Work"
        description="EcoSpark supports teams and communities that need measurable progress, not just discussion."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {useCases.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30"
          >
            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
              <item.icon className="size-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
