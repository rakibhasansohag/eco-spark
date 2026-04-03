import { SectionHeader } from "@/components/shared/SectionHeader"

const steps = [
  {
    title: "Share a Challenge",
    description: "Post a real sustainability issue from your community, campus, or company.",
  },
  {
    title: "Propose a Solution",
    description: "Submit practical ideas with implementation notes and expected impact.",
  },
  {
    title: "Get Community Validation",
    description: "Receive votes and comments to improve quality and identify promising ideas.",
  },
  {
    title: "Unlock Premium Insights",
    description: "Purchase access to detailed paid ideas and advanced implementation guides.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)] md:p-8">
      <SectionHeader
        title="How It Works"
        description="A simple flow to transform environmental challenges into actionable outcomes."
        className="mb-6"
      />
      <div className="grid gap-5 md:grid-cols-2">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-xl border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Step {index + 1}
            </p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
