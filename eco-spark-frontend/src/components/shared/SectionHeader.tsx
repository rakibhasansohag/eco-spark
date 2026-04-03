import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
}

export function SectionHeader({ title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-5", className)}>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-3xl text-base leading-7 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
