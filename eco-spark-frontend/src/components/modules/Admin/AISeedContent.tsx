"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Sparkles, Bot, Loader2, CheckCircle2, ExternalLink, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { autoSeedIdeas, getIdeasForAdmin } from "@/services/idea.services"
import { IIdea } from "@/types/idea.types"
import { formatDate } from "@/lib/formatUtils"
import Link from "next/link"

export default function AISeedContent() {
  const qc = useQueryClient()
  const [seededResults, setSeededResults] = useState<IIdea[]>([])
  const [lastRun, setLastRun] = useState<string | null>(null)

  // Fetch ideas that look AI-seeded (approved, recent)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-ai-seeded-ideas"],
    queryFn: () => getIdeasForAdmin({ limit: "50", sortBy: "createdAt", sortOrder: "desc" }),
  })

  const seedMutation = useMutation({
    mutationFn: () => autoSeedIdeas(),
    onSuccess: (result) => {
      const ideas = result.data ?? []
      setSeededResults(ideas)
      setLastRun(new Date().toISOString())
      toast.success(`✅ ${ideas.length} AI ideas seeded successfully!`)
      qc.invalidateQueries({ queryKey: ["admin-ai-seeded-ideas"] })
      refetch()
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to seed ideas. Check GEMINI_API_KEY in .env")
    },
  })

  const allIdeas: IIdea[] = data?.data ?? []

  return (
    <div className="space-y-8">
      {/* Control Panel */}
      <div className="rounded-xl border bg-gradient-to-r from-card to-muted/30 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Bot className="size-4 text-primary" />
              </div>
              <h2 className="font-semibold text-base">Gemini 2.5 Flash Engine</h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-lg">
              Automatically generate 3 unique, high-quality sustainability ideas using Google Gemini AI.
              Each idea is seeded directly as <Badge variant="secondary" className="text-xs">APPROVED</Badge> and immediately visible to all users.
            </p>
            {lastRun && (
              <p className="text-xs text-muted-foreground">
                Last seeded: <span className="font-medium">{formatDate(lastRun)}</span> — {seededResults.length} ideas added
              </p>
            )}
          </div>
          <Button
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="gap-2 shrink-0 min-w-[160px]"
            size="lg"
          >
            {seedMutation.isPending ? (
              <><Loader2 className="size-4 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="size-4" /> Seed AI Ideas</>
            )}
          </Button>
        </div>
      </div>

      {/* Last Seed Results */}
      {seededResults.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <CheckCircle2 className="size-4" />
            {seededResults.length} ideas just seeded successfully
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {seededResults.map((idea) => (
              <div key={idea.id} className="rounded-lg border border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900 p-4">
                <p className="text-sm font-semibold line-clamp-2">{idea.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{idea.problemStatement}</p>
                <Link
                  href={`/ideas/${idea.id}`}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  View <ExternalLink className="size-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ideas Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            All Ideas in Database ({allIdeas.length})
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`size-3 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Created</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Link</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-3"><div className="h-4 w-48 bg-muted animate-pulse rounded" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 w-20 bg-muted animate-pulse rounded" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 w-12 bg-muted animate-pulse rounded" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 w-24 bg-muted animate-pulse rounded" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-8 bg-muted animate-pulse rounded" /></td>
                  </tr>
                ))
              ) : allIdeas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">
                    No ideas yet. Click &ldquo;Seed AI Ideas&rdquo; to generate the first batch.
                  </td>
                </tr>
              ) : (
                allIdeas.map((idea, idx) => (
                  <tr key={idea.id} className={`border-b transition-colors hover:bg-muted/30 ${idx % 2 === 0 ? "" : "bg-muted/10"}`}>
                    <td className="px-4 py-3 font-medium max-w-[240px] truncate">{idea.title}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge
                        variant={idea.status === "APPROVED" ? "default" : idea.status === "REJECTED" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {idea.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {idea.isPaid ? "Paid" : "Free"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">
                      {formatDate(idea.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/ideas/${idea.id}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                      >
                        View <ExternalLink className="size-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
