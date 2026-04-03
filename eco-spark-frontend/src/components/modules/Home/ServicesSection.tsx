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
    <section>
      <SectionHeader title="What You Can Do" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-lg border bg-card p-5">
            <item.icon className="mb-3 size-5 text-primary" />
            <h3 className="text-base font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
