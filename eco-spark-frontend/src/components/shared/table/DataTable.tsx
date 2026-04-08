"use client"

import {
  Table as TableType,
  flexRender,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface IDataTablePagination {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

interface DataTableProps<TData> {
  table: TableType<TData>
  pagination?: IDataTablePagination
}

export function DataTable<TData>({ table, pagination }: DataTableProps<TData>) {
  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-xl border bg-card shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      header.column.id === "actions" &&
                        "sticky right-0 z-20 bg-card shadow-[-10px_0_14px_-12px_rgba(15,23,42,0.45)]"
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.id === "actions" &&
                          "sticky right-0 z-10 bg-card shadow-[-10px_0_14px_-12px_rgba(15,23,42,0.45)]"
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={table.getAllColumns().length || 1}
                >
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination ? (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.onPageChange(Math.max(1, pagination.page - 1))}
            disabled={pagination.page <= 1}
          >
            Previous
          </Button>
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {Math.max(1, pagination.totalPages)}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              pagination.onPageChange(
                Math.min(
                  Math.max(1, pagination.totalPages),
                  pagination.page + 1
                )
              )
            }
            disabled={pagination.page >= Math.max(1, pagination.totalPages)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  )
}
