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
    <section className="rounded-2xl border bg-card p-6 md:p-8">
      <SectionHeader
        title="How It Works"
        description="A simple flow to transform environmental challenges into actionable outcomes."
        className="mb-6"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-lg border bg-muted/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Step {index + 1}
            </p>
            <h3 className="mt-1 text-base font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
