"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface DashboardStatusDonutChartProps {
  title: string
  data: Array<{
    label: string
    value: number
  }>
}

const palette = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
]

export function DashboardStatusDonutChart({ title, data }: DashboardStatusDonutChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0)
  const ranked = [...data].sort((a, b) => b.value - a.value)
  const topStatus = ranked[0]

  return (
    <div className="overflow-hidden rounded-xl border bg-gradient-to-br from-card to-primary/5 p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">Live status distribution and share</p>
        </div>
        {topStatus ? (
          <span className="rounded-full border bg-background/70 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            Top: {topStatus.label}
          </span>
        ) : null}
      </div>
      <div className="grid items-center gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="relative h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={104}
                stroke="hsl(var(--background))"
                strokeWidth={3}
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.label} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => {
                  const numeric = Number(value)
                  const percent = total > 0 ? Math.round((numeric / total) * 100) : 0
                  return [`${numeric.toLocaleString()} (${percent}%)`, name]
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                  color: "hsl(var(--foreground))",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                itemStyle={{ color: "hsl(var(--foreground))", fontSize: 12 }}
                labelStyle={{ color: "hsl(var(--muted-foreground))", fontWeight: 600, marginBottom: 4 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-xl border bg-background/80 px-5 py-3 text-center shadow-sm backdrop-blur">
              <p className="text-2xl leading-none font-bold text-foreground">{total.toLocaleString()}</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Total Items</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {ranked.map((item, index) => {
            const percent = total > 0 ? Math.round((item.value / total) * 100) : 0

            return (
              <div key={item.label} className="rounded-lg border bg-background/80 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block size-2.5 rounded-full"
                      style={{ backgroundColor: palette[index % palette.length] }}
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.value.toLocaleString()}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: palette[index % palette.length],
                    }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{percent}% of total</p>
              </div>
            )
          })}
          <div className="rounded-lg border bg-background/80 px-3 py-2">
            <p className="text-xs font-medium text-muted-foreground">Snapshot</p>
            <p className="mt-1 text-sm text-foreground">
              {ranked.length > 0
                ? `${ranked[0].label} currently leads the distribution.`
                : "No status data available yet."}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Values refresh based on the current dashboard dataset.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
