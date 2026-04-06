import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "@/providers/QueryProvider"
import { ThemeProvider } from "@/components/shared/ThemeProvider"
import { AppShell } from "@/components/shared/layout/AppShell"
import { getAccessToken } from "@/lib/tokenUtils"
import { decodeAccessToken } from "@/lib/jwtUtils"
import { getMyProfile } from "@/services/user.services"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "EcoSpark Hub",
  description: "Sustainability idea-sharing portal",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const accessToken = await getAccessToken()
  const decoded = decodeAccessToken(accessToken)
  let isLoggedIn = !!decoded
  let userName = decoded?.name ?? "EcoSpark User"
  let userRole: "ADMIN" | "MEMBER" | undefined =
    decoded?.role === "ADMIN" ? "ADMIN" : decoded?.role ? "MEMBER" : undefined

  if (!decoded) {
    try {
      const profile = await getMyProfile()
      isLoggedIn = true
      userName = profile.data.name
      userRole = profile.data.role === "ADMIN" ? "ADMIN" : "MEMBER"
    } catch {}
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <TooltipProvider>
              <AppShell
                isLoggedIn={isLoggedIn}
                userName={isLoggedIn ? userName : undefined}
                userRole={isLoggedIn ? userRole : undefined}
              >
                {children}
              </AppShell>
              <Toaster richColors />
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
