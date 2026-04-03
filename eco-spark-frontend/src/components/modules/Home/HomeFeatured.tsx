"use client"

import { useQuery } from "@tanstack/react-query"
import { getIdeaList } from "@/services/idea.services"
import { IIdea } from "@/types/idea.types"
import { IdeaCard } from "@/components/shared/card/IdeaCard"

export default function HomeFeatured({
  initialParams,
}: {
  initialParams: Record<string, string>
}) {
  const { data } = useQuery({
    queryKey: ["public-ideas", initialParams],
    queryFn: () => getIdeaList(initialParams),
  })

  const ideas = data?.data ?? []

  if (ideas.length === 0) {
    return (
      <div className="rounded-xl border bg-card px-6 py-12 text-center shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
        <p className="text-base font-medium">No approved ideas yet.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          New approved ideas will appear here automatically.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {ideas.map((idea: IIdea) => (
        <IdeaCard key={idea.id} idea={idea} href={`/ideas/${idea.id}`} />
      ))}
    </div>
  )
}
