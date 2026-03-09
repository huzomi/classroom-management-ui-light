"use client"

import { use, useState } from "react"
import Link from "next/link"
import { SidebarNav } from "@/components/sidebar-nav"
import { DeviceControlPanel } from "@/components/classroom/device-control-panel"
import { CameraPreview } from "@/components/classroom/camera-preview"
import { ScheduleEnergyPanel } from "@/components/classroom/schedule-energy-panel"
import { CourseEnvironmentCard } from "@/components/classroom/course-environment-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Bell,
  User,
  MapPin,
  Users,
} from "lucide-react"

// 教室状态类型
type RoomStatus = "teaching" | "idle" | "self-study" | "exam" | "fault" | "abnormal"
type FaultType = "mini-program" | "qr-code" | "ip-phone" | "inspection" | "disabled"
type AbnormalType = "class-no-power" | "no-class-power-on"

const statusConfig: Record<RoomStatus, { label: string; color: string }> = {
  teaching: { label: "上课", color: "text-primary bg-primary/10" },
  idle: { label: "空闲", color: "text-muted-foreground bg-muted/30" },
  "self-study": { label: "自习", color: "text-chart-2 bg-chart-2/10" },
  exam: { label: "考试", color: "text-chart-3 bg-chart-3/10" },
  fault: { label: "故障", color: "text-destructive bg-destructive/10" },
  abnormal: { label: "异常", color: "text-chart-4 bg-chart-4/10" },
}

const faultTypeConfig: Record<FaultType, string> = {
  "mini-program": "小程序报修",
  "qr-code": "扫码报修",
  "ip-phone": "IP电话报修",
  "inspection": "巡检报修",
  "disabled": "停用",
}

const abnormalTypeConfig: Record<AbnormalType, string> = {
  "class-no-power": "有课未开机",
  "no-class-power-on": "无课已开机",
}

// Mock 教室数据库
const mockRoomsData: Record<string, {
  status: RoomStatus
  faultType?: FaultType
  abnormalType?: AbnormalType
  building: string
  floor: string
  capacity: number
  currentCourse?: {
    name: string
    teacher: string
    time: string
    students: number
    capacity: number
    status: "ongoing" | "upcoming" | "finished"
  }
}> = {
  a101: {
    status: "teaching",
    building: "教学楼A",
    floor: "1楼",
    capacity: 120,
    currentCourse: {
      name: "数据结构与算法",
      teacher: "张教授",
      time: "08:00-09:40",
      students: 98,
      capacity: 120,
      status: "ongoing",
    },
  },
  a102: {
    status: "idle",
    building: "教学楼A",
    floor: "1楼",
    capacity: 80,
  },
  a103: {
    status: "fault",
    faultType: "mini-program",
    building: "教学楼A",
    floor: "1楼",
    capacity: 100,
  },
  a201: {
    status: "self-study",
    building: "教学楼A",
    floor: "2楼",
    capacity: 60,
  },
  a202: {
    status: "exam",
    building: "教学楼A",
    floor: "2楼",
    capacity: 120,
    currentCourse: {
      name: "期中考试 - 高等数学",
      teacher: "王教授",
      time: "09:00-11:00",
      students: 115,
      capacity: 120,
      status: "ongoing",
    },
  },
  b101: {
    status: "teaching",
    building: "教学楼B",
    floor: "1楼",
    capacity: 100,
    currentCourse: {
      name: "操作系统原理",
      teacher: "李教授",
      time: "10:00-11:40",
      students: 85,
      capacity: 100,
      status: "ongoing",
    },
  },
  b102: {
    status: "fault",
    faultType: "ip-phone",
    building: "教学楼B",
    floor: "1楼",
    capacity: 80,
  },
  a301: {
    status: "abnormal",
    abnormalType: "class-no-power",
    building: "教学楼A",
    floor: "3楼",
    capacity: 100,
    currentCourse: {
      name: "高等数学",
      teacher: "陈教授",
      time: "08:00-09:40",
      students: 0,
      capacity: 100,
      status: "ongoing",
    },
  },
  a302: {
    status: "abnormal",
    abnormalType: "no-class-power-on",
    building: "教学楼A",
    floor: "3楼",
    capacity: 80,
  },
}

