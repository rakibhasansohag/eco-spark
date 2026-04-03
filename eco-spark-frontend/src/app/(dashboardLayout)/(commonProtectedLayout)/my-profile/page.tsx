import { getMyProfile } from "@/services/user.services"
import { MyProfileForm } from "@/components/modules/Profile/MyProfileForm"
import { PageHeader } from "@/components/shared/PageHeader"

export default async function MyProfilePage() {
  const result = await getMyProfile()
  const user = result.data

  return (
    <section className="space-y-6">
      <PageHeader title="My Profile" description="Update your name and profile image." />
      <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6">
        <MyProfileForm initialName={user.name} initialImage={user.image ?? ""} />
      </div>
    </section>
  )
}
