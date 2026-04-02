"use client"

import { useMemo } from "react"
import {
  ColumnDef,
  PaginationState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { usePathname, useRouter } from "next/navigation"

interface UseServerManagedDataTableArgs<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  pageCount: number
  searchParams: Record<string, string>
}

export function useServerManagedDataTable<TData>({
  data,
  columns,
  pageCount,
  searchParams,
}: UseServerManagedDataTableArgs<TData>) {
  const router = useRouter()
  const pathname = usePathname()

  const pagination = useMemo<PaginationState>(() => {
    const page = Number(searchParams.page ?? "1")
    const limit = Number(searchParams.limit ?? "10")

    return {
      pageIndex: Number.isFinite(page) && page > 0 ? page - 1 : 0,
      pageSize: Number.isFinite(limit) && limit > 0 ? limit : 10,
    }
  }, [searchParams.limit, searchParams.page])

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    pageCount,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  })

  const onPageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", String(nextPage))
    params.set("limit", String(pagination.pageSize))
    router.replace(`${pathname}?${params.toString()}`)
    router.refresh()
  }

  return {
    table,
    pagination: {
      page: pagination.pageIndex + 1,
      totalPages: pageCount,
      onPageChange,
    },
  }
}
