"use client"

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

const stageOptions = ["CONCEPT", "PILOT", "SCALING", "IMPLEMENTED"] as const

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
    <div className="space-y-1">
      <span className="block max-w-xs truncate font-medium">{row.original.title}</span>
      <span className="text-xs text-muted-foreground">
        {row.original.implementationStage
          ? row.original.implementationStage.replace("_", " ")
          : "Stage not specified"}
      </span>
    </div>
  )},
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
      <div className="flex items-center gap-2">
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
  const { setFilter } = useServerManagedDataTableFilters({ searchParams })
  const { data } = useQuery({
    queryKey: ["member-my-ideas", searchParams],
    queryFn: () => getMyIdeas(searchParams),
  })

  const { table, pagination } = useServerManagedDataTable<IIdea>({
    data: data?.data ?? [],
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
          value={searchParams.locationScope ?? ""}
          onChange={(e) => setFilter("locationScope", e.target.value)}
        />
      </div>

      {(data?.data?.length ?? 0) === 0 ? (
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
