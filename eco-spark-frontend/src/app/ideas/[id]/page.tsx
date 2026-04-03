import { getIdeaById } from "@/services/idea.services"
import { Badge } from "@/components/ui/badge"
import { BackLink } from "@/components/shared/BackLink"
import { humanizeStatus, formatDate } from "@/lib/formatUtils"

export default async function IdeaDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getIdeaById(id)
  const idea = result.data

  return (
    <main className="container mx-auto px-4 py-10 md:px-6">
      <BackLink href="/ideas" label="All Ideas" />

      <article className="mt-4 rounded-lg border bg-card p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{humanizeStatus(idea.status)}</Badge>
          {idea.isPaid ? <Badge>Paid</Badge> : <Badge variant="outline">Free</Badge>}
          <span className="text-xs text-muted-foreground">{formatDate(idea.createdAt)}</span>
        </div>

        <h1 className="mt-3 text-2xl font-bold tracking-tight">{idea.title}</h1>

        <div className="mt-6 space-y-5">
          <div>
            <h2 className="text-base font-semibold">Problem Statement</h2>
            <p className="mt-1 text-sm text-muted-foreground">{idea.problemStatement}</p>
          </div>
          <div>
            <h2 className="text-base font-semibold">Proposed Solution</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {idea.proposedSolution ?? "Locked for paid access"}
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold">Description</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {idea.description ?? "Locked for paid access"}
            </p>
          </div>
        </div>
      </article>
    </main>
  )
}
