"use client"

import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { Lightbulb, Send, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getMyIdeas } from "@/services/idea.services"
import { IIdea } from "@/types/idea.types"
import { DataTable } from "@/components/shared/table/DataTable"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import { useServerManagedDataTableFilters } from "@/hooks/useServerManagedDataTableFilters"
import { DateCell } from "@/components/shared/cell/DateCell"
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { SearchBar } from "@/components/shared/form/SearchBar"
import { EmptyState } from "@/components/shared/EmptyState"
import { TableSkeleton } from "@/components/shared/skeleton/TableSkeleton"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  submitIdeaAction,
  deleteMyIdeaAction,
} from "@/app/(dashboardLayout)/member/dashboard/my-ideas/_action"
import { formatCurrency } from "@/lib/formatUtils"

const stageOptions = ["CONCEPT", "PILOT", "SCALING", "IMPLEMENTED"] as const
const toStageLabel = (value?: string | null) => (value ? value.replace("_", " ") : "Not specified")
const formatBudget = (idea: IIdea) => {
  const min = idea.estimatedBudgetMin ? Number(idea.estimatedBudgetMin) : null
  const max = idea.estimatedBudgetMax ? Number(idea.estimatedBudgetMax) : null
  if (min == null && max == null) return "N/A"
  if (min != null && max != null) {
    return `${formatCurrency(min, "USD", true)} - ${formatCurrency(max, "USD", true)}`
  }
  if (min != null) return `From ${formatCurrency(min, "USD", true)}`
  return `Up to ${formatCurrency(max!, "USD", true)}`
}

function MyIdeaActionsCell({ idea }: { idea: IIdea }) {
  const qc = useQueryClient()

  const handleSubmit = async () => {
    const result = await submitIdeaAction(idea.id)
    if (result.success) {
      toast.success(result.message)
      qc.invalidateQueries({ queryKey: ["member-my-ideas"] })
    } else {
      toast.error(result.message)
    }
  }

  const handleDelete = async () => {
    const result = await deleteMyIdeaAction(idea.id)
    if (result.success) {
      toast.success(result.message)
      qc.invalidateQueries({ queryKey: ["member-my-ideas"] })
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {idea.status === "DRAFT" ? (
        <>
          <ConfirmDialog
            trigger={
              <Button variant="outline" size="sm" className="gap-1.5">
                <Send className="size-3.5" />
                Submit
              </Button>
            }
            title="Submit Idea for Review"
            description="Once submitted, you cannot edit this idea until reviewed by an admin."
            confirmLabel="Submit"
            variant="default"
            onConfirm={handleSubmit}
          />
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="size-3.5" />
              </Button>
            }
            title="Delete Idea"
            description="This will permanently delete this idea and cannot be undone."
            confirmLabel="Delete"
            onConfirm={handleDelete}
          />
        </>
      ) : null}
      {idea.status === "REJECTED" ? (
        <p className="max-w-[200px] truncate text-xs text-muted-foreground">
          {idea.rejectionFeedback ?? "No feedback provided"}
        </p>
      ) : null}
    </div>
  )
}

