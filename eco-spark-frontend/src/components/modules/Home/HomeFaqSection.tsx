import { SectionHeader } from "@/components/shared/SectionHeader"

const faqs = [
  {
    question: "Can anyone submit an idea?",
    answer:
      "Yes. Any member account can submit ideas, save drafts, and improve proposals before sending them for review.",
  },
  {
    question: "How are ideas reviewed?",
    answer:
      "Ideas go through moderation and quality checks, then can be approved, rejected with feedback, or kept under review.",
  },
  {
    question: "What does paid idea access include?",
    answer:
      "Paid access unlocks full implementation-level details for premium ideas, including the complete problem-solution breakdown.",
  },
  {
    question: "Can I track who purchased my paid idea?",
    answer:
      "Yes. The member dashboard includes an Idea Buyers area that shows successful purchases of your authored paid ideas.",
  },
]

export function HomeFaqSection() {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)] md:p-8">
      <SectionHeader
        title="Frequently Asked Questions"
        description="Key details about submissions, moderation, and premium idea access."
        className="mb-6"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map((faq) => (
          <article key={faq.question} className="rounded-xl border bg-background p-5">
            <h3 className="text-base font-semibold tracking-tight">{faq.question}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
