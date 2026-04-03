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
  "var(--color-primary)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
]

export function DashboardStatusDonutChart({ title, data }: DashboardStatusDonutChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0)

  return (
    <div className="rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
      <p className="mb-4 text-sm font-medium text-muted-foreground">{title}</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={72}
              outerRadius={108}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell key={entry.label} fill={palette[index % palette.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--color-border)",
                background: "var(--color-card)",
                color: "var(--color-card-foreground)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {data.map((item, index) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
            <div className="flex items-center gap-2">
              <span
                className="inline-block size-2.5 rounded-full"
                style={{ backgroundColor: palette[index % palette.length] }}
              />
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
            <span className="text-sm font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Total: {total}</p>
    </div>
  )
}
