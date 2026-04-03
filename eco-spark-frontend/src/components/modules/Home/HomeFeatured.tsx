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
      <div className="rounded-lg border bg-muted/40 px-6 py-10 text-center">
        <p className="text-sm text-muted-foreground">No approved ideas yet.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {ideas.map((idea: IIdea) => (
        <IdeaCard key={idea.id} idea={idea} href={`/ideas/${idea.id}`} />
      ))}
    </div>
  )
}
