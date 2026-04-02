import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoSpark Hub",
  description: "Sustainability idea-sharing portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <TooltipProvider>
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
            <div className="flex-1">{children}</div>
            <Toaster richColors />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
