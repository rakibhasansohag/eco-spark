import { CreateIdeaForm } from "@/components/modules/Idea/CreateIdeaForm"
import { Sparkles, Target, ShieldCheck } from "lucide-react"

export default function CreateIdeaPage() {
  return (
    <section className="space-y-5">
      <div className="rounded-xl border bg-card p-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Idea Studio</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Build a production-ready idea pitch</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Use the guided steps to structure your concept, impact plan, and publishing options.
          Your progress is auto-saved while you work.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-xl border bg-card p-6">
          <CreateIdeaForm />
        </div>

        <aside className="space-y-3">
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" />
              Pro Tip
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Add measurable impact and timeline details to increase approval quality.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4 text-primary" />
              Reviewer Focus
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Reviewers prioritize clear problem statements, realistic budget range, and risk planning.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Data Safety
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Draft progress is stored locally in your browser and cleared after successful submission.
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
