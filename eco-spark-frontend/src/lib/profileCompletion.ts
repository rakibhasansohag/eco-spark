import { IUser } from "@/types/user.types"

export interface IProfileChecklistItem {
  key: string
  label: string
  done: boolean
}

const hasText = (value?: string | null) => !!value && value.trim().length > 0

export const buildProfileChecklist = (user: Partial<IUser>): IProfileChecklistItem[] => {
  return [
    { key: "name", label: "Add your full name", done: hasText(user.name) },
    { key: "image", label: "Upload profile picture", done: hasText(user.image) },
    { key: "bio", label: "Write a short bio", done: hasText(user.bio) },
    { key: "jobTitle", label: "Set your job title", done: hasText(user.jobTitle) },
    { key: "organization", label: "Add organization", done: hasText(user.organization) },
    { key: "location", label: "Set your location", done: hasText(user.location) },
    { key: "website", label: "Add website URL", done: hasText(user.website) },
    { key: "phone", label: "Add phone number", done: hasText(user.phone) },
  ]
}

export const getProfileCompletion = (user: Partial<IUser>): number => {
  const checklist = buildProfileChecklist(user)
  const completed = checklist.filter((item) => item.done).length
  return Math.round((completed / checklist.length) * 100)
}
