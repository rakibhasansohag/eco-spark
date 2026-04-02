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
    <div className="h-72 w-full rounded-lg border bg-background p-4">
      <p className="mb-4 text-sm font-medium text-muted-foreground">
        Ideas by Status
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
