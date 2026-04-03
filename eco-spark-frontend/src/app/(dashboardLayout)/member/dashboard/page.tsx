import { getMemberDashboardStats } from "@/services/dashboard.services"
import { StatsCard } from "@/components/shared/StatsCard"
import { IdeaStatusBarChart } from "@/components/shared/charts/IdeaStatusBarChart"
import { PageHeader } from "@/components/shared/PageHeader"
import { IMemberDashboardStats } from "@/types/dashboard.types"

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
      <PageHeader title="My Dashboard" />
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
