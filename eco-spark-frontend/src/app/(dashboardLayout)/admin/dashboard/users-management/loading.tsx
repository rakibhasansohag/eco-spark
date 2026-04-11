import { TableSkeleton } from "@/components/shared/skeleton/TableSkeleton"

export default function UsersManagementLoading() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border bg-muted/20 p-6 md:p-7">
        <div className="h-9 w-64 animate-pulse rounded-md bg-muted" />
      </div>
      <TableSkeleton />
    </div>
  )
}
