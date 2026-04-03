import { Leaf, Recycle, Lightbulb, Droplets } from "lucide-react"
import { SectionHeader } from "@/components/shared/SectionHeader"

const items = [
  {
    title: "Green Ideas",
    description: "Share and browse community-driven sustainability proposals.",
    icon: Lightbulb,
  },
  {
    title: "Responsible Impact",
    description: "Vote and discuss to surface ideas with real-world potential.",
    icon: Leaf,
  },
  {
    title: "Circular Thinking",
    description: "Reduce waste through practical, community-tested solutions.",
    icon: Recycle,
  },
  {
    title: "Resource Stewardship",
    description: "Water, energy, and transport efficiency at your fingertips.",
    icon: Droplets,
  },
]

export function ServicesSection() {
  return (
    <section className="space-y-5">
      <SectionHeader
        title="What You Can Do"
        description="Practical workflows designed for sustainability-focused collaboration and execution."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30"
          >
            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
              <item.icon className="size-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
