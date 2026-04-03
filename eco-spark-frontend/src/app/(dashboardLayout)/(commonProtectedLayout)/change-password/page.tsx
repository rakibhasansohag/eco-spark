import { PageHeader } from "@/components/shared/PageHeader"

export default function ChangePasswordPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Change Password"
        description="Update your account password."
      />
      <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Password update form will be available in an upcoming update.
        </p>
      </div>
    </section>
  )
}
