import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserInfoCellProps {
  name: string
  email: string
  image?: string | null
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function UserInfoCell({ name, email, image }: UserInfoCellProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarImage src={image ?? undefined} alt={name} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-medium">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{email}</p>
      </div>
    </div>
  )
}
