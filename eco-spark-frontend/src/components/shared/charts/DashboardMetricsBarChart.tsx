"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface DashboardMetricsBarChartProps {
  title: string
  data: Array<{
    label: string
    value: number
  }>
}

export function DashboardMetricsBarChart({ title, data }: DashboardMetricsBarChartProps) {
  const sortedData = [...data].sort((a, b) => b.value - a.value)
  const maxValue = sortedData[0]?.value ?? 0
  const palette = [
    "hsl(var(--primary))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ]

  return (
    <div className="overflow-hidden rounded-xl border bg-gradient-to-br from-card to-chart-2/10 p-6 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)]">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">Ranked metrics with performance emphasis</p>
        </div>
        {sortedData[0] ? (
          <span className="rounded-full border bg-background/70 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            Leading: {sortedData[0].label}
          </span>
        ) : null}
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ top: 4, right: 18, left: 24, bottom: 4 }}>
            <defs>
              <filter id="dashboardMetricGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} vertical={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              domain={[0, (dataMax: number) => Math.max(dataMax + Math.ceil(dataMax * 0.15), 5)]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={110}
              tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
              formatter={(value) => [Number(value).toLocaleString(), "Value"]}
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
            <Bar
              dataKey="value"
              radius={[0, 8, 8, 0]}
              barSize={16}
              background={{ fill: "hsl(var(--muted))", radius: 8 }}
              filter="url(#dashboardMetricGlow)"
            >
              {sortedData.map((entry, index) => (
                <Cell key={entry.label} fill={palette[index % palette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {sortedData[0] ? (
        <div className="mt-4 rounded-lg border bg-background/80 p-3">
          <p className="text-xs font-medium text-muted-foreground">Top Performing Metric</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-foreground">{sortedData[0].label}</p>
            <p className="text-sm font-semibold text-foreground">{sortedData[0].value.toLocaleString()}</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {maxValue > 0
              ? `${Math.round((sortedData[0].value / maxValue) * 100)}% of current max capacity.`
              : "No metric values available yet."}
          </p>
        </div>
      ) : null}
    </div>
  )
}
