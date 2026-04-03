const STATUS_MAP: Record<string, string> = {
  DRAFT: "Draft",
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUCCESS: "Success",
  FAILED: "Failed",
  MEMBER: "Member",
  ADMIN: "Admin",
}

export const humanizeStatus = (status: string): string =>
  STATUS_MAP[status.toUpperCase()] ?? status

export const formatDate = (value: string | Date): string => {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export const formatCurrency = (
  amount: number,
  currency = "USD",
  alreadyInDollars = false,
): string => {
  const value = alreadyInDollars ? amount : amount / 100
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value)
}
