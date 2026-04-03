"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { Send, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMyIdeas } from "@/services/idea.services"
import { IIdea } from "@/types/idea.types"
import { DataTable } from "@/components/shared/table/DataTable"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import { DateCell } from "@/components/shared/cell/DateCell"
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { SearchBar } from "@/components/shared/form/SearchBar"
import {
  submitIdeaAction,
  deleteMyIdeaAction,
} from "@/app/(dashboardLayout)/member/dashboard/my-ideas/_action"

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
    <span className="max-w-xs truncate block">{row.original.title}</span>
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
    cell: ({ row }) => <MyIdeaActionsCell idea={row.original} />,
  },
]

export default function MyIdeasManagement({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
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
      <SearchBar searchParams={searchParams} />
      <DataTable table={table} pagination={pagination} />
    </div>
  )
}
