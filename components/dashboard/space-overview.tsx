"use client"

import { useEffect, useState } from "react"
import { Building2, BookOpen, Clock, AlertTriangle, Wrench } from "lucide-react"
import { StatCard } from "./stat-card"
import { getBigScreenData, type BigScreenVO } from "@/lib/api/report"
import { getCampusTree, type CampusBuildingFloorTreeVO } from "@/lib/api/campus"

function countRooms(tree: CampusBuildingFloorTreeVO[]): number {
  let count = 0
  for (const campus of tree) {
    for (const building of campus.buildings) {
      for (const floor of building.floors) {
        count += floor.rooms.length
      }
    }
  }
  return count
}

export function SpaceOverview() {
  const [data, setData] = useState<BigScreenVO | null>(null)
  const [totalRooms, setTotalRooms] = useState(0)

  useEffect(() => {
    getBigScreenData().then(setData).catch(() => {})
    getCampusTree().then((tree) => setTotalRooms(countRooms(tree))).catch(() => {})
  }, [])

  const teaching = data?.classRoomStatus.progressCount ?? 0
  const idle = data?.classRoomStatus.offlineCount ?? 0
  const offline = data?.classRoomStatus.idleCount ?? 0
  const fault = data?.classRoomStatus.faultCount ?? 0
  const occupancyRate = totalRooms > 0 ? Math.round((teaching / totalRooms) * 1000) / 10 : 0

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
          value={totalRooms}
          icon={<Building2 className="h-5 w-5" />}
          variant="default"
        />
        <StatCard
          title="正在授课"
          value={teaching}
          icon={<BookOpen className="h-5 w-5" />}
          variant="success"
        />
        <StatCard
          title="空闲教室"
          value={idle}
          icon={<Clock className="h-5 w-5" />}
          variant="default"
        />
        <StatCard
          title="离线教室"
          value={offline}
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="warning"
        />
        <StatCard
          title="故障锁定"
          value={fault}
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
                {occupancyRate}%
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
