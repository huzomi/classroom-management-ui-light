"use client"

import { PlatformHeader } from "@/components/layout/platform-header"
import { Card } from "@/components/ui/card"
import { BarChart3, TrendingUp, TrendingDown, Award } from "lucide-react"

export default function ReportsPage() {
  const stats = [
    { title: "刷卡最多教室", value: "101教室", count: "328次", trend: "up" },
    { title: "刷卡最少教室", value: "305教室", count: "12次", trend: "down" },
    { title: "刷卡最多个人", value: "张老师", count: "156次", trend: "up" },
    { title: "使用最多教室", value: "201教室", count: "280小时", trend: "up" },
  ]

  return (
    <div className="flex h-screen flex-col bg-background">
      <PlatformHeader />

      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">报表统计</h1>
            <p className="mt-1 text-sm text-muted-foreground">教室使用和刷卡数据分析</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-6 w-6 text-blue-400" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-orange-400" />
                    )}
                  </div>
                  <Award className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground">{stat.title}</div>
                  <div className="mt-1 text-2xl font-semibold text-foreground">{stat.value}</div>
                  <div className="mt-1 text-sm text-blue-400">{stat.count}</div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-foreground">学院刷卡排名</h2>
            </div>
            <div className="mt-6 space-y-4">
              {[
                { name: "计算机学院", count: 1245, percent: 85 },
                { name: "数学学院", count: 1089, percent: 75 },
                { name: "外语学院", count: 892, percent: 61 },
                { name: "物理学院", count: 756, percent: 52 },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground">{item.count}次</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
