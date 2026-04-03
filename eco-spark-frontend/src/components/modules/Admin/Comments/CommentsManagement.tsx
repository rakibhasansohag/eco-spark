"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCommentList } from "@/services/comment.services"
import { IComment } from "@/types/comment.types"
import { DataTable } from "@/components/shared/table/DataTable"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import { DateCell } from "@/components/shared/cell/DateCell"
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell"
import { SearchBar } from "@/components/shared/form/SearchBar"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { deleteCommentByAdminAction } from "@/app/(dashboardLayout)/admin/dashboard/comments-management/_action"

function CommentActionsCell({ comment }: { comment: IComment }) {
  const qc = useQueryClient()

  const handleDelete = async () => {
    const result = await deleteCommentByAdminAction(comment.id)
    if (result.success) {
      toast.success(result.message)
      qc.invalidateQueries({ queryKey: ["admin-comments"] })
    } else {
      toast.error(result.message)
    }
  }

  return (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <Trash2 className="size-3.5" />
        </Button>
      }
      title="Delete Comment"
      description="This will permanently delete the comment."
      confirmLabel="Delete"
      onConfirm={handleDelete}
    />
  )
}

const columns: ColumnDef<IComment>[] = [
  {
    header: "Content",
    accessorKey: "content",
    cell: ({ row }) => (
      <p className="max-w-xl truncate text-sm">{row.original.content}</p>
    ),
  },
  {
    header: "Deleted",
    accessorKey: "isDeleted",
    cell: ({ row }) => (
      <StatusBadgeCell status={row.original.isDeleted ? "INACTIVE" : "ACTIVE"} />
    ),
  },
  {
    header: "Created",
    accessorKey: "createdAt",
    cell: ({ row }) => <DateCell value={row.original.createdAt} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CommentActionsCell comment={row.original} />,
  },
]

export default function AdminCommentsManagement({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { data } = useQuery({
    queryKey: ["admin-comments", searchParams],
    queryFn: () => getCommentList(searchParams),
  })

  const { table, pagination } = useServerManagedDataTable<IComment>({
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
