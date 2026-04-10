import { PageHeader } from "@/components/shared/PageHeader"
import AISeedContent from "@/components/modules/Admin/AISeedContent"

export default function AIAutomationPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="AI Idea Automation"
        description="Use Google Gemini to automatically generate and seed unique sustainability ideas into the platform."
      />
      <AISeedContent />
    </section>
  )
}
