"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface BeamHoverCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  intensity?: number
}

export function BeamHoverCard({
  children,
  className,
  intensity = 11,
  onMouseMove,
  onMouseLeave,
  ...props
}: BeamHoverCardProps) {
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget
    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const px = x / rect.width
    const py = y / rect.height
    element.style.setProperty("--beam-mx", `${(px * 100).toFixed(2)}%`)
    element.style.setProperty("--beam-my", `${(py * 100).toFixed(2)}%`)
    element.style.setProperty("--beam-size", `${220 + intensity * 4}px`)
    element.style.setProperty("--beam-opacity", "1")
    onMouseMove?.(event)
  }

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget
    element.style.setProperty("--beam-mx", "50%")
    element.style.setProperty("--beam-my", "50%")
    element.style.setProperty("--beam-opacity", "0")
    onMouseLeave?.(event)
  }

  return (
    <div
      className="group/beam relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        className={cn(
          "relative overflow-hidden transition-colors duration-300 ease-out",
          className
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-[var(--beam-opacity,0)] transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(var(--beam-size,260px) circle at var(--beam-mx,50%) var(--beam-my,50%), hsl(var(--primary)/0.22), transparent 62%), linear-gradient(125deg, hsl(var(--primary)/0.12) 0%, transparent 42%, hsl(var(--chart-2)/0.16) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-[-60%] left-[-35%] z-10 w-[52%] rotate-[20deg] bg-gradient-to-r from-transparent via-primary/35 to-transparent opacity-0 blur-2xl transition-all duration-500 ease-out group-hover/beam:translate-x-[220%] group-hover/beam:opacity-100 dark:via-primary/45"
        />
        {children}
      </div>
    </div>
  )
}