// Mock data
const getRoomData = (id: string) => {
  const roomInfo = mockRoomsData[id.toLowerCase()] || {
    status: "idle" as RoomStatus,
    building: "教学楼A",
    floor: "1楼",
    capacity: 100,
  }

  return {
    id,
    name: id.toUpperCase(),
    building: roomInfo.building,
    floor: roomInfo.floor,
    capacity: roomInfo.capacity,
    status: roomInfo.status,
    faultType: roomInfo.faultType,
    abnormalType: roomInfo.abnormalType,
    currentCourse: roomInfo.currentCourse || {
      name: "数据结构与算法",
      teacher: "张教授",
      time: "08:00-09:40",
      students: 98,
      capacity: 120,
      status: "ongoing" as const,
    },
    environment: {
      temperature: 24.2,
      humidity: 55,
      pm25: 18,
      co2: 520,
      illuminance: 450,
    },
    todayCourses: [
      { time: "08:00-09:40", name: "数据结构与算法", teacher: "张教授", status: "ongoing" as const },
      { time: "10:00-11:40", name: "操作系统原理", teacher: "李教授", status: "upcoming" as const },
      { time: "14:00-15:40", name: "计算机网络", teacher: "王教授", status: "upcoming" as const },
      { time: "16:00-17:40", name: "软件工程", teacher: "刘教授", status: "upcoming" as const },
    ],
  }
}

export default function ClassroomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const room = getRoomData(id)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="h-screen overflow-hidden bg-background">
      <SidebarNav
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={cn(
        "flex h-full flex-col transition-all duration-300",
        sidebarCollapsed ? "pl-0" : "pl-60"
      )}>
        {/* 顶部导航栏 */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4">
          <div className="flex items-center gap-3">
            <Link href="/classroom">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-foreground">
                  {room.name} 驾驶舱
                </h1>
                {/* 教室状态标签 */}
                <span className={cn(
                  "rounded px-2 py-0.5 text-xs font-medium",
                  statusConfig[room.status].color
                )}>
                  {statusConfig[room.status].label}
                </span>
                {/* 故障/异常详细信息 */}
                {room.status === "fault" && room.faultType && (
                  <span className="text-xs text-destructive">
                    ({faultTypeConfig[room.faultType]})
                  </span>
                )}
                {room.status === "abnormal" && room.abnormalType && (
                  <span className="text-xs text-chart-4">
                    ({abnormalTypeConfig[room.abnormalType]})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <MapPin className="h-2.5 w-2.5" />
                <span>{room.building} {room.floor}</span>
                <span className="text-border">|</span>
                <Users className="h-2.5 w-2.5" />
                <span>{room.capacity}人</span>
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

        {/* 主内容区 - 无滚动条 */}
        <main className="flex flex-1 flex-col gap-3 p-3">
          {/* 顶部：课程信息 + 环境信息 */}
          <div className="shrink-0">
            <CourseEnvironmentCard
              course={room.currentCourse}
              environment={room.environment}
            />
          </div>

          {/* 中间区域：预览 + 控制面板 */}
          <div className="flex flex-1 gap-3">
            {/* 左侧：摄像头预览 + 课表能耗（2/3宽度） */}
            <div className="flex w-2/3 flex-col gap-3">
              {/* 摄像头预览 - 填充主要空间 */}
              <div className="flex-1">
                <CameraPreview />
              </div>
              {/* 课表与能耗 - 固定高度为页面1/4 */}
              <div className="h-[25vh] shrink-0">
                <ScheduleEnergyPanel courses={room.todayCourses} />
              </div>
            </div>

            {/* 右侧：设备控制（1/3宽度） */}
            <div className="w-1/3">
              <DeviceControlPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
