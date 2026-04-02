import { Badge } from "@/components/ui/badge"

interface StatusBadgeCellProps {
  status: string
}

const resolveVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  const normalized = status.toUpperCase()
  if (normalized === "ACTIVE" || normalized === "APPROVED" || normalized === "SUCCESS") {
    return "default"
  }
  if (normalized === "INACTIVE" || normalized === "REJECTED" || normalized === "FAILED") {
    return "destructive"
  }
  if (normalized === "PENDING" || normalized === "UNDER_REVIEW") {
    return "secondary"
  }
  return "outline"
}

export function StatusBadgeCell({ status }: StatusBadgeCellProps) {
  return <Badge variant={resolveVariant(status)}>{status}</Badge>
}
