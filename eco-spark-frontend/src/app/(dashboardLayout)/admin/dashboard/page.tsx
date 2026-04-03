import { getAdminDashboardStats } from "@/services/dashboard.services"
import { StatsCard } from "@/components/shared/StatsCard"
import { IdeaStatusBarChart } from "@/components/shared/charts/IdeaStatusBarChart"
import { PageHeader } from "@/components/shared/PageHeader"

export default async function AdminDashboardPage() {
  const result = await getAdminDashboardStats()
  const stats = result.data

  return (
    <section className="space-y-6">
      <PageHeader title="Admin Dashboard" />
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