const columns: ColumnDef<IIdea>[] = [
  { header: "Title", accessorKey: "title", cell: ({ row }) => (
    <div className="min-w-[220px] space-y-1">
      <span className="block max-w-[260px] truncate font-medium">{row.original.title}</span>
      <span className="text-xs text-muted-foreground">
        {toStageLabel(row.original.implementationStage)}
      </span>
    </div>
  )},
  {
    header: "Location",
    accessorKey: "locationScope",
    cell: ({ row }) => (
      <span className="min-w-[120px] text-xs text-muted-foreground">{row.original.locationScope ?? "Not specified"}</span>
    ),
  },
  {
    header: "Timeline",
    accessorKey: "timelineWeeks",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.timelineWeeks ? `${row.original.timelineWeeks} weeks` : "N/A"}
      </span>
    ),
  },
  {
    header: "Budget",
    id: "budget",
    cell: ({ row }) => <span className="min-w-[170px] text-xs text-muted-foreground">{formatBudget(row.original)}</span>,
  },
  {
    header: "Access",
    id: "access",
    cell: ({ row }) => (
      <span className="min-w-[120px] text-xs text-muted-foreground">
        {row.original.isPaid
          ? `Paid${row.original.price ? ` · ${formatCurrency(Number(row.original.price), "USD", true)}` : ""}`
          : "Free"}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadgeCell status={row.original.status} />,
  },
  {
    header: "Updated",
    accessorKey: "updatedAt",
    cell: ({ row }) => <DateCell value={row.original.updatedAt} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex min-w-[170px] items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/ideas/${row.original.id}`}>View</Link>
        </Button>
        <MyIdeaActionsCell idea={row.original} />
      </div>
    ),
  },
]

export default function MyIdeasManagement({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { setFilter, setFilters } = useServerManagedDataTableFilters({ searchParams })
  const [locationInput, setLocationInput] = useState(searchParams.locationScope ?? "")
  const { data, isLoading } = useQuery({
    queryKey: ["member-my-ideas", searchParams],
    queryFn: () => getMyIdeas(searchParams),
  })
  const ideas = data?.data ?? []
  const activeFilters = [
    searchParams.searchTerm ? { key: "searchTerm", label: `Search: ${searchParams.searchTerm}` } : null,
    searchParams.implementationStage
      ? { key: "implementationStage", label: `Stage: ${searchParams.implementationStage.replace("_", " ")}` }
      : null,
    searchParams.locationScope ? { key: "locationScope", label: `Location: ${searchParams.locationScope}` } : null,
  ].filter(Boolean) as Array<{ key: string; label: string }>
  const activePreset =
    searchParams.status === "DRAFT"
      ? "drafts"
      : searchParams.status === "REJECTED"
        ? "rejected"
        : searchParams.implementationStage === "PILOT"
          ? "pilot"
          : "all"
  const draftCount = ideas.filter((idea) => idea.status === "DRAFT").length
  const approvedCount = ideas.filter((idea) => idea.status === "APPROVED").length
  const rejectedCount = ideas.filter((idea) => idea.status === "REJECTED").length

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if ((searchParams.locationScope ?? "") === locationInput) return
      setFilter("locationScope", locationInput)
    }, 350)

    return () => window.clearTimeout(timeoutId)
  }, [locationInput, searchParams.locationScope, setFilter])

  const { table, pagination } = useServerManagedDataTable<IIdea>({
    data: ideas,
    columns,
    pageCount: data?.meta?.totalPages ?? 0,
    searchParams,
  })

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs text-muted-foreground">Visible Ideas</p>
          <p className="text-lg font-semibold">{ideas.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs text-muted-foreground">Drafts</p>
          <p className="text-lg font-semibold">{draftCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs text-muted-foreground">Approved</p>
          <p className="text-lg font-semibold">{approvedCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs text-muted-foreground">Rejected</p>
          <p className="text-lg font-semibold">{rejectedCount}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="md:col-span-2">
          <SearchBar searchParams={searchParams} />
        </div>
        <Select
          value={searchParams.implementationStage ?? "all"}
          onValueChange={(value) => setFilter("implementationStage", value === "all" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {stageOptions.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Filter by location"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={activePreset === "all" ? "default" : "outline"}
          onClick={() => {
            setFilters({
              status: "",
              implementationStage: "",
            })
            setLocationInput("")
          }}
        >
          All Ideas
        </Button>
        <Button
          type="button"
          size="sm"
          variant={activePreset === "drafts" ? "default" : "outline"}
          onClick={() => {
            setFilters({
              status: "DRAFT",
              implementationStage: "",
            })
            setLocationInput("")
          }}
        >
          Drafts
        </Button>
        <Button
          type="button"
          size="sm"
          variant={activePreset === "rejected" ? "default" : "outline"}
          onClick={() => {
            setFilters({
              status: "REJECTED",
              implementationStage: "",
            })
            setLocationInput("")
          }}
        >
          Rejected
        </Button>
        <Button
          type="button"
          size="sm"
          variant={activePreset === "pilot" ? "default" : "outline"}
          onClick={() => {
            setFilters({
              status: "",
              implementationStage: "PILOT",
            })
            setLocationInput("")
          }}
        >
          Pilot Stage
        </Button>
      </div>

      {activeFilters.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <Button
              key={filter.key}
              type="button"
              variant="outline"
              size="sm"
              className="h-7 rounded-full px-3 text-xs"
              onClick={() => setFilter(filter.key, "")}
            >
              {filter.label} ✕
            </Button>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              setFilters({
                searchTerm: "",
                implementationStage: "",
                locationScope: "",
                status: "",
              })
              setLocationInput("")
            }}
          >
            Clear all
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : (data?.data?.length ?? 0) === 0 ? (
        <EmptyState
          title="No ideas match your filters"
          description="Try another stage/location filter, or create a fresh idea draft."
          icon={Lightbulb}
          action={
            <Button asChild size="sm">
              <Link href="/member/dashboard/create-idea">Create New Idea</Link>
            </Button>
          }
        />
      ) : (
        <DataTable table={table} pagination={pagination} />
      )}
    </div>
  )
}
