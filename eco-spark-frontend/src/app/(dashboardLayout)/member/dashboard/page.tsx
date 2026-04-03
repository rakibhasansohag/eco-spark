import { getMemberDashboardStats } from "@/services/dashboard.services"
import { StatsCard } from "@/components/shared/StatsCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { IMemberDashboardStats } from "@/types/dashboard.types"
import { DashboardStatusDonutChart } from "@/components/shared/charts/DashboardStatusDonutChart"
import { DashboardMetricsBarChart } from "@/components/shared/charts/DashboardMetricsBarChart"

export default async function MemberDashboardPage() {
  let stats: IMemberDashboardStats = {
    totalIdeas: 0,
    ideasByStatus: {
      approved: 0,
      pending: 0,
      rejected: 0,
    },
    totalVotesReceived: 0,
    totalCommentsReceived: 0,
  }
  let hasLoadError = false

  try {
    const result = await getMemberDashboardStats()
    stats = result.data
  } catch {
    hasLoadError = true
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="My Dashboard"
        description="Track idea progress, engagement, and visibility from your member workspace."
      />
      {hasLoadError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          Unable to load dashboard stats right now. Please refresh.
        </p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatsCard title="My Total Ideas" value={stats.totalIdeas} />
        <StatsCard title="Votes Received" value={stats.totalVotesReceived} />
        <StatsCard title="Comments Received" value={stats.totalCommentsReceived} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardStatusDonutChart
          title="My Idea Status"
          data={[
            { label: "Approved", value: stats.ideasByStatus.approved },
            { label: "Pending", value: stats.ideasByStatus.pending },
            { label: "Rejected", value: stats.ideasByStatus.rejected },
          ]}
        />
        <DashboardMetricsBarChart
          title="My Engagement Metrics"
          data={[
            { label: "My Ideas", value: stats.totalIdeas },
            { label: "Votes", value: stats.totalVotesReceived },
            { label: "Comments", value: stats.totalCommentsReceived },
          ]}
        />
      </div>
    </section>
  )
}
