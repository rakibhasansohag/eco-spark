"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface AdminOverviewHorizontalBarChartProps {
  title: string
  data: Array<{
    label: string
    value: number
  }>
}

const palette = [
  "hsl(var(--chart-2))",
  "hsl(var(--primary))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
]

export function AdminOverviewHorizontalBarChart({ title, data }: AdminOverviewHorizontalBarChartProps) {
  const sortedData = [...data].sort((a, b) => b.value - a.value)

  return (
    <div className="rounded-xl border bg-card p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
      <p className="mb-4 text-sm font-medium text-muted-foreground">{title}</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ top: 8, right: 8, left: 12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={112}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              formatter={(value) => [Number(value).toLocaleString(), "Value"]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                color: "hsl(var(--card-foreground))",
              }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={18}>
              {sortedData.map((item, index) => (
                <Cell key={item.label} fill={palette[index % palette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
