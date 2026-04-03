"use client"

import { useMemo } from "react"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { AppField } from "@/components/shared/form/AppField"
import { AppTextarea } from "@/components/shared/form/AppTextarea"
import { AppSubmitButton } from "@/components/shared/form/AppSubmitButton"
import { normalizeErrors } from "@/lib/formUtils"
import { updateProfileAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/my-profile/_action"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface MyProfileFormProps {
  initialName: string
  initialImage: string
  initialBio?: string
  initialOrganization?: string
  initialJobTitle?: string
  initialLocation?: string
  initialWebsite?: string
  initialPhone?: string
}

export function MyProfileForm({
  initialName,
  initialImage,
  initialBio = "",
  initialOrganization = "",
  initialJobTitle = "",
  initialLocation = "",
  initialWebsite = "",
  initialPhone = "",
}: MyProfileFormProps) {
  const mutation = useMutation({ mutationFn: updateProfileAction })
  const initials = useMemo(
    () =>
      initialName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || "U",
    [initialName]
  )

  const form = useForm({
    defaultValues: {
      name: initialName,
      image: initialImage,
      bio: initialBio,
      organization: initialOrganization,
      jobTitle: initialJobTitle,
      location: initialLocation,
      website: initialWebsite,
      phone: initialPhone,
      avatar: undefined as File | undefined,
    },
    onSubmit: async ({ value }) => {
      const result = await mutation.mutateAsync(value)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    },
  })

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field name="avatar">
        {(field) => (
          <div id="profile-image" className="scroll-mt-24 space-y-3 rounded-xl border bg-background p-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarImage
                  src={
                    field.state.value
                      ? URL.createObjectURL(field.state.value)
                      : form.getFieldValue("image") || undefined
                  }
                  alt={form.getFieldValue("name") || "Profile"}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <Label htmlFor={field.name}>Profile Picture</Label>
                <Input
                  id={field.name}
                  type="file"
                  accept="image/*"
                  className="h-10"
                  onChange={(event) => {
                    const selected = event.target.files?.[0]
                    field.handleChange(selected)
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP up to 2MB
                </p>
              </div>
            </div>
          </div>
        )}
      </form.Field>

      <form.Field name="name">
        {(field) => (
          <div id="profile-name" className="scroll-mt-24">
            <AppField
              id={field.name}
              label="Name"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              touched={field.state.meta.isTouched}
              errors={normalizeErrors(field.state.meta.errors)}
              placeholder="Your full name"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="image">
        {(field) => (
          <AppField
            id={field.name}
            label="Profile Image URL"
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            touched={field.state.meta.isTouched}
            errors={normalizeErrors(field.state.meta.errors)}
            placeholder="https://example.com/avatar.jpg"
          />
        )}
      </form.Field>

      <div className="grid gap-4 md:grid-cols-2">
        <form.Field name="jobTitle">
          {(field) => (
            <div id="profile-jobTitle" className="scroll-mt-24">
              <AppField
                id={field.name}
                label="Job Title"
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                touched={field.state.meta.isTouched}
                errors={normalizeErrors(field.state.meta.errors)}
                placeholder="e.g. Sustainability Analyst"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="organization">
          {(field) => (
            <div id="profile-organization" className="scroll-mt-24">
              <AppField
                id={field.name}
                label="Organization"
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                touched={field.state.meta.isTouched}
                errors={normalizeErrors(field.state.meta.errors)}
                placeholder="Your company or initiative"
              />
            </div>
          )}
        </form.Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <form.Field name="location">
          {(field) => (
            <div id="profile-location" className="scroll-mt-24">
              <AppField
                id={field.name}
                label="Location"
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                touched={field.state.meta.isTouched}
                errors={normalizeErrors(field.state.meta.errors)}
                placeholder="City, Country"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="phone">
          {(field) => (
            <div id="profile-phone" className="scroll-mt-24">
              <AppField
                id={field.name}
                label="Phone"
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                touched={field.state.meta.isTouched}
                errors={normalizeErrors(field.state.meta.errors)}
                placeholder="+1 234 567 890"
              />
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="website">
        {(field) => (
          <div id="profile-website" className="scroll-mt-24">
            <AppField
              id={field.name}
              label="Website"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              touched={field.state.meta.isTouched}
              errors={normalizeErrors(field.state.meta.errors)}
              placeholder="https://yourwebsite.com"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="bio">
        {(field) => (
          <div id="profile-bio" className="scroll-mt-24">
            <AppTextarea
              id={field.name}
              label="Bio"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              touched={field.state.meta.isTouched}
              errors={normalizeErrors(field.state.meta.errors)}
              placeholder="Tell people about your sustainability focus and what you are building."
              rows={4}
            />
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <AppSubmitButton
            label="Save Changes"
            loadingLabel="Saving…"
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </form.Subscribe>
    </form>
  )
}
