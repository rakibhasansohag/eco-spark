import { FormSkeleton } from "@/components/shared/skeleton/FormSkeleton"

export default function ChangePasswordLoading() {
  return (
    <div className="space-y-6">
      {/* PageHeader Skeleton */}
      <div className="relative overflow-hidden rounded-xl border bg-muted/20 p-6 md:p-7">
        <div className="h-9 w-64 animate-pulse rounded-md bg-muted" />
      </div>
      <FormSkeleton fields={3} />
    </div>
  )
}
