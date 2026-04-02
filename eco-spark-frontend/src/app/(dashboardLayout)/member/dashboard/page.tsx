import { getMemberDashboardStats } from "@/services/dashboard.services"
import { StatsCard } from "@/components/shared/StatsCard"
import { IdeaStatusBarChart } from "@/components/shared/charts/IdeaStatusBarChart"

export default async function MemberDashboardPage() {
  const result = await getMemberDashboardStats()
  const stats = result.data

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Member Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatsCard title="My Total Ideas" value={stats.totalIdeas} />
        <StatsCard title="Votes Received" value={stats.totalVotesReceived} />
        <StatsCard title="Comments Received" value={stats.totalCommentsReceived} />
      </div>
      <IdeaStatusBarChart
        data={[
          { status: "Approved", value: stats.ideasByStatus.approved },
          { status: "Pending", value: stats.ideasByStatus.pending },
          { status: "Rejected", value: stats.ideasByStatus.rejected },
        ]}
      />
    </section>
  )
}
