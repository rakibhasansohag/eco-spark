import {
  LayoutDashboard,
  Lightbulb,
  Users,
  Tag,
  MessageSquare,
  Plus,
  CreditCard,
  Bookmark,
  Sparkles,
  UserCircle,
  Lock,
  type LucideIcon,
} from "lucide-react"
import { AppRole } from "./authUtils"

export interface INavItem {
  label: string
  href: string
  icon: LucideIcon
}

const roleNavItems: Record<AppRole, INavItem[]> = {
  ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Ideas Management", href: "/admin/dashboard/ideas-management", icon: Lightbulb },
    { label: "Users Management", href: "/admin/dashboard/users-management", icon: Users },
    { label: "Categories Management", href: "/admin/dashboard/categories-management", icon: Tag },
    {
      label: "Comments Management",
      href: "/admin/dashboard/comments-management",
      icon: MessageSquare,
    },
    { label: "My Watchlist", href: "/admin/dashboard/my-watchlist", icon: Bookmark },
    { label: "AI Automation", href: "/admin/dashboard/ai-automation", icon: Sparkles },
  ],
  MEMBER: [
    { label: "Dashboard", href: "/member/dashboard", icon: LayoutDashboard },
    { label: "My Ideas", href: "/member/dashboard/my-ideas", icon: Lightbulb },
    { label: "Create Idea", href: "/member/dashboard/create-idea", icon: Plus },
    { label: "My Watchlist", href: "/member/dashboard/my-watchlist", icon: Bookmark },
    { label: "My Payments", href: "/member/dashboard/my-payments", icon: CreditCard },
    { label: "Idea Buyers", href: "/member/dashboard/my-idea-buyers", icon: Users },
  ],
}

const commonProtectedNavItems: INavItem[] = [
  { label: "My Profile", href: "/my-profile", icon: UserCircle },
  { label: "Change Password", href: "/change-password", icon: Lock },
]

export const getRoleNavItems = (role: AppRole): INavItem[] => roleNavItems[role] || []

export const getCommonProtectedNavItems = (): INavItem[] => commonProtectedNavItems

