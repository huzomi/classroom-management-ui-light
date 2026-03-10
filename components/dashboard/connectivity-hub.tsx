"use client"

import { cn } from "@/lib/utils"
import { Wifi, Monitor, Projector, Radio, AlertCircle } from "lucide-react"

const deviceStats = [
  {
    name: "物联网中控",
    rate: 98.7,
    icon: Wifi,
    status: "normal",
  },
  {
    name: "教学 PC",
    rate: 96.2,
    icon: Monitor,
    status: "normal",
  },
  {
    name: "投影/一体机",
    rate: 94.8,
    icon: Projector,
    status: "warning",
  },
  {
    name: "流媒体服务",
    rate: 99.1,
    icon: Radio,
    status: "normal",
  },
]

const offlineByBuilding = [
  { building: "教学楼A", count: 3 },
  { building: "教学楼B", count: 5 },
  { building: "实验楼", count: 2 },
  { building: "图书馆", count: 1 },
]

export function ConnectivityHub() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          设备在线率监测
        </h2>
        <span className="text-xs text-muted-foreground">Connectivity Hub</span>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <p className="mb-4 text-sm text-muted-foreground">核心链路状态</p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {deviceStats.map((device) => (
            <div
              key={device.name}
              className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3"
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  device.status === "normal"
                    ? "bg-primary/10 text-primary"
                    : "bg-chart-3/10 text-chart-3"
                )}
              >
                <device.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{device.name}</p>
                <p
                  className={cn(
                    "text-lg font-semibold",
                    device.status === "normal"
                      ? "text-primary"
                      : "text-chart-3"
                  )}
                >
                  {device.rate}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-sm text-muted-foreground">异常终端分布</p>
        </div>
        <div className="space-y-3">
          {offlineByBuilding.map((item) => (
            <div key={item.building} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{item.building}</span>
                  <span className="text-destructive">{item.count} 台离线</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-destructive transition-all"
                    style={{ width: `${(item.count / 10) * 100}%` }}
                  />
                </div>
              </div>
              <button className="text-xs text-primary hover:underline">
                查看
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
