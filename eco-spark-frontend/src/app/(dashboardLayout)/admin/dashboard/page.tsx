import { getAdminDashboardStats } from "@/services/dashboard.services"
import { CheckCircle2, Clock3, Lightbulb, Users } from "lucide-react"
import { StatsCard } from "@/components/shared/StatsCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { IAdminDashboardStats } from "@/types/dashboard.types"
import { AdminStatusBarChart } from "@/components/shared/charts/AdminStatusBarChart"
import { AdminOverviewHorizontalBarChart } from "@/components/shared/charts/AdminOverviewHorizontalBarChart"
import { AdminRecentActivityTable } from "@/components/shared/table/AdminRecentActivityTable"
import { FadeInSection } from "@/components/shared/motion/FadeInSection"

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
    const statsResult = await getAdminDashboardStats()
    stats = statsResult.data
  } catch {
    hasLoadError = true
  }

  const reviewQueue = stats.ideasByStatus.pending + stats.ideasByStatus.underReview
  const approvalRate =
    stats.totalIdeas > 0
      ? Math.round((stats.ideasByStatus.approved / stats.totalIdeas) * 100)
      : 0

  const activityRows = [
    {
      label: "Approved",
      count: stats.ideasByStatus.approved,
      share: stats.totalIdeas > 0 ? Math.round((stats.ideasByStatus.approved / stats.totalIdeas) * 100) : 0,
      priority: "Published",
    },
    {
      label: "Pending",
      count: stats.ideasByStatus.pending,
      share: stats.totalIdeas > 0 ? Math.round((stats.ideasByStatus.pending / stats.totalIdeas) * 100) : 0,
      priority: "Medium",
    },
    {
      label: "Under Review",
      count: stats.ideasByStatus.underReview,
      share:
        stats.totalIdeas > 0 ? Math.round((stats.ideasByStatus.underReview / stats.totalIdeas) * 100) : 0,
      priority: "High",
    },
    {
      label: "Rejected",
      count: stats.ideasByStatus.rejected,
      share: stats.totalIdeas > 0 ? Math.round((stats.ideasByStatus.rejected / stats.totalIdeas) * 100) : 0,
      priority: "Follow-up",
    },
  ]

  return (
    <section className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Monitor platform health, content pipeline status, and member activity in one place."
        eyebrow="Command Center"
      />
      {hasLoadError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          Unable to load dashboard stats right now. Please refresh.
        </p>
      ) : null}
      <FadeInSection delay={0.04}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Members" value={stats.totalMembers} icon={Users} />
          <StatsCard title="Total Ideas" value={stats.totalIdeas} icon={Lightbulb} />
          <StatsCard title="Approval Rate" value={`${approvalRate}%`} icon={CheckCircle2} />
          <StatsCard title="Review Queue" value={reviewQueue} icon={Clock3} />
        </div>
      </FadeInSection>
      <FadeInSection delay={0.08}>
        <div className="grid gap-4 lg:grid-cols-2">
          <AdminStatusBarChart
            title="Idea Status Counts"
            data={[
              { label: "Approved", value: stats.ideasByStatus.approved },
              { label: "Pending", value: stats.ideasByStatus.pending },
              { label: "Under Review", value: stats.ideasByStatus.underReview },
              { label: "Rejected", value: stats.ideasByStatus.rejected },
            ]}
          />
          <AdminOverviewHorizontalBarChart
            title="Platform Comparison"
            data={[
              { label: "Members", value: stats.totalMembers },
              { label: "Ideas", value: stats.totalIdeas },
              { label: "Approved", value: stats.ideasByStatus.approved },
              { label: "In Queue", value: reviewQueue },
            ]}
          />
        </div>
      </FadeInSection>
      <FadeInSection delay={0.12}>
        <AdminRecentActivityTable rows={activityRows} />
      </FadeInSection>
    </section>
  )
}
