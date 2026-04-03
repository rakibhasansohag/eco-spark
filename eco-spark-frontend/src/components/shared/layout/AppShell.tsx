"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { UserMenu } from "@/components/modules/Dashboard/UserMenu"

const DASHBOARD_PREFIXES = [
  "/dashboard",
  "/admin/dashboard",
  "/member/dashboard",
  "/my-profile",
  "/change-password",
]

const PUBLIC_NAV_LINKS = [{ href: "/ideas", label: "Ideas" }]

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

interface AppShellProps {
  children: React.ReactNode
  isLoggedIn: boolean
  userName?: string
  userRole?: "ADMIN" | "MEMBER"
}

export function AppShell({ children, isLoggedIn, userName, userRole }: AppShellProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const inDashboard = DASHBOARD_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  return (
    <>
      {!inDashboard ? (
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold transition-opacity hover:opacity-80"
            >
              <Leaf className="size-5 text-primary" />
              <span>EcoSpark Hub</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {PUBLIC_NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:text-foreground",
                    isActivePath(pathname, href) ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                </Link>
              ))}

              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:text-foreground",
                    isActivePath(pathname, "/member/dashboard") || isActivePath(pathname, "/admin/dashboard")
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:text-foreground",
                      isActivePath(pathname, "/login") ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    Sign In
                  </Link>
                  <Button asChild size="sm" className="ml-1">
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}

              <ThemeToggle />
              {isLoggedIn && userName && userRole ? (
                <UserMenu name={userName} role={userRole} />
              ) : null}
            </nav>

            {/* Mobile nav trigger */}
            <div className="flex items-center gap-1 md:hidden">
              <ThemeToggle />
              {isLoggedIn && userName && userRole ? (
                <UserMenu name={userName} role={userRole} />
              ) : null}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 p-0">
                  <SheetHeader className="border-b px-4 py-4">
                    <SheetTitle className="flex items-center gap-2 text-base">
                      <Leaf className="size-4 text-primary" />
                      EcoSpark Hub
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-1 p-3">
                    {PUBLIC_NAV_LINKS.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActivePath(pathname, href)
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      >
                        {label}
                      </Link>
                    ))}

                    {isLoggedIn ? (
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActivePath(pathname, "/member/dashboard") ||
                            isActivePath(pathname, "/admin/dashboard")
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActivePath(pathname, "/login")
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground",
                          )}
                        >
                          Sign In
                        </Link>
                        <Button
                          asChild
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => setMobileOpen(false)}
                        >
                          <Link href="/register">Get Started</Link>
                        </Button>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      ) : null}

      <div className="flex-1">{children}</div>

      {!inDashboard ? (
        <footer className="border-t bg-background/95">
          <div className="container mx-auto flex flex-col gap-3 px-4 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
            <div className="flex items-center gap-2">
              <Leaf className="size-4 text-primary" />
              <p>© {new Date().getFullYear()} EcoSpark Hub. Build greener outcomes together.</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/ideas" className="transition-colors hover:text-foreground">
                Explore
              </Link>
              {isLoggedIn ? (
                <Link href="/dashboard" className="transition-colors hover:text-foreground">
                  Dashboard
                </Link>
              ) : (
                <Link href="/login" className="transition-colors hover:text-foreground">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </footer>
      ) : null}
    </>
  )
}
