import { AppRole } from "./authUtils"

export interface INavItem {
  label: string
  href: string
}

const roleNavItems: Record<AppRole, INavItem[]> = {
  ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Ideas Management", href: "/admin/dashboard/ideas-management" },
    { label: "Users Management", href: "/admin/dashboard/users-management" },
    { label: "Categories Management", href: "/admin/dashboard/categories-management" },
    { label: "Comments Management", href: "/admin/dashboard/comments-management" },
  ],
  MEMBER: [
    { label: "Dashboard", href: "/member/dashboard" },
    { label: "My Ideas", href: "/member/dashboard/my-ideas" },
    { label: "Create Idea", href: "/member/dashboard/create-idea" },
    { label: "My Payments", href: "/member/dashboard/my-payments" },
  ],
}

const commonProtectedNavItems: INavItem[] = [
  { label: "My Profile", href: "/my-profile" },
  { label: "Change Password", href: "/change-password" },
]

export const getRoleNavItems = (role: AppRole): INavItem[] => roleNavItems[role]

export const getCommonProtectedNavItems = (): INavItem[] => commonProtectedNavItems
