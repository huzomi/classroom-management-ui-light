"use client"

import { Building2, BookOpen, Clock, AlertTriangle, Wrench } from "lucide-react"
import { StatCard } from "./stat-card"

const spaceData = {
  total: 386,
  teaching: 124,
  idle: 198,
  exam: 12,
  fault: 4,
  occupancyRate: 36.3,
  occupancyTrend: 2.8,
}

export function SpaceOverview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          空间状态概览
        </h2>
        <span className="text-xs text-muted-foreground">Space Dynamics</span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="教室总数"
          value={spaceData.total}
          icon={<Building2 className="h-5 w-5" />}
          variant="default"
        />
        <StatCard
          title="正在授课"
          value={spaceData.teaching}
          icon={<BookOpen className="h-5 w-5" />}
          variant="success"
        />
        <StatCard
          title="空闲教室"
          value={spaceData.idle}
          icon={<Clock className="h-5 w-5" />}
          variant="default"
        />
        <StatCard
          title="考试模式"
          value={spaceData.exam}
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="warning"
        />
        <StatCard
          title="故障锁定"
          value={spaceData.fault}
          icon={<Wrench className="h-5 w-5" />}
          variant="destructive"
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">当前时段占用率</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-primary">
                {spaceData.occupancyRate}%
              </span>
              <span className="flex items-center text-xs text-primary">
                +{spaceData.occupancyTrend}% 较昨日
              </span>
            </div>
          </div>
          <div className="h-16 w-32">
            <div className="flex h-full items-end gap-1">
              {[35, 42, 38, 45, 52, 48, 36].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-primary/20"
                  style={{ height: `${h}%` }}
                >
                  <div
                    className="w-full rounded-t bg-primary transition-all"
                    style={{ height: `${(h / 52) * 100}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
