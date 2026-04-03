import Link from "next/link"
import { CheckCircle2, Circle } from "lucide-react"
import { IProfileChecklistItem } from "@/lib/profileCompletion"
import { Button } from "@/components/ui/button"

interface ProfileCompletionChecklistCardProps {
  completion: number
  items: IProfileChecklistItem[]
}

export function ProfileCompletionChecklistCard({
  completion,
  items,
}: ProfileCompletionChecklistCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight">Complete your profile</h3>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {completion}%
        </span>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${completion}%` }}
        />
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.key}
            href={`/my-profile#profile-${item.key}`}
            className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 transition-colors hover:bg-muted/60"
          >
            {item.done ? (
              <CheckCircle2 className="size-4 text-primary" />
            ) : (
              <Circle className="size-4 text-muted-foreground" />
            )}
            <span className={item.done ? "text-sm text-foreground" : "text-sm text-muted-foreground"}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      <Button asChild className="mt-4 h-10 w-full rounded-xl">
        <Link href="/my-profile">Update Profile</Link>
      </Button>
    </div>
  )
}
