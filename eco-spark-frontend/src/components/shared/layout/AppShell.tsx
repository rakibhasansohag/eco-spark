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
              <Link href="/member/dashboard" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
            </nav>
          </div>
        </header>
      ) : null}
      <div className="flex-1">{children}</div>
      {!inDashboard ? (
        <footer className="border-t bg-background/95">
          <div className="container mx-auto flex flex-col gap-2 px-4 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} EcoSpark Hub. Build greener outcomes together.</p>
            <div className="flex items-center gap-3">
              <Link href="/ideas" className="hover:text-foreground">
                Explore
              </Link>
              <Link href="/login" className="hover:text-foreground">
                Sign In
              </Link>
            </div>
          </div>
        </footer>
      ) : null}
    </>
  )
}
