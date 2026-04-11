import { cn } from "@/lib/utils"
import { ShieldAlert, ShieldCheck, Shield } from "lucide-react"

interface UserBadgeProps {
  reputation: number
  className?: string
}

export function UserBadge({ reputation, className }: UserBadgeProps) {
  let label = "Eco Starter"
  let Icon = Shield
  let colorClass = "text-muted-foreground bg-muted/20 border-muted-foreground/20"

  if (reputation >= 200) {
    label = "Eco Warrior"
    Icon = ShieldAlert
    colorClass = "text-amber-500 bg-amber-500/10 border-amber-500/20"
  } else if (reputation >= 50) {
    label = "Eco Advocate"
    Icon = ShieldCheck
    colorClass = "text-primary bg-primary/10 border-primary/20"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        colorClass,
        className
      )}
      title={`${reputation} Reputation Points`}
    >
      <Icon className="size-3" />
      {label}
    </div>
  )
}
