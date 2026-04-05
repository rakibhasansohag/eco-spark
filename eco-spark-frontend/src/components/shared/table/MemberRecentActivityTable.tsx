import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface MemberRecentActivityTableProps {
  rows: Array<{
    label: string
    count: number
    share: number
    insight: string
  }>
}

export function MemberRecentActivityTable({ rows }: MemberRecentActivityTableProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
      <div className="mb-4">
        <p className="text-sm font-medium text-muted-foreground">Recent Activity</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Current status and engagement signals for your published work
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead className="text-right">Count</TableHead>
            <TableHead className="text-right">Share</TableHead>
            <TableHead className="text-right">Insight</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="font-medium">{row.label}</TableCell>
              <TableCell className="text-right tabular-nums">{row.count.toLocaleString()}</TableCell>
              <TableCell className="text-right">{row.share}%</TableCell>
              <TableCell className="text-right text-muted-foreground">{row.insight}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
