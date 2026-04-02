interface DateCellProps {
  value: string | Date
}

export function DateCell({ value }: DateCellProps) {
  const date = value instanceof Date ? value : new Date(value)

  return (
    <span className="text-sm text-muted-foreground">
      {Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString()}
    </span>
  )
}
