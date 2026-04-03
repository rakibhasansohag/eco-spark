import { Badge } from "@/components/ui/badge"
import { humanizeStatus } from "@/lib/formatUtils"

interface StatusBadgeCellProps {
  status: string
}

const resolveVariant = (
  status: string,
): "default" | "secondary" | "destructive" | "outline" => {
  const s = status.toUpperCase()
  if (["ACTIVE", "APPROVED", "SUCCESS"].includes(s)) return "default"
  if (["INACTIVE", "REJECTED", "FAILED"].includes(s)) return "destructive"
  if (["PENDING", "UNDER_REVIEW", "DRAFT"].includes(s)) return "secondary"
  return "outline"
}

export function StatusBadgeCell({ status }: StatusBadgeCellProps) {
  return (
    <Badge variant={resolveVariant(status)}>{humanizeStatus(status)}</Badge>
  )
}
