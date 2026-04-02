"use client"

import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { getMyPayments } from "@/services/payment.services"
import { IPayment } from "@/types/payment.types"
import { DataTable } from "@/components/shared/table/DataTable"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import { DateCell } from "@/components/shared/cell/DateCell"
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell"

const columns: ColumnDef<IPayment>[] = [
  { header: "Idea ID", accessorKey: "ideaId" },
  { header: "Amount", accessorKey: "amount" },
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
]

export default function MyPaymentsManagement({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { data } = useQuery({
    queryKey: ["member-payments", searchParams],
    queryFn: () => getMyPayments(searchParams),
  })

  const { table, pagination } = useServerManagedDataTable<IPayment>({
    data: data?.data ?? [],
    columns,
    pageCount: data?.meta?.totalPages ?? 0,
    searchParams,
  })

  return <DataTable table={table} pagination={pagination} />
}
