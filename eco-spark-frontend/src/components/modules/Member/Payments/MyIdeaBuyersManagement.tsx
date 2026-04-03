"use client"

import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { getMyIdeaSales } from "@/services/payment.services"
import { IMyIdeaSale } from "@/types/payment.types"
import { DataTable } from "@/components/shared/table/DataTable"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import { DateCell } from "@/components/shared/cell/DateCell"
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell"

const columns: ColumnDef<IMyIdeaSale>[] = [
  {
    header: "Buyer",
    accessorKey: "user",
    cell: ({ row }) => (
      <UserInfoCell
        name={row.original.user.name}
        email={row.original.user.email}
      />
    ),
  },
  {
    header: "Idea",
    accessorKey: "idea.title",
    cell: ({ row }) => <span className="font-medium">{row.original.idea.title}</span>,
  },
  { header: "Amount", accessorKey: "amount" },
  {
    header: "Purchased At",
    accessorKey: "createdAt",
    cell: ({ row }) => <DateCell value={row.original.createdAt} />,
  },
]

export default function MyIdeaBuyersManagement({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { data } = useQuery({
    queryKey: ["my-idea-sales", searchParams],
    queryFn: () => getMyIdeaSales(searchParams),
  })

  const { table, pagination } = useServerManagedDataTable<IMyIdeaSale>({
    data: data?.data ?? [],
    columns,
    pageCount: data?.meta?.totalPages ?? 0,
    searchParams,
  })

  return <DataTable table={table} pagination={pagination} />
}
