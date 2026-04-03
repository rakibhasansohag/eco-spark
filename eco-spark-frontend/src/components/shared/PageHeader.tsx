interface PageHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, eyebrow, children }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)] md:p-7">
      <div className="absolute -top-16 -right-16 size-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 size-44 rounded-full bg-chart-2/15 blur-3xl" />
      <div className="relative flex items-start justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
      </div>
    </div>
  )
}
