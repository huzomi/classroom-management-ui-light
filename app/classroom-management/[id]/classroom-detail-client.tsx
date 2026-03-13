"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DeviceControlPanel } from "@/components/classroom/device-control-panel"
import { CameraPreview } from "@/components/classroom/camera-preview"
import { ScheduleEnergyPanel } from "@/components/classroom/schedule-energy-panel"
import { CourseEnvironmentCard } from "@/components/classroom/course-environment-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Bell,
  User,
  MapPin,
  Users,
  SlidersHorizontal,
  Calendar,
} from "lucide-react"

import { searchRooms, type RoomSearchVO } from "@/lib/api/room"
import { getEquipmentStatusByRoom, type EquipmentStatusVO } from "@/lib/api/equipment"
import { getTimetableList, getCurrentWeekInfo, type TimetableDO } from "@/lib/api/timetable"

type UsageStatus = "teaching" | "idle" | "self-study" | "exam" | "offline"

const statusMap: Record<number, UsageStatus> = {
  1: "teaching",
  2: "idle",
  3: "offline",
  4: "self-study",
  5: "exam",
}

const usageStatusConfig: Record<UsageStatus, { label: string; color: string }> = {
  teaching: { label: "上课", color: "text-primary bg-primary/10" },
  idle: { label: "空闲", color: "text-muted-foreground bg-muted/30" },
  offline: { label: "离线", color: "text-muted-foreground bg-muted/50" },
  "self-study": { label: "自习", color: "text-chart-2 bg-chart-2/10" },
  exam: { label: "考试", color: "text-chart-3 bg-chart-3/10" },
}

function parseEnvValue(val: string | undefined, fallback: number): number {
  if (!val) return fallback
  const n = parseFloat(val)
  return isNaN(n) ? fallback : n
}

function formatTime(t: string | null | undefined): string {
  if (!t) return ""
  return t.length >= 5 ? t.slice(0, 5) : t
}

function timeToMinutes(t: string): number {
  const parts = t.split(":")
  return parseInt(parts[0] ?? "0") * 60 + parseInt(parts[1] ?? "0")
}

function determineCourseStatus(timetable: TimetableDO): "ongoing" | "upcoming" | "completed" {
  const now = new Date()
  const hhmm = now.getHours() * 60 + now.getMinutes()

  const start = timetable.lessonStartTime
  const end = timetable.lessonEndTime
  if (!start || !end) return "upcoming"

  const startMin = timeToMinutes(start)
  const endMin = timeToMinutes(end)

  if (hhmm >= endMin) return "completed"
  if (hhmm >= startMin) return "ongoing"
  return "upcoming"
}

function timetableTimeStr(t: TimetableDO): string {
  const start = t.lessonStartTime
  const end = t.lessonEndTime
  if (start && end) {
    return `${start.slice(0, 5)}-${end.slice(0, 5)}`
  }
  return ""
}

