import { getAdminDashboardStats } from "@/services/dashboard.services"
import { StatsCard } from "@/components/shared/StatsCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { IAdminDashboardStats } from "@/types/dashboard.types"
import { DashboardStatusDonutChart } from "@/components/shared/charts/DashboardStatusDonutChart"
import { DashboardMetricsBarChart } from "@/components/shared/charts/DashboardMetricsBarChart"
import { getMyProfile } from "@/services/user.services"
import { buildProfileChecklist, getProfileCompletion } from "@/lib/profileCompletion"
import { ProfileCompletionChecklistCard } from "@/components/modules/Profile/ProfileCompletionChecklistCard"
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
  let profileCompletion = 0
  let profileChecklist = buildProfileChecklist({})

  try {
    const [statsResult, profileResult] = await Promise.all([
      getAdminDashboardStats(),
      getMyProfile(),
    ])
    stats = statsResult.data
    profileCompletion = getProfileCompletion(profileResult.data)
    profileChecklist = buildProfileChecklist(profileResult.data)
  } catch {
    hasLoadError = true
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Monitor platform health, content pipeline status, and member activity in one place."
        eyebrow="Command Center"
      >
        <div className="rounded-full border bg-background/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          Profile {profileCompletion}% complete
        </div>
      </PageHeader>
      <FadeInSection>
        <ProfileCompletionChecklistCard completion={profileCompletion} items={profileChecklist} />
      </FadeInSection>
      {hasLoadError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          Unable to load dashboard stats right now. Please refresh.
        </p>
      ) : null}
      <FadeInSection delay={0.04}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatsCard title="Total Members" value={stats.totalMembers} />
        <StatsCard title="Total Ideas" value={stats.totalIdeas} />
        <StatsCard title="Approved Ideas" value={stats.ideasByStatus.approved} />
      </div>
      </FadeInSection>
      <FadeInSection delay={0.08}>
      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardStatusDonutChart
          title="Idea Status Distribution"
          data={[
            { label: "Approved", value: stats.ideasByStatus.approved },
            { label: "Pending", value: stats.ideasByStatus.pending },
            { label: "Under Review", value: stats.ideasByStatus.underReview },
            { label: "Rejected", value: stats.ideasByStatus.rejected },
          ]}
        />
        <DashboardMetricsBarChart
          title="Platform Overview"
          data={[
            { label: "Members", value: stats.totalMembers },
            { label: "Ideas", value: stats.totalIdeas },
            { label: "Approved", value: stats.ideasByStatus.approved },
            { label: "Pending", value: stats.ideasByStatus.pending },
          ]}
        />
      </div>
      </FadeInSection>
    </section>
  )
}
