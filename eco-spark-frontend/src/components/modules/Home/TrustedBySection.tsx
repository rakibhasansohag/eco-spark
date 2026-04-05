import { SectionHeader } from "@/components/shared/SectionHeader"

const organizations = [
  "Green Campus Network",
  "City Climate Lab",
  "EarthForward Collective",
  "Circular Ops Alliance",
  "Impact Builders Guild",
  "Renew Initiative Hub",
]

export function TrustedBySection() {
  return (
    <section className="space-y-5">
      <SectionHeader
        title="Trusted By Sustainability-Focused Teams"
        description="EcoSpark-style workflows are being adopted by communities and organizations that need practical climate action."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((name) => (
          <div
            key={name}
            className="rounded-xl border bg-card px-4 py-4 text-center text-sm font-semibold tracking-tight text-muted-foreground shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]"
          >
            {name}
          </div>
        ))}
      </div>
    </section>
  )
}
