"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
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
  const [openIndex, setOpenIndex] = useState<number>(0)

  return (
    <section className="rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)] md:p-8">
      <SectionHeader
        title="Frequently Asked Questions"
        description="Key details about submissions, moderation, and premium idea access."
        className="mb-6"
      />
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <article key={faq.question} className="overflow-hidden rounded-xl border bg-background">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/50"
              onClick={() => setOpenIndex((prev) => (prev === index ? -1 : index))}
              aria-expanded={openIndex === index}
            >
              <h3 className="text-base font-semibold tracking-tight">{faq.question}</h3>
              <ChevronDown
                className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {openIndex === index ? (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <p className="px-5 pb-5 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </article>
        ))}
      </div>
    </section>
  )
}
