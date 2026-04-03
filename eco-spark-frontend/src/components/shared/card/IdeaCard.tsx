import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { IIdea } from "@/types/idea.types"
import { humanizeStatus, formatDate } from "@/lib/formatUtils"
import { cn } from "@/lib/utils"

interface IdeaCardProps {
  idea: IIdea
  href: string
  className?: string
}

export function IdeaCard({ idea, href, className }: IdeaCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-lg border bg-card p-4",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary">{humanizeStatus(idea.status)}</Badge>
        <div className="flex items-center gap-2">
          {idea.isPaid ? (
            <Badge variant="outline" className="text-xs">
              Paid
            </Badge>
          ) : null}
          <span className="text-xs text-muted-foreground">{formatDate(idea.createdAt)}</span>
        </div>
      </div>

      <h3 className="mt-2 line-clamp-2 text-base font-semibold transition-colors group-hover:text-primary">
        {idea.title}
      </h3>

      <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
        {idea.description ?? "Content preview locked — purchase access to view."}
      </p>
    </Link>
  )
}
