import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AdminRecentActivityTableProps {
  rows: Array<{
    label: string
    count: number
    share: number
    priority: string
  }>
}

export function AdminRecentActivityTable({ rows }: AdminRecentActivityTableProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
      <div className="mb-4">
        <p className="text-sm font-medium text-muted-foreground">Recent Activity</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Current moderation and publishing pipeline overview
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Count</TableHead>
            <TableHead className="text-right">Share</TableHead>
            <TableHead className="text-right">Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="font-medium">{row.label}</TableCell>
              <TableCell className="text-right tabular-nums">{row.count.toLocaleString()}</TableCell>
              <TableCell className="text-right">{row.share}%</TableCell>
              <TableCell className="text-right text-muted-foreground">{row.priority}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
