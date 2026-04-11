"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getNotificationsAction, markNotificationAsReadAction, INotification } from "@/services/notification.services"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { formatDate } from "@/lib/formatUtils"
import { cn } from "@/lib/utils"

export function NotificationBell() {
  const qc = useQueryClient()

  // Polling every 30 seconds
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotificationsAction,
    refetchInterval: 30000, 
  })

  const notifications = data?.data?.notifications || []
  const unreadCount = data?.data?.unreadCount || 0

  const readMutation = useMutation({
    mutationFn: markNotificationAsReadAction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] })
    }
  })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif: INotification) => (
                <div
                  key={notif.id}
                  className={cn(
                    "flex flex-col gap-1 border-b px-4 py-3 last:border-0 hover:bg-muted/50 transition-colors",
                    !notif.isRead && "bg-muted/20"
                  )}
                  onClick={() => {
                    if (!notif.isRead) {
                      readMutation.mutate(notif.id)
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={cn("text-sm font-medium", !notif.isRead && "text-primary")}>
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {notif.link ? (
                    <Link href={notif.link} className="text-xs text-muted-foreground hover:underline">
                      {notif.message}
                    </Link>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {notif.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
