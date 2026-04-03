import { getMyProfile } from "@/services/user.services"
import { MyProfileForm } from "@/components/modules/Profile/MyProfileForm"
import { PageHeader } from "@/components/shared/PageHeader"

export default async function MyProfilePage() {
  const result = await getMyProfile()
  const user = result.data

  return (
    <section className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your avatar, personal details, and public professional profile."
      />
      <div className="mx-auto w-full max-w-3xl rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
        <MyProfileForm
          initialName={user.name}
          initialImage={user.image ?? ""}
          initialBio={user.bio ?? ""}
          initialOrganization={user.organization ?? ""}
          initialJobTitle={user.jobTitle ?? ""}
          initialLocation={user.location ?? ""}
          initialWebsite={user.website ?? ""}
          initialPhone={user.phone ?? ""}
        />
      </div>
    </section>
  )
}
