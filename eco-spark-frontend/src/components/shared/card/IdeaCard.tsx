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
        "group flex flex-col rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_14px_34px_-18px_rgba(15,23,42,0.45)]",
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

      <h3 className="mt-3 line-clamp-2 text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
        {idea.title}
      </h3>

      <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
        {idea.description ?? "Content preview locked — purchase access to view."}
      </p>
    </Link>
  )
}
