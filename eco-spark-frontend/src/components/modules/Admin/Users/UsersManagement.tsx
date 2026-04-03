"use client"

import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { getUserList } from "@/services/user.services"
import { IUser } from "@/types/user.types"
import { DataTable } from "@/components/shared/table/DataTable"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell"
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell"
import { SearchBar } from "@/components/shared/form/SearchBar"

const columns: ColumnDef<IUser>[] = [
  {
    header: "User",
    accessorKey: "name",
    cell: ({ row }) => (
      <UserInfoCell
        name={row.original.name}
        email={row.original.email}
        image={row.original.image}
      />
    ),
  },
  {
    header: "Role",
    accessorKey: "role",
    cell: ({ row }) => <StatusBadgeCell status={row.original.role} />,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadgeCell status={row.original.status} />,
  },
]

export default function AdminUsersManagement({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { data } = useQuery({
    queryKey: ["admin-users", searchParams],
    queryFn: () => getUserList(searchParams),
  })

  const { table, pagination } = useServerManagedDataTable<IUser>({
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
