"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const dashboardPrefixes = ["/admin/dashboard", "/member/dashboard", "/my-profile", "/change-password"]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const inDashboard = dashboardPrefixes.some((prefix) => pathname.startsWith(prefix))

  return (
    <>
      {!inDashboard ? (
        <header className="border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto flex h-14 items-center justify-between px-4">
            <Link href="/" className="font-semibold">
              EcoSpark Hub
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/ideas" className="text-muted-foreground hover:text-foreground">
                Ideas
              </Link>
              <Link href="/login" className="text-muted-foreground hover:text-foreground">
                Login
              </Link>
              <Link href="/register" className="text-muted-foreground hover:text-foreground">
                Register
              </Link>
            </nav>
          </div>
        </header>
      ) : null}
      <div className="flex-1">{children}</div>
    </>
  )
}
