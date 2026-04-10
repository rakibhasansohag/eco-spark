import { getMyProfile } from "@/services/user.services"
import { MyProfileForm } from "@/components/modules/Profile/MyProfileForm"
import { BadgeCheck, Briefcase, Building2, Globe, Mail, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react"
import { buildProfileChecklist, getProfileCompletion } from "@/lib/profileCompletion"
import { formatDate } from "@/lib/formatUtils"

export default async function MyProfilePage() {
  const result = await getMyProfile()
  const user = result.data
  const completion = getProfileCompletion(user)
  const checklist = buildProfileChecklist(user)
  const remainingItems = checklist.filter((item) => !item.done)
  const providerLabels = (user.connectedProviders ?? []).map((provider) =>
    provider === "credential" ? "Email & Password" : provider.charAt(0).toUpperCase() + provider.slice(1),
  )

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border bg-card p-6">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Account Center</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="mt-2 max-w-4xl text-sm text-muted-foreground">
          Keep your public sustainability profile complete so collaborators and reviewers can trust your
          submissions quickly.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs text-muted-foreground">Profile Completion</p>
            <p className="mt-1 text-xl font-semibold">{completion}%</p>
          </div>
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs text-muted-foreground">Connected Methods</p>
            <p className="mt-1 text-xl font-semibold">{providerLabels.length || 1}</p>
          </div>
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs text-muted-foreground">Member Since</p>
            <p className="mt-1 text-xl font-semibold">{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <div className="rounded-xl border bg-card p-6 xl:col-span-8">
          <MyProfileForm
            initialName={user.name}
            initialEmail={user.email}
            initialImage={user.image ?? ""}
            initialBio={user.bio ?? ""}
            initialOrganization={user.organization ?? ""}
            initialJobTitle={user.jobTitle ?? ""}
            initialLocation={user.location ?? ""}
            initialWebsite={user.website ?? ""}
            initialPhone={user.phone ?? ""}
          />
        </div>

        <aside className="space-y-3 xl:col-span-4">
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Mail className="h-4 w-4 text-primary" />
              Connected Email
            </div>
            <p className="mt-2 break-all text-sm">{user.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">Joined {formatDate(user.createdAt)}</p>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Connected Sign-In Methods
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {providerLabels.length > 0 ? (
                providerLabels.map((provider) => (
                  <span key={provider} className="rounded-full border px-2 py-1 text-xs">
                    {provider}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No providers detected</span>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BadgeCheck className="h-4 w-4 text-primary" />
                Profile Completion
              </div>
              <span className="text-sm font-semibold">{completion}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${completion}%` }} />
            </div>
            <ul className="mt-3 space-y-2">
              {checklist.map((item) => (
                <li key={item.key} className="flex items-center gap-2 text-xs">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.done ? "bg-emerald-500" : "bg-muted-foreground/40"
                    }`}
                  />
                  <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" />
              Profile Snapshot
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <p className="font-semibold text-foreground">{user.name}</p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" />
                {user.jobTitle || "Add your job title"}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                {user.organization || "Add your organization"}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {user.location || "Add your location"}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-3.5 w-3.5" />
                {user.website || "Add your website"}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                {user.phone || "Add your phone"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-primary" />
              Growth Tips
            </div>
            {remainingItems.length > 0 ? (
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {remainingItems.slice(0, 3).map((item) => (
                  <li key={item.key}>• {item.label}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Your profile is fully complete and ready for stronger visibility.
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}
