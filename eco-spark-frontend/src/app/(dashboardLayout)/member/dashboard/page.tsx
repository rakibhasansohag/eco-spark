import { getMemberDashboardStats } from "@/services/dashboard.services"

export default async function MemberDashboardPage() {
  const result = await getMemberDashboardStats()
  const stats = result.data

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Member Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm text-muted-foreground">My Total Ideas</p>
          <p className="mt-2 text-2xl font-bold">{stats.totalIdeas}</p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm text-muted-foreground">Votes Received</p>
          <p className="mt-2 text-2xl font-bold">{stats.totalVotesReceived}</p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm text-muted-foreground">Comments Received</p>
          <p className="mt-2 text-2xl font-bold">{stats.totalCommentsReceived}</p>
        </div>
      </div>
    </section>
  )
}
