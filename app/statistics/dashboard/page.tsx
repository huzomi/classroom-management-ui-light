"use client"

import { BarChart3, TrendingUp, Monitor, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col bg-gradient-to-br from-background to-accent/20 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">数据大屏</h1>
        <div className="text-sm text-muted-foreground">实时更新于 {new Date().toLocaleString("zh-CN")}</div>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        {[
          { label: "教室总数", value: "856", icon: Monitor, color: "text-blue-500" },
          { label: "在线设备", value: "752", icon: BarChart3, color: "text-green-500" },
          { label: "今日使用率", value: "87%", icon: TrendingUp, color: "text-orange-500" },
          { label: "故障设备", value: "12", icon: AlertCircle, color: "text-red-500" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="rounded-lg border border-border bg-card/50 backdrop-blur-sm p-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          )
        })}
      </div>

      <div className="grid flex-1 grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card/50 backdrop-blur-sm p-6">
          <h3 className="mb-4 text-lg font-semibold">教室使用趋势</h3>
          <div className="flex h-64 items-end justify-around gap-2">
            {[65, 72, 58, 85, 92, 78, 88].map((height, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-primary to-primary/50"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-muted-foreground">周{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card/50 backdrop-blur-sm p-6">
          <h3 className="mb-4 text-lg font-semibold">学院使用排名</h3>
          <div className="space-y-3">
            {[
              { name: "计算机学院", value: 95 },
              { name: "信息工程学院", value: 88 },
              { name: "数学学院", value: 82 },
              { name: "物理学院", value: 76 },
              { name: "化学学院", value: 71 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="font-semibold">{item.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-accent">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card/50 backdrop-blur-sm p-6">
          <h3 className="mb-4 text-lg font-semibold">设备状态分布</h3>
          <div className="flex h-64 items-center justify-center">
            <div className="relative h-48 w-48">
              <svg className="h-full w-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="32"
                  className="text-accent"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="32"
                  strokeDasharray="502"
                  strokeDashoffset="100"
                  className="text-green-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">88%</div>
                <div className="text-sm text-muted-foreground">正常</div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-500">752</div>
              <div className="text-xs text-muted-foreground">正常</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">92</div>
              <div className="text-xs text-muted-foreground">离线</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">12</div>
              <div className="text-xs text-muted-foreground">故障</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card/50 backdrop-blur-sm p-6">
          <h3 className="mb-4 text-lg font-semibold">刷卡记录排名</h3>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">刷卡最多教师</h4>
              <div className="space-y-2">
                {["张老师", "李老师", "王老师"].map((name, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-accent/50 px-3 py-2">
                    <span className="text-sm">{name}</span>
                    <span className="text-sm font-semibold">{[245, 198, 176][i]} 次</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">使用最多教室</h4>
              <div className="space-y-2">
                {["101教室", "203教室", "305教室"].map((name, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-accent/50 px-3 py-2">
                    <span className="text-sm">{name}</span>
                    <span className="text-sm font-semibold">{[432, 389, 356][i]} 次</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
