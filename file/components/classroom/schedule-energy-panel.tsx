"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Calendar, Zap, Clock } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface CourseItem {
  time: string
  name: string
  teacher: string
  status: "completed" | "ongoing" | "upcoming"
}

interface ScheduleEnergyPanelProps {
  courses: CourseItem[]
}

const energyData = [
  { time: "08:00", power: 1200 },
  { time: "09:00", power: 2400 },
  { time: "10:00", power: 2800 },
  { time: "11:00", power: 2600 },
  { time: "12:00", power: 800 },
  { time: "13:00", power: 600 },
  { time: "14:00", power: 2200 },
  { time: "15:00", power: 2500 },
  { time: "16:00", power: 2300 },
  { time: "17:00", power: 1800 },
]

export function ScheduleEnergyPanel({ courses }: ScheduleEnergyPanelProps) {
  const [activeTab, setActiveTab] = useState<"schedule" | "energy">("schedule")

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* Tab 切换 */}
      <div className="flex shrink-0 border-b border-border">
        <button
          onClick={() => setActiveTab("schedule")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors",
            activeTab === "schedule"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Calendar className="h-4 w-4" />
          今日课程
        </button>
        <button
          onClick={() => setActiveTab("energy")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors",
            activeTab === "energy"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Zap className="h-4 w-4" />
          能耗趋势
        </button>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-auto p-3">
        {activeTab === "schedule" ? (
          <div className="space-y-2">
            {courses.map((course, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2.5 transition-colors",
                  course.status === "ongoing"
                    ? "bg-primary/10 ring-1 ring-primary/20"
                    : course.status === "completed"
                      ? "bg-secondary/30"
                      : "bg-secondary/50"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    course.status === "ongoing"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  <Clock className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm font-medium",
                      course.status === "ongoing"
                        ? "text-primary"
                        : course.status === "completed"
                          ? "text-muted-foreground"
                          : "text-foreground"
                    )}
                  >
                    {course.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{course.teacher}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-medium text-foreground">{course.time}</p>
                  <p
                    className={cn(
                      "text-[10px]",
                      course.status === "ongoing"
                        ? "text-primary"
                        : course.status === "completed"
                          ? "text-muted-foreground"
                          : "text-muted-foreground"
                    )}
                  >
                    {course.status === "ongoing"
                      ? "进行中"
                      : course.status === "completed"
                        ? "已结束"
                        : "待上课"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="mb-3 flex shrink-0 items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">当前功率</p>
                <p className="text-xl font-semibold text-foreground">
                  2,450 <span className="text-sm font-normal text-muted-foreground">W</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">今日用电</p>
                <p className="text-xl font-semibold text-primary">
                  18.5 <span className="text-sm font-normal text-muted-foreground">kWh</span>
                </p>
              </div>
            </div>
            <div className="min-h-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={energyData}>
                  <defs>
                    <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.55 0.2 250)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="oklch(0.55 0.2 250)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.5 0.01 250)", fontSize: 10 }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.9 0.01 250)",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value}W`, "功率"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="power"
                    stroke="oklch(0.55 0.2 250)"
                    strokeWidth={2}
                    fill="url(#energyGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
