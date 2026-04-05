import { getMemberDashboardStats } from "@/services/dashboard.services"
import { Activity, CheckCircle2, Clock3, Lightbulb } from "lucide-react"
import { StatsCard } from "@/components/shared/StatsCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { IMemberDashboardStats } from "@/types/dashboard.types"
import { AdminStatusBarChart } from "@/components/shared/charts/AdminStatusBarChart"
import { AdminOverviewHorizontalBarChart } from "@/components/shared/charts/AdminOverviewHorizontalBarChart"
import { MemberRecentActivityTable } from "@/components/shared/table/MemberRecentActivityTable"
import { FadeInSection } from "@/components/shared/motion/FadeInSection"

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
    const statsResult = await getMemberDashboardStats()
    stats = statsResult.data
  } catch {
    hasLoadError = true
  }

  const inReviewCount = stats.ideasByStatus.pending
  const approvalRate =
    stats.totalIdeas > 0
      ? Math.round((stats.ideasByStatus.approved / stats.totalIdeas) * 100)
      : 0
  const totalEngagement = stats.totalVotesReceived + stats.totalCommentsReceived

  const activityRows = [
    {
      label: "Approved Ideas",
      count: stats.ideasByStatus.approved,
      share:
        stats.totalIdeas > 0 ? Math.round((stats.ideasByStatus.approved / stats.totalIdeas) * 100) : 0,
      insight: "Published",
    },
    {
      label: "In Review",
      count: inReviewCount,
      share: stats.totalIdeas > 0 ? Math.round((inReviewCount / stats.totalIdeas) * 100) : 0,
      insight: "Pending feedback",
    },
    {
      label: "Rejected",
      count: stats.ideasByStatus.rejected,
      share:
        stats.totalIdeas > 0 ? Math.round((stats.ideasByStatus.rejected / stats.totalIdeas) * 100) : 0,
      insight: "Needs revision",
    },
    {
      label: "Total Engagement",
      count: totalEngagement,
      share: totalEngagement > 0 ? 100 : 0,
      insight: "Votes + comments",
    },
  ]

  return (
    <section className="space-y-6">
      <PageHeader
        title="My Dashboard"
        description="Track idea progress, engagement, and visibility from your member workspace."
        eyebrow="Performance Snapshot"
      />
      {hasLoadError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          Unable to load dashboard stats right now. Please refresh.
        </p>
      ) : null}
      <FadeInSection delay={0.04}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="My Total Ideas" value={stats.totalIdeas} icon={Lightbulb} />
          <StatsCard title="Approval Rate" value={`${approvalRate}%`} icon={CheckCircle2} />
          <StatsCard title="In Review" value={inReviewCount} icon={Clock3} />
          <StatsCard title="Engagement" value={totalEngagement} icon={Activity} />
        </div>
      </FadeInSection>
      <FadeInSection delay={0.08}>
        <div className="grid gap-4 lg:grid-cols-2">
          <AdminStatusBarChart
            title="My Idea Status Counts"
            data={[
              { label: "Approved", value: stats.ideasByStatus.approved },
              { label: "In Review", value: inReviewCount },
              { label: "Rejected", value: stats.ideasByStatus.rejected },
            ]}
          />
          <AdminOverviewHorizontalBarChart
            title="My Engagement Comparison"
            data={[
              { label: "Ideas", value: stats.totalIdeas },
              { label: "Votes", value: stats.totalVotesReceived },
              { label: "Comments", value: stats.totalCommentsReceived },
              { label: "Approved", value: stats.ideasByStatus.approved },
            ]}
          />
        </div>
      </FadeInSection>
      <FadeInSection delay={0.12}>
        <MemberRecentActivityTable rows={activityRows} />
      </FadeInSection>
    </section>
  )
}
