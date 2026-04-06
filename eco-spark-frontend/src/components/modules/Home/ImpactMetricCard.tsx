"use client"

import { useEffect, useRef, useState } from "react"
import { BeamHoverCard } from "@/components/shared/interactive/BeamHoverCard"

interface ImpactMetricCardProps {
  title: string
  description: string
  target: number
  mode: "compact-plus" | "plus" | "lt-hours"
}

export function ImpactMetricCard({ title, description, target, mode }: ImpactMetricCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasEntered, setHasEntered] = useState(false)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (typeof IntersectionObserver === "undefined") {
      const frameId = requestAnimationFrame(() => setHasEntered(true))
      return () => cancelAnimationFrame(frameId)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasEntered(true)
        observer.disconnect()
      }
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasEntered) return

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const shouldReduceMotion = process.env.NODE_ENV === "production" && prefersReducedMotion

    if (shouldReduceMotion) {
      const frameId = requestAnimationFrame(() => setValue(target))
      return () => cancelAnimationFrame(frameId)
    }

    const duration = 2200
    const start = performance.now()
    let frameId = 0

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [hasEntered, target])

  const rounded = Math.round(value)
  const formattedWithCommas = new Intl.NumberFormat("en-US").format(rounded)

  const displayValue =
    mode === "compact-plus"
      ? `${formattedWithCommas}+`
      : mode === "plus"
        ? `${formattedWithCommas}+`
        : `<${rounded}h`

  return (
    <div ref={ref}>
      <BeamHoverCard className="rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="mt-2 text-4xl leading-none font-bold tracking-tight tabular-nums">{displayValue}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </BeamHoverCard>
    </div>
  )
}