export function ClassroomDetailClient({ id }: { id: string }) {
  const [loading, setLoading] = useState(true)
  const [roomVO, setRoomVO] = useState<RoomSearchVO | null>(null)
  const [equipStatus, setEquipStatus] = useState<EquipmentStatusVO[]>([])
  const [todayCourses, setTodayCourses] = useState<TimetableDO[]>([])

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      try {
        const [roomRes] = await Promise.all([
          searchRooms({ page: 1, pageSize: 500 }),
        ])

        const matched = roomRes.records.find((r) => r.roomId === id)
        if (matched) setRoomVO(matched)

        const [equipRes] = await Promise.allSettled([
          getEquipmentStatusByRoom(id),
        ])
        if (equipRes.status === "fulfilled") setEquipStatus(equipRes.value ?? [])

        try {
          const weekInfo = await getCurrentWeekInfo()
          const weekday = weekInfo?.weekday ?? new Date().getDay()
          const timetables = await getTimetableList({
            roomId: id,
            weekday: weekday === 0 ? 7 : weekday,
            semesterId: weekInfo?.semesterId,
            week: weekInfo?.week != null ? String(weekInfo.week) : undefined,
          })
          setTodayCourses(timetables ?? [])
        } catch {
          setTodayCourses([])
        }
      } catch (err) {
        console.error("获取驾驶舱数据失败", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [id])

  const usageStatus = roomVO ? (statusMap[roomVO.status] ?? "idle") : "idle"
  const statusCfg = usageStatusConfig[usageStatus]

  const isFault = roomVO?.isFault === 1
  const isAbnormal = roomVO?.isFault === 3

  const env = roomVO?.environmentalInfo ?? {}
  const environment = {
    temperature: parseEnvValue(env["温度"] ?? env["temperature"], 0),
    humidity: parseEnvValue(env["湿度"] ?? env["humidity"], 0),
    pm25: parseEnvValue(env["PM2.5"] ?? env["pm25"], 0),
    co2: parseEnvValue(env["CO2"] ?? env["co2"], 0),
    illuminance: parseEnvValue(env["光照"] ?? env["illuminance"] ?? env["lux"], 0),
  }

  const currentCourseTime =
    roomVO?.lessonStartTime && roomVO?.lessonEndTime
      ? `${formatTime(roomVO.lessonStartTime)}-${formatTime(roomVO.lessonEndTime)}`
      : ""

  const currentCourse = roomVO?.courseName
    ? {
        name: roomVO.courseName,
        teacher: roomVO.teacherName ?? "",
        time: currentCourseTime,
        students: 0,
        capacity: 0,
        status: "ongoing" as const,
      }
    : undefined

  const courseListForPanel = todayCourses
    .filter((t) => t.isDelete !== 1)
    .sort((a, b) => {
      const aMin = a.lessonStartTime ? timeToMinutes(a.lessonStartTime) : 0
      const bMin = b.lessonStartTime ? timeToMinutes(b.lessonStartTime) : 0
      return aMin - bMin
    })
    .map((t) => ({
      time: timetableTimeStr(t),
      name: t.courseName || "未命名课程",
      teacher: t.teacherName || "",
      status: determineCourseStatus(t) as "completed" | "ongoing" | "upcoming",
    }))

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <header className="flex h-12 shrink-0 items-center border-b border-border bg-card px-4">
          <Skeleton className="h-6 w-48" />
        </header>
        <main className="flex flex-1 flex-col gap-3 p-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <div className="grid flex-1 grid-cols-[2fr_1fr] gap-3">
            <Skeleton className="rounded-xl" />
            <Skeleton className="rounded-xl" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* 顶部导航栏 */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <Link href="/classroom-management">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-foreground">
                {roomVO?.classRoom ?? id} 驾驶舱
              </h1>
              <span className={cn("rounded px-2 py-0.5 text-xs font-medium", statusCfg.color)}>
                {statusCfg.label}
              </span>
              {isFault && (
                <span className="rounded px-2 py-0.5 text-xs font-medium bg-destructive/10 text-destructive">
                  故障
                </span>
              )}
              {isAbnormal && (
                <span className="rounded px-2 py-0.5 text-xs font-medium bg-chart-4/10 text-chart-4">
                  异常
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <MapPin className="h-2.5 w-2.5" />
              <span>{roomVO?.classRoom ?? id}</span>
              {equipStatus.length > 0 && (
                <>
                  <span className="text-border">|</span>
                  <span>{equipStatus.length} 台设备</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Bell className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <User className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex flex-1 flex-col gap-3 overflow-auto p-3">
        <div className="shrink-0">
          <CourseEnvironmentCard
            course={currentCourse}
            environment={environment}
          />
        </div>

        <div className="grid flex-1 min-h-0 grid-cols-[2fr_1fr] gap-3">
          <div className="flex min-w-0 min-h-0 h-full flex-col overflow-hidden">
            <CameraPreview />
          </div>

          <div className="flex min-w-0 flex-col min-h-0 rounded-xl border border-border bg-card overflow-hidden">
            <Tabs defaultValue="control" className="flex flex-1 flex-col min-h-0">
              <TabsList className="shrink-0 mx-2 mt-2 w-auto">
                <TabsTrigger value="control" className="gap-1.5">
                  <SlidersHorizontal className="h-4 w-4" />
                  设备控制
                </TabsTrigger>
                <TabsTrigger value="schedule" className="gap-1.5">
                  <Calendar className="h-4 w-4" />
                  课程与能耗
                </TabsTrigger>
              </TabsList>
              <TabsContent value="control" className="flex-1 flex flex-col min-h-0 m-0 overflow-hidden data-[state=inactive]:hidden">
                <DeviceControlPanel equipmentStatus={equipStatus} isInClass={usageStatus === "teaching"} roomId={id} />
              </TabsContent>
              <TabsContent value="schedule" className="flex-1 flex flex-col min-h-0 m-0 overflow-hidden data-[state=inactive]:hidden">
                <div className="flex-1 min-h-0 p-3 overflow-auto flex flex-col">
                  <ScheduleEnergyPanel courses={courseListForPanel} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
