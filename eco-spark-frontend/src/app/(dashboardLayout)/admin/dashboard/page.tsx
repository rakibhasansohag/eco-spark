import { getAdminDashboardStats } from "@/services/dashboard.services"

export default async function AdminDashboardPage() {
  const result = await getAdminDashboardStats()
  const stats = result.data

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm text-muted-foreground">Total Members</p>
          <p className="mt-2 text-2xl font-bold">{stats.totalMembers}</p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm text-muted-foreground">Total Ideas</p>
          <p className="mt-2 text-2xl font-bold">{stats.totalIdeas}</p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm text-muted-foreground">Approved Ideas</p>
          <p className="mt-2 text-2xl font-bold">{stats.ideasByStatus.approved}</p>
        </div>
      </div>
    </section>
  )
}
