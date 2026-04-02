import { CreateIdeaForm } from "@/components/modules/Idea/CreateIdeaForm"

export default function CreateIdeaPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Create Idea</h1>
      <div className="rounded-lg border bg-background p-6">
        <CreateIdeaForm />
      </div>
    </section>
  )
}
