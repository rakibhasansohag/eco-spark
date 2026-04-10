import { Navbar } from "@/components/modules/Dashboard/Navbar"
import { Sidebar } from "@/components/modules/Dashboard/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/20">
      <Sidebar />
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden md:ml-64">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
