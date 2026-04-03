"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation"
import { Lightbulb } from "lucide-react"
import { getIdeaList } from "@/services/idea.services"
import { IIdea } from "@/types/idea.types"
import { IdeaCard } from "@/components/shared/card/IdeaCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { SearchBar } from "@/components/shared/form/SearchBar"
import { Button } from "@/components/ui/button"

export default function IdeasListing({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const router = useRouter()
  const pathname = usePathname()

  const { data } = useQuery({
    queryKey: ["public-ideas-list", searchParams],
    queryFn: () => getIdeaList(searchParams),
  })

  const ideas = data?.data ?? []
  const totalPages = data?.meta?.totalPages ?? 1
  const totalCount = data?.meta?.total ?? 0
  const currentPage = Number(searchParams.page ?? "1")

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", String(page))
    router.replace(`${pathname}?${params.toString()}`)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 sm:max-w-sm">
          <SearchBar searchParams={searchParams} />
        </div>
        {data?.meta ? (
          <p className="shrink-0 text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? "idea" : "ideas"}
          </p>
        ) : null}
      </div>

      {/* Grid */}
      {ideas.length === 0 ? (
        <EmptyState
          title="No ideas found"
          description="Try adjusting your search or check back for new community submissions."
          icon={Lightbulb}
          action={
            <Button asChild variant="outline" size="sm">
              <Link href="/member/dashboard/create-idea">Submit an Idea</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ideas.map((idea: IIdea) => (
            <IdeaCard key={idea.id} idea={idea} href={`/ideas/${idea.id}`} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  )
}
