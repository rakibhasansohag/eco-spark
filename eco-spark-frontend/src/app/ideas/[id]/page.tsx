import { getIdeaById } from "@/services/idea.services"
import { Badge } from "@/components/ui/badge"

export default async function IdeaDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getIdeaById(id)
  const idea = result.data

  return (
    <main className="container mx-auto px-4 py-8">
      <article className="rounded-lg border bg-background p-6">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="secondary">{idea.status}</Badge>
          {idea.isPaid ? <Badge>Paid</Badge> : <Badge variant="outline">Free</Badge>}
        </div>
        <h1 className="text-2xl font-semibold">{idea.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Created {new Date(idea.createdAt).toLocaleDateString()}
        </p>

        <section className="mt-6 space-y-3">
          <div>
            <h2 className="font-medium">Problem Statement</h2>
            <p className="text-sm text-muted-foreground">{idea.problemStatement}</p>
          </div>
          <div>
            <h2 className="font-medium">Proposed Solution</h2>
            <p className="text-sm text-muted-foreground">
              {idea.proposedSolution ?? "Locked for paid access"}
            </p>
          </div>
          <div>
            <h2 className="font-medium">Description</h2>
            <p className="text-sm text-muted-foreground">
              {idea.description ?? "Locked for paid access"}
            </p>
          </div>
        </section>
      </article>
    </main>
  )
}
