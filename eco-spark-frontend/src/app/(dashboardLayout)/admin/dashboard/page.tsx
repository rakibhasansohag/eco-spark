import { getAdminDashboardStats } from "@/services/dashboard.services"
import { StatsCard } from "@/components/shared/StatsCard"
import { IdeaStatusBarChart } from "@/components/shared/charts/IdeaStatusBarChart"
import { PageHeader } from "@/components/shared/PageHeader"
import { IAdminDashboardStats } from "@/types/dashboard.types"

export default async function AdminDashboardPage() {
  let stats: IAdminDashboardStats = {
    totalMembers: 0,
    totalIdeas: 0,
    ideasByStatus: {
      approved: 0,
      pending: 0,
      underReview: 0,
      rejected: 0,
    },
  }
  let hasLoadError = false

  try {
    const result = await getAdminDashboardStats()
    stats = result.data
  } catch {
    hasLoadError = true
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Admin Dashboard" />
      {hasLoadError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          Unable to load dashboard stats right now. Please refresh.
        </p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatsCard title="Total Members" value={stats.totalMembers} />
        <StatsCard title="Total Ideas" value={stats.totalIdeas} />
        <StatsCard title="Approved Ideas" value={stats.ideasByStatus.approved} />
      </div>
      <IdeaStatusBarChart
        data={[
          { status: "Approved", value: stats.ideasByStatus.approved },
          { status: "Pending", value: stats.ideasByStatus.pending },
          { status: "Under Review", value: stats.ideasByStatus.underReview },
          { status: "Rejected", value: stats.ideasByStatus.rejected },
        ]}
      />
    </section>
  )
}
