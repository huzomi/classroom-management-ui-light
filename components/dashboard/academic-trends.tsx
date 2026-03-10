"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

const hourlyData = [
  { time: "08:00", usage: 45 },
  { time: "09:00", usage: 78 },
  { time: "10:00", usage: 92 },
  { time: "11:00", usage: 85 },
  { time: "12:00", usage: 42 },
  { time: "13:00", usage: 38 },
  { time: "14:00", usage: 72 },
  { time: "15:00", usage: 88 },
  { time: "16:00", usage: 75 },
  { time: "17:00", usage: 55 },
  { time: "18:00", usage: 35 },
  { time: "19:00", usage: 48 },
  { time: "20:00", usage: 62 },
  { time: "21:00", usage: 28 },
]

const weeklyData = [
  { time: "周一", usage: 82 },
  { time: "周二", usage: 78 },
  { time: "周三", usage: 85 },
  { time: "周四", usage: 72 },
  { time: "周五", usage: 68 },
  { time: "周六", usage: 35 },
  { time: "周日", usage: 22 },
]

const topDepartments = [
  { name: "计算机学院", count: 1256 },
  { name: "商学院", count: 1089 },
  { name: "外国语学院", count: 967 },
  { name: "理学院", count: 854 },
  { name: "艺术学院", count: 721 },
]

export function AcademicTrends() {
  const [timeRange, setTimeRange] = useState<"day" | "week">("day")
  const data = timeRange === "day" ? hourlyData : weeklyData

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          教学运行趋势
        </h2>
        <span className="text-xs text-muted-foreground">Academic Trends</span>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">使用频次曲线</p>
          <div className="flex rounded-lg bg-secondary p-1">
            <button
              onClick={() => setTimeRange("day")}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                timeRange === "day"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              24小时
            </button>
            <button
              onClick={() => setTimeRange("week")}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                timeRange === "week"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              7天
            </button>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="oklch(0.55 0.2 250)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="oklch(0.55 0.2 250)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.5 0.01 250)", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.5 0.01 250)", fontSize: 11 }}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.9 0.01 250)",
                  borderRadius: "8px",
                  color: "oklch(0.2 0.02 250)",
                }}
              />
              <Area
                type="monotone"
                dataKey="usage"
                stroke="oklch(0.55 0.2 250)"
                strokeWidth={2}
                fill="url(#usageGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <p className="mb-4 text-sm text-muted-foreground">
          学院/机构使用排行 Top 5
        </p>
        <div className="space-y-3">
          {topDepartments.map((dept, index) => (
            <div key={dept.name} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium",
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : index < 3
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground"
                )}
              >
                {index + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{dept.name}</span>
                  <span className="text-muted-foreground">
                    {dept.count.toLocaleString()} 课次
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      index === 0 ? "bg-primary" : "bg-primary/50"
                    )}
                    style={{
                      width: `${(dept.count / topDepartments[0].count) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
