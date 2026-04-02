"use client"

import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { getCommentList } from "@/services/comment.services"
import { IComment } from "@/types/comment.types"
import { DataTable } from "@/components/shared/table/DataTable"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import { DateCell } from "@/components/shared/cell/DateCell"
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell"
import { SearchBar } from "@/components/shared/form/SearchBar"

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
    <>
      <SearchBar searchParams={searchParams} />
      <DataTable table={table} pagination={pagination} />
    </>
  )
}
