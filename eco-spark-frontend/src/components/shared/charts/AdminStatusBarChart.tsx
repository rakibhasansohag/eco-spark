"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface AdminStatusBarChartProps {
  title: string
  data: Array<{
    label: string
    value: number
  }>
}

const palette = [
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
]

export function AdminStatusBarChart({ title, data }: AdminStatusBarChartProps) {
  const getBarColor = (index: number) =>
    index === 0 ? "var(--color-primary)" : palette[(index - 1) % palette.length]

  return (
    <div className="rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
      <p className="mb-4 text-sm font-medium text-muted-foreground">{title}</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
            />
            <Tooltip
              cursor={{ fill: "var(--color-muted)", opacity: 0.15 }}
              formatter={(value) => [Number(value).toLocaleString(), "Count"]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--color-border)",
                background: "var(--color-card)",
                color: "var(--color-foreground)",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              itemStyle={{ color: "var(--color-foreground)", fontSize: 12 }}
              labelStyle={{ color: "var(--color-muted-foreground)", fontWeight: 600, marginBottom: 4 }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={34}>
              {data.map((item, index) => (
                <Cell key={item.label} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
