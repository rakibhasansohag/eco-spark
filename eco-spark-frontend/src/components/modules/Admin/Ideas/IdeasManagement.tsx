"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { CheckCircle, XCircle, Trash2 } from "lucide-react"
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
import { DateCell } from "@/components/shared/cell/DateCell"
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell"
import { SearchBar } from "@/components/shared/form/SearchBar"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import {
  approveIdeaAction,
  rejectIdeaAction,
  deleteIdeaByAdminAction,
} from "@/app/(dashboardLayout)/admin/dashboard/ideas-management/_action"

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
    <span className="max-w-xs truncate block">{row.original.title}</span>
  )},
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
    cell: ({ row }) => <IdeaActionsCell idea={row.original} />,
  },
]

export default function AdminIdeasManagement({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { data } = useQuery({
    queryKey: ["admin-ideas", searchParams],
    queryFn: () => getIdeasForAdmin(searchParams),
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
