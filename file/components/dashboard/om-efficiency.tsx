"use client"

import { Clock, AlertTriangle, CheckCircle2, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

const omStats = {
  totalTickets: 23,
  pendingDispatch: 5,
  avgResponseTime: "12分钟",
  avgMTTR: "45分钟",
}

const criticalAlerts = [
  {
    id: 1,
    level: "P0",
    type: "硬件故障",
    location: "教学楼A-301",
    device: "投影仪过热告警",
    time: "5分钟前",
  },
  {
    id: 2,
    level: "P1",
    type: "能耗异常",
    location: "实验楼-205",
    device: "空调能耗超标 180%",
    time: "12分钟前",
  },
  {
    id: 3,
    level: "P1",
    type: "网络故障",
    location: "教学楼B-102",
    device: "物联中控离线",
    time: "18分钟前",
  },
  {
    id: 4,
    level: "P0",
    type: "硬件故障",
    location: "图书馆-A301",
    device: "一体机无信号",
    time: "25分钟前",
  },
]

export function OMEfficiency() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          运维保障核心指标
        </h2>
        <span className="text-xs text-muted-foreground">O&M Efficiency</span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10">
              <AlertTriangle className="h-4 w-4 text-chart-2" />
            </div>
            <span className="text-xs text-muted-foreground">今日报修</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {omStats.totalTickets}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/10">
              <Clock className="h-4 w-4 text-chart-3" />
            </div>
            <span className="text-xs text-muted-foreground">待分派工单</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-chart-3">
            {omStats.pendingDispatch}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Timer className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">平均响应时长</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-primary">
            {omStats.avgResponseTime}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">平均修复时长</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {omStats.avgMTTR}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
            </span>
            <p className="text-sm text-muted-foreground">严重告警流</p>
          </div>
          <span className="text-xs text-muted-foreground">实时更新</span>
        </div>

        <div className="space-y-3">
          {criticalAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3 transition-colors hover:bg-secondary"
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold",
                  alert.level === "P0"
                    ? "bg-destructive/20 text-destructive"
                    : "bg-chart-3/20 text-chart-3"
                )}
              >
                {alert.level}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary">
                    {alert.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {alert.location}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-foreground">
                  {alert.device}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {alert.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
