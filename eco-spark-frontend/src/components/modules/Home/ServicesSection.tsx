"use client"

import { Leaf, Recycle, Lightbulb, Droplets } from "lucide-react"

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
      <h2 className="mb-4 text-xl font-semibold">What You Can Do</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-lg border bg-background p-5">
            <item.icon className="mb-3 text-primary" />
            <h3 className="font-medium">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
