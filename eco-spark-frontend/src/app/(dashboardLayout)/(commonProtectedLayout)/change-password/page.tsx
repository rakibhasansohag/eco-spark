import { ChangePasswordForm } from "@/components/modules/Profile/ChangePasswordForm"
import { PageHeader } from "@/components/shared/PageHeader"
import { getMyProfile } from "@/services/user.services"

export default async function ChangePasswordPage() {
  const canChangePassword = await getMyProfile()
    .then((res) => res.data.canChangePassword !== false)
    .catch(() => true)

  return (
    <section className="space-y-6">
      <PageHeader title="Change Password" description="Update your account password." />
      {canChangePassword ? (
        <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6">
          <ChangePasswordForm />
        </div>
      ) : (
        <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Your account is connected via Google sign-in. Password changes should be managed in your
            Google account security settings.
          </p>
        </div>
      )}
    </section>
  )
}
