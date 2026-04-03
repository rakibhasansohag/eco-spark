import { CreateIdeaForm } from "@/components/modules/Idea/CreateIdeaForm"
import { PageHeader } from "@/components/shared/PageHeader"

export default function CreateIdeaPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Create Idea"
        description="Share a sustainability challenge and propose a solution."
      />
      <div className="mx-auto max-w-2xl rounded-lg border bg-card p-6">
        <CreateIdeaForm />
      </div>
    </section>
  )
}
