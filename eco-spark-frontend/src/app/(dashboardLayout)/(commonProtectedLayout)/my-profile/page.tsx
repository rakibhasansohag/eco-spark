import { PageHeader } from "@/components/shared/PageHeader"

export default function MyProfilePage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your account details and preferences."
      />
      <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Profile management will be available in an upcoming update.
        </p>
      </div>
    </section>
  )
}
