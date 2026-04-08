"use client"

import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { CheckCircle, Lightbulb, XCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getIdeasForAdmin } from "@/services/idea.services"
import { IIdea } from "@/types/idea.types"
import { DataTable } from "@/components/shared/table/DataTable"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import { useServerManagedDataTableFilters } from "@/hooks/useServerManagedDataTableFilters"
import { DateCell } from "@/components/shared/cell/DateCell"
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell"
import { SearchBar } from "@/components/shared/form/SearchBar"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
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
  approveIdeaAction,
  rejectIdeaAction,
  deleteIdeaByAdminAction,
} from "@/app/(dashboardLayout)/admin/dashboard/ideas-management/_action"

const stageOptions = ["CONCEPT", "PILOT", "SCALING", "IMPLEMENTED"] as const

function RejectDialog({ idea }: { idea: IIdea }) {
  const [open, setOpen] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [pending, setPending] = useState(false)
  const qc = useQueryClient()

  const handleReject = async () => {
    setPending(true)
    const result = await rejectIdeaAction(idea.id, { rejectionFeedback: feedback })
    setPending(false)
    if (result.success) {
      toast.success(result.message)
      qc.invalidateQueries({ queryKey: ["admin-ideas"] })
      setOpen(false)
      setFeedback("")
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <XCircle className="size-3.5" />
          Reject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Idea</DialogTitle>
          <DialogDescription>
            Provide feedback explaining why this idea is being rejected.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="Rejection feedback (min 10 characters)…"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={pending || feedback.length < 10}
          >
            {pending ? "Rejecting…" : "Reject Idea"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function IdeaActionsCell({ idea }: { idea: IIdea }) {
  const qc = useQueryClient()

  const handleApprove = async () => {
    const result = await approveIdeaAction(idea.id)
    if (result.success) {
      toast.success(result.message)
      qc.invalidateQueries({ queryKey: ["admin-ideas"] })
    } else {
      toast.error(result.message)
    }
  }

  const handleDelete = async () => {
    const result = await deleteIdeaByAdminAction(idea.id)
    if (result.success) {
      toast.success(result.message)
      qc.invalidateQueries({ queryKey: ["admin-ideas"] })
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {idea.status === "PENDING" || idea.status === "UNDER_REVIEW" ? (
        <>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleApprove}
          >
            <CheckCircle className="size-3.5" />
            Approve
          </Button>
          <RejectDialog idea={idea} />
        </>
      ) : null}
      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="size-3.5" />
          </Button>
        }
        title="Delete Idea"
        description="This action cannot be undone. The idea will be permanently deleted."
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  )
}

const columns: ColumnDef<IIdea>[] = [
  { header: "Title", accessorKey: "title", cell: ({ row }) => (
    <div className="space-y-1">
      <span className="block max-w-xs truncate font-medium">{row.original.title}</span>
      <span className="text-xs text-muted-foreground">
        {row.original.locationScope || "Location not specified"}
      </span>
    </div>
  )},
  {
    header: "Stage",
    accessorKey: "implementationStage",
    cell: ({ row }) => (
      <span className="text-xs">
        {row.original.implementationStage
          ? row.original.implementationStage.replace("_", " ")
          : "Not specified"}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadgeCell status={row.original.status} />,
  },
  {
    header: "Created",
    accessorKey: "createdAt",
    cell: ({ row }) => <DateCell value={row.original.createdAt} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/ideas/${row.original.id}`}>View</Link>
        </Button>
        <IdeaActionsCell idea={row.original} />
      </div>
    ),
  },
]

export default function AdminIdeasManagement({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { setFilter, setFilters } = useServerManagedDataTableFilters({ searchParams })
  const [locationInput, setLocationInput] = useState(searchParams.locationScope ?? "")
  const { data, isLoading } = useQuery({
    queryKey: ["admin-ideas", searchParams],
    queryFn: () => getIdeasForAdmin(searchParams),
  })
  const ideas = data?.data ?? []
  const activeFilters = [
    searchParams.searchTerm ? { key: "searchTerm", label: `Search: ${searchParams.searchTerm}` } : null,
    searchParams.implementationStage
      ? { key: "implementationStage", label: `Stage: ${searchParams.implementationStage.replace("_", " ")}` }
      : null,
    searchParams.locationScope ? { key: "locationScope", label: `Location: ${searchParams.locationScope}` } : null,
  ].filter(Boolean) as Array<{ key: string; label: string }>

  const ideasWithBudget = ideas.filter(
    (idea) => (idea.estimatedBudgetMin && Number(idea.estimatedBudgetMin) > 0) || (idea.estimatedBudgetMax && Number(idea.estimatedBudgetMax) > 0),
  ).length
  const timelineValues = ideas
    .map((idea) => idea.timelineWeeks)
    .filter((value): value is number => typeof value === "number" && value > 0)
  const averageTimeline =
    timelineValues.length > 0
      ? Math.round(timelineValues.reduce((total, value) => total + value, 0) / timelineValues.length)
      : null
  const stageCounts = ideas.reduce<Record<string, number>>((acc, idea) => {
    if (!idea.implementationStage) return acc
    acc[idea.implementationStage] = (acc[idea.implementationStage] ?? 0) + 1
    return acc
  }, {})
  const topStage =
    Object.entries(stageCounts).sort((a, b) => b[1] - a[1])[0]?.[0]?.replace("_", " ") ?? "Not specified"
  const activePreset =
    searchParams.status === "UNDER_REVIEW"
      ? "under_review"
      : searchParams.implementationStage === "PILOT"
        ? "pilot"
        : searchParams.isPaid === "true"
          ? "paid"
          : "all"

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
              isPaid: "",
            })
            setLocationInput("")
          }}
        >
          All Ideas
        </Button>
        <Button
          type="button"
          size="sm"
          variant={activePreset === "under_review" ? "default" : "outline"}
          onClick={() => {
            setFilters({
              status: "UNDER_REVIEW",
              implementationStage: "",
              isPaid: "",
            })
            setLocationInput("")
          }}
        >
          Needs Review
        </Button>
        <Button
          type="button"
          size="sm"
          variant={activePreset === "pilot" ? "default" : "outline"}
          onClick={() => {
            setFilters({
              status: "",
              implementationStage: "PILOT",
              isPaid: "",
            })
            setLocationInput("")
          }}
        >
          Pilot Stage
        </Button>
        <Button
          type="button"
          size="sm"
          variant={activePreset === "paid" ? "default" : "outline"}
          onClick={() => {
            setFilters({
              status: "",
              implementationStage: "",
              isPaid: "true",
            })
            setLocationInput("")
          }}
        >
          Paid Ideas
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
                isPaid: "",
              })
              setLocationInput("")
            }}
          >
            Clear all
          </Button>
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs text-muted-foreground">Visible Ideas</p>
          <p className="text-lg font-semibold">{ideas.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs text-muted-foreground">With Budget Estimate</p>
          <p className="text-lg font-semibold">{ideasWithBudget}</p>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs text-muted-foreground">Avg Timeline / Top Stage</p>
          <p className="text-lg font-semibold">
            {averageTimeline ? `${averageTimeline}w` : "N/A"} · {topStage}
          </p>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : (data?.data?.length ?? 0) === 0 ? (
        <EmptyState
          title="No ideas found"
          description="Adjust stage/location filters or search term to find submissions."
          icon={Lightbulb}
          action={
            <Button asChild variant="outline" size="sm">
              <Link href="/ideas">Browse Public Ideas</Link>
            </Button>
          }
        />
      ) : (
        <DataTable table={table} pagination={pagination} />
      )}
    </div>
  )
}
