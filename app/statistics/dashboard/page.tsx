"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Monitor, Building2, Lightbulb, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getBigScreenData, type BigScreenVO } from "@/lib/api/report"

type UseTimeTab = "highest" | "lowest"

export default function DashboardPage() {
  const [data, setData] = useState<BigScreenVO | null>(null)
  const [loading, setLoading] = useState(true)
  const [devicePage, setDevicePage] = useState(0)
  const [useTimeTab, setUseTimeTab] = useState<UseTimeTab>("highest")

  useEffect(() => {
    setLoading(true)
    getBigScreenData()
      .then(setData)
      .catch((err) => console.error("获取大屏数据失败", err))
      .finally(() => setLoading(false))
  }, [])

  // ── 教室总数 ──
  const totalRooms = data
    ? (data.classRoomCount.regularClassroomCount + data.classRoomCount.smartClassroomCount)
    : 0

  // ── 教室使用情况按校区分组 ──
  const groupedClassUse = useMemo(() => {
    if (!data?.classUse) return []
    const map = new Map<string, typeof data.classUse>()
    for (const item of data.classUse) {
      const group = map.get(item.campus) ?? []
      group.push(item)
      map.set(item.campus, group)
    }
    return Array.from(map.entries())
  }, [data])

  // ── 设备总数分页（每页6个） ──
  const deviceEntries = useMemo(() => {
    if (!data?.equipmentCount) return []
    return Object.entries(data.equipmentCount)
  }, [data])
  const deviceTotalPages = Math.ceil(deviceEntries.length / 6)
  const devicePageItems = deviceEntries.slice(devicePage * 6, (devicePage + 1) * 6)

  // ── 设备状态 ──
  const deviceStatusList = useMemo(() => {
    if (!data) return []
    const ec = data.equipmentCount ?? {}
    const es = data.equipmentStatus

    if (!es) {
      return Object.entries(ec).map(([name, count]) => ({ name, use: count, idle: 0 }))
    }

    if (es["使用"] || es["use"]) {
      const useData = es["使用"] ?? es["use"] ?? {}
      const idleData = es["空闲"] ?? es["idle"] ?? {}
      return Object.keys({ ...useData, ...idleData }).map((name) => ({
        name,
        use: useData[name] ?? 0,
        idle: idleData[name] ?? 0,
      }))
    }

    return Object.entries(es).map(([name, val]) => ({
      name,
      use: (val as Record<string, number>)["use"] ?? (val as Record<string, number>)["使用"] ?? 0,
      idle: (val as Record<string, number>)["idle"] ?? (val as Record<string, number>)["空闲"] ?? 0,
    }))
  }, [data])

  // ── 教室状态饼图数据 ──
  const roomStatusItems = data ? [
    { label: "上课教室", value: data.classRoomStatus.progressCount, color: "#3AFFBC" },
    { label: "空闲教室", value: data.classRoomStatus.idleCount, color: "#96FFFF" },
    { label: "故障教室", value: data.classRoomStatus.faultCount, color: "#2559FF" },
    { label: "下课教室", value: data.classRoomStatus.offlineCount, color: "#683AFF" },
  ] : []
  const roomStatusTotal = roomStatusItems.reduce((s, i) => s + i.value, 0)

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] flex-col bg-gradient-to-br from-background to-accent/20 p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
        <div className="grid flex-1 grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="rounded-lg" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col bg-gradient-to-br from-background to-accent/20 p-6 overflow-auto">
      {/* 头部 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">数据看板</h1>
        <div className="text-sm text-muted-foreground">实时更新于 {new Date().toLocaleString("zh-CN")}</div>
      </div>

      {/* ── 顶部总览 ── */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {[
          { label: "教室总数", value: totalRooms, icon: Monitor, color: "text-blue-500" },
          { label: "普通教室", value: data?.classRoomCount.regularClassroomCount ?? 0, icon: Building2, color: "text-green-500" },
          { label: "智慧教室", value: data?.classRoomCount.smartClassroomCount ?? 0, icon: Lightbulb, color: "text-orange-500" },
          { label: "会议教室", value: 0, icon: Users, color: "text-purple-500" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="rounded-lg border border-border bg-card/50 backdrop-blur-sm p-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <Icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          )
        })}
      </div>

      {/* ── 主内容区域 3 列 ── */}
      <div className="grid flex-1 grid-cols-3 gap-4 min-h-0">

        {/* ═══ 左列 ═══ */}
        <div className="flex flex-col gap-4 overflow-auto">
          {/* 教室使用情况 */}
          <Card className="flex-1">
            <CardContent className="p-4">
              <h3 className="mb-3 text-lg font-semibold">教室使用情况</h3>
              <div className="border border-border rounded overflow-hidden text-sm">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border">
                      <th className="p-2 text-left text-muted-foreground font-medium">校区/教学楼</th>
                      <th className="p-2 text-center text-muted-foreground font-medium">教室数</th>
                      <th className="p-2 text-center text-muted-foreground font-medium">已用</th>
                      <th className="p-2 text-center text-muted-foreground font-medium">空闲</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedClassUse.map(([campus, items]) => (
                      <>
                        <tr key={`campus-${campus}`} className="bg-primary/5">
                          <td colSpan={4} className="p-2 font-semibold text-primary">{campus}</td>
                        </tr>
                        {items.map((item) => (
                          <tr key={item.buildingId} className="border-b border-border hover:bg-muted/20">
                            <td className="p-2 pl-6">{item.building}</td>
                            <td className="p-2 text-center">{item.classroomCount}</td>
                            <td className="p-2 text-center text-amber-600">{item.usedCount}</td>
                            <td className="p-2 text-center text-green-600">{item.idleCount}</td>
                          </tr>
                        ))}
                      </>
                    ))}
                    {groupedClassUse.length === 0 && (
                      <tr><td colSpan={4} className="p-4 text-center text-muted-foreground">暂无数据</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 教室使用时间 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">教室使用时间</h3>
                <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
                  <button
                    onClick={() => setUseTimeTab("highest")}
                    className={cn("rounded px-2 py-0.5 text-xs transition-colors", useTimeTab === "highest" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
                  >
                    使用时间最高
                  </button>
                  <button
                    onClick={() => setUseTimeTab("lowest")}
                    className={cn("rounded px-2 py-0.5 text-xs transition-colors", useTimeTab === "lowest" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
                  >
                    使用时间最低
                  </button>
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">
                {useTimeTab === "highest" ? (data?.classUseTime.useTimeMax ?? "-") : (data?.classUseTime.useTimeMin ?? "-")}
                <span className="text-sm font-normal text-muted-foreground ml-1">小时</span>
              </div>
            </CardContent>
          </Card>

          {/* 最新工单记录 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-3 text-lg font-semibold">最新工单记录</h3>
              <div className="space-y-2">
                {(data?.latestWorkOrderRecord ?? []).length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-4">暂无工单</div>
                ) : (
                  data?.latestWorkOrderRecord.map((wo) => (
                    <div key={wo.workOrderId} className="flex items-start justify-between rounded-lg bg-muted/20 border border-border px-3 py-2">
                      <p className="text-sm flex-1 mr-2">{wo.description}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{wo.createTime}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ═══ 中列（教室状态） ═══ */}
        <div className="flex flex-col gap-4 overflow-auto">
          {/* 教室状态 */}
          <Card className="flex-1">
            <CardContent className="p-4">
              <h3 className="mb-4 text-lg font-semibold">教室状态</h3>
              <div className="flex items-center justify-center py-6">
                <div className="relative h-48 w-48">
                  <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                    {(() => {
                      let offset = 0
                      const circumference = 2 * Math.PI * 80
                      return roomStatusItems.map((item) => {
                        const ratio = roomStatusTotal > 0 ? item.value / roomStatusTotal : 0
                        const dash = ratio * circumference
                        const el = (
                          <circle
                            key={item.label}
                            cx="100" cy="100" r="80"
                            fill="none"
                            stroke={item.color}
                            strokeWidth="28"
                            strokeDasharray={`${dash} ${circumference - dash}`}
                            strokeDashoffset={-offset}
                          />
                        )
                        offset += dash
                        return el
                      })
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold">{roomStatusTotal}</div>
                    <div className="text-sm text-muted-foreground">总教室</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {roomStatusItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="ml-auto text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ═══ 右列 ═══ */}
        <div className="flex flex-col gap-4 overflow-auto">
          {/* 设备总数 */}
          <Card className="flex-1">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">设备总数</h3>
                {deviceTotalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" disabled={devicePage <= 0} onClick={() => setDevicePage((p) => p - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">{devicePage + 1}/{deviceTotalPages}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" disabled={devicePage >= deviceTotalPages - 1} onClick={() => setDevicePage((p) => p + 1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {devicePageItems.map(([name, count]) => (
                  <div key={name} className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                    <div className="text-2xl font-bold text-primary">{count}</div>
                    <div className="text-xs text-muted-foreground mt-1">{name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 设备状态 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">设备状态</h3>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />使用</span>
                  <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-green-500" />空闲</span>
                </div>
              </div>
              {deviceStatusList.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">暂无数据</div>
              ) : (
                <div className="space-y-3">
                  {deviceStatusList.map((d) => {
                    const total = d.use + d.idle
                    const usePercent = total > 0 ? (d.use / total) * 100 : 0
                    return (
                      <div key={d.name}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{d.name}</span>
                          <span className="text-xs text-muted-foreground">{d.use}/{total}</span>
                        </div>
                        <div className="h-3 rounded-full bg-green-500/30 overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${usePercent}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
