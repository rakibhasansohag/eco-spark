"use client"

import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { getMyIdeas } from "@/services/idea.services"
import { IIdea } from "@/types/idea.types"
import { DataTable } from "@/components/shared/table/DataTable"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import { DateCell } from "@/components/shared/cell/DateCell"
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell"

const columns: ColumnDef<IIdea>[] = [
  { header: "Title", accessorKey: "title" },
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

  return <DataTable table={table} pagination={pagination} />
}
