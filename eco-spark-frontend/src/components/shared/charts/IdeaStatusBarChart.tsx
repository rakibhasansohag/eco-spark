"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface IdeaStatusBarChartProps {
  data: Array<{
    status: string
    value: number
  }>
}

export function IdeaStatusBarChart({ data }: IdeaStatusBarChartProps) {
  return (
    <div className="w-full rounded-lg border bg-background p-4">
      <p className="mb-4 text-sm font-medium text-muted-foreground">
        Ideas by Status
      </p>
      <div className="relative">
        <ResponsiveContainer width="100%" aspect={2.2} minWidth={0}>
          <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
