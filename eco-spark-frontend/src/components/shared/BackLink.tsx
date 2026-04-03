import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackLinkProps {
  href: string
  label?: string
}

export function BackLink({ href, label = "Back" }: BackLinkProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="-ml-2 text-muted-foreground hover:text-foreground"
    >
      <Link href={href}>
        <ChevronLeft className="size-4" />
        {label}
      </Link>
    </Button>
  )
}
