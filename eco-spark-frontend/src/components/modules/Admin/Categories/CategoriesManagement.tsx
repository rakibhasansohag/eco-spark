"use client"

import { useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import { getCategoryList } from "@/services/category.services"
import { ICategory } from "@/types/category.types"
import { DataTable } from "@/components/shared/table/DataTable"
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable"
import { DateCell } from "@/components/shared/cell/DateCell"
import { SearchBar } from "@/components/shared/form/SearchBar"

const columns: ColumnDef<ICategory>[] = [
  { header: "Name", accessorKey: "name" },
  { header: "Slug", accessorKey: "slug" },
  {
    header: "Created",
    accessorKey: "createdAt",
    cell: ({ row }) => <DateCell value={row.original.createdAt} />,
  },
]

export default function AdminCategoriesManagement({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const { data } = useQuery({
    queryKey: ["admin-categories", searchParams],
    queryFn: () => getCategoryList(searchParams),
  })

  const { table, pagination } = useServerManagedDataTable<ICategory>({
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
