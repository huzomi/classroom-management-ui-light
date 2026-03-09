"use client"

import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import {
  Monitor,
  Projector,
  Lightbulb,
  Wind,
  DoorOpen,
  LayoutDashboard,
  Wifi,
  WifiOff,
  Calendar,
  Thermometer,
  Droplets,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// 教室状态
export type RoomStatus = "teaching" | "idle" | "self-study" | "exam" | "fault" | "abnormal"

// 故障详细信息
export type FaultType = "mini-program" | "qr-code" | "ip-phone" | "inspection" | "disabled"

// 异常详细信息
export type AbnormalType = "class-no-power" | "no-class-power-on"

export interface RoomData {
  id: string
  name: string
  building: string
  floor: string
  status: RoomStatus
  faultType?: FaultType
  abnormalType?: AbnormalType
  currentCourse?: {
    name: string
    teacher: string
    time: string
  }
  schedule?: {
    time: string
    course: string
  }[]
  devices: {
    pc: "online" | "offline"
    projector: "online" | "offline"
    light: "on" | "off"
    ac: "on" | "off"
    door: "locked" | "unlocked"
  }
  iotInfo: {
    controller: "online" | "offline"  // 中控在线状态
  }
  environment: {
    temp: number
    humidity: number
    co2: number
  }
  power: number
}

interface RoomCardProps {
  room: RoomData
  viewMode: "list" | "card"
  selected?: boolean
  onSelect?: () => void
}

const statusConfig: Record<RoomStatus, { label: string; borderColor: string; bgColor: string }> = {
  teaching: {
    label: "上课",
    borderColor: "border-l-primary",
    bgColor: "bg-primary/5",
  },
  idle: {
    label: "空闲",
    borderColor: "border-l-muted-foreground",
    bgColor: "bg-muted/30",
  },
  "self-study": {
    label: "自习",
    borderColor: "border-l-chart-2",
    bgColor: "bg-chart-2/5",
  },
  exam: {
    label: "考试",
    borderColor: "border-l-chart-3",
    bgColor: "bg-chart-3/5",
  },
  fault: {
    label: "故障",
    borderColor: "border-l-destructive",
    bgColor: "bg-destructive/5",
  },
  abnormal: {
    label: "异常",
    borderColor: "border-l-chart-4",
    bgColor: "bg-chart-4/5",
  },
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

export function RoomCard({
  room,
  viewMode,
  selected,
  onSelect,
}: RoomCardProps) {
  const router = useRouter()
  const status = statusConfig[room.status]

  const handleEnterCockpit = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/classroom-management/${room.id}`)
  }

  // 列表视图
  if (viewMode === "list") {
    return (
      <div
        onClick={onSelect}
        className={cn(
          "flex cursor-pointer items-center gap-4 rounded-lg border border-l-4 bg-card p-4 transition-colors hover:bg-secondary/50",
          status.borderColor
        )}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-primary"
          onClick={(e) => e.stopPropagation()}
        />

        {/* 教室名称 */}
        <div className="w-20 shrink-0">
          <span className="font-semibold text-foreground">{room.name}</span>
        </div>

        {/* 教室状态 */}
        <div className="w-16 shrink-0">
          <span className={cn(
            "inline-block rounded px-2 py-0.5 text-xs font-medium",
            status.bgColor,
            room.status === "teaching" && "text-primary",
            room.status === "idle" && "text-muted-foreground",
            room.status === "self-study" && "text-chart-2",
            room.status === "exam" && "text-chart-3",
            room.status === "fault" && "text-destructive",
            room.status === "abnormal" && "text-chart-4",
          )}>
            {status.label}
          </span>
        </div>

        {/* 故障/异常详细信息 */}
        <div className="w-24 shrink-0">
          {room.status === "fault" && room.faultType ? (
            <span className="text-xs text-destructive">
              {faultTypeConfig[room.faultType]}
            </span>
          ) : room.status === "abnormal" && room.abnormalType ? (
            <span className="text-xs text-chart-4">
              {abnormalTypeConfig[room.abnormalType]}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>

        {/* 中控状态 + 温湿度 */}
        <div className="flex w-48 shrink-0 items-center gap-3">
          <div className="flex items-center gap-1">
            {room.iotInfo.controller === "online" ? (
              <Wifi className="h-4 w-4 text-primary" />
            ) : (
              <WifiOff className="h-4 w-4 text-destructive" />
            )}
            <span className="text-xs text-muted-foreground">
              中控{room.iotInfo.controller === "online" ? "在线" : "离线"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Thermometer className="h-3.5 w-3.5 text-chart-5" />
            <span className="text-xs text-muted-foreground">{room.environment.temp}°C</span>
          </div>
          <div className="flex items-center gap-1">
            <Droplets className="h-3.5 w-3.5 text-chart-2" />
            <span className="text-xs text-muted-foreground">{room.environment.humidity}%</span>
          </div>
        </div>

        {/* 课表 */}
        <div className="flex-1 min-w-0">
          {room.currentCourse ? (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate text-sm text-foreground">
                {room.currentCourse.name}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {room.currentCourse.time}
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">暂无课程</span>
          )}
        </div>

        {/* 进入驾驶舱按钮 */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleEnterCockpit}
          className="shrink-0 gap-1.5"
        >
          <LayoutDashboard className="h-4 w-4" />
          驾驶舱
        </Button>
      </div>
    )
  }

  // 卡片视图
  return (
    <div
      onClick={onSelect}
      className={cn(
        "flex h-[280px] cursor-pointer flex-col rounded-xl border border-l-4 bg-card p-4 transition-all hover:shadow-lg",
        status.borderColor
      )}
    >
      {/* 头部：选择框、教室名称、状态 - 固定高度 */}
      <div className="flex h-7 shrink-0 items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-primary"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="text-lg font-semibold text-foreground">{room.name}</span>
        </div>
        <span className={cn(
          "rounded px-2 py-0.5 text-xs font-medium",
          status.bgColor,
          room.status === "teaching" && "text-primary",
          room.status === "idle" && "text-muted-foreground",
          room.status === "self-study" && "text-chart-2",
          room.status === "exam" && "text-chart-3",
          room.status === "fault" && "text-destructive",
          room.status === "abnormal" && "text-chart-4",
        )}>
          {status.label}
        </span>
      </div>

      {/* 故障/异常详细信息 - 固定高度，无故障异常时空白占位 */}
      <div className="mt-2 h-8 shrink-0">
        {room.status === "fault" && room.faultType ? (
          <div className="flex h-full items-center rounded-lg bg-destructive/10 px-3 text-sm text-destructive">
            {faultTypeConfig[room.faultType]}
          </div>
        ) : room.status === "abnormal" && room.abnormalType ? (
          <div className="flex h-full items-center rounded-lg bg-chart-4/10 px-3 text-sm text-chart-4">
            {abnormalTypeConfig[room.abnormalType]}
          </div>
        ) : (
          <div className="h-full" />
        )}
      </div>

      {/* 中控状态 + 温湿度 - 固定高度 */}
      <div className="mt-2 flex h-5 shrink-0 items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          {room.iotInfo.controller === "online" ? (
            <Wifi className="h-4 w-4 text-primary" />
          ) : (
            <WifiOff className="h-4 w-4 text-destructive" />
          )}
          <span className="text-muted-foreground">
            中控{room.iotInfo.controller === "online" ? "在线" : "离线"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Thermometer className="h-3.5 w-3.5 text-chart-5" />
          <span className="text-muted-foreground">{room.environment.temp}°C</span>
        </div>
        <div className="flex items-center gap-1">
          <Droplets className="h-3.5 w-3.5 text-chart-2" />
          <span className="text-muted-foreground">{room.environment.humidity}%</span>
        </div>
      </div>

      {/* 设备状态指示器 - 固定高度 */}
      <div className="mt-2 flex h-5 shrink-0 items-center gap-2">
        <div className="flex items-center gap-1" title="PC">
          <Monitor className={cn("h-4 w-4", room.devices.pc === "online" ? "text-primary" : "text-destructive")} />
        </div>
        <div className="flex items-center gap-1" title="投影">
          <Projector className={cn("h-4 w-4", room.devices.projector === "online" ? "text-primary" : "text-destructive")} />
        </div>
        <div className="flex items-center gap-1" title="照明">
          <Lightbulb className={cn("h-4 w-4", room.devices.light === "on" ? "text-chart-3" : "text-muted-foreground")} />
        </div>
        <div className="flex items-center gap-1" title="空调">
          <Wind className={cn("h-4 w-4", room.devices.ac === "on" ? "text-chart-2" : "text-muted-foreground")} />
        </div>
        <div className="flex items-center gap-1" title="门禁">
          <DoorOpen className={cn("h-4 w-4", room.devices.door === "locked" ? "text-destructive" : "text-primary")} />
        </div>
      </div>

      {/* 课表信息 - 弹性填充 */}
      <div className="mt-2 flex flex-1 flex-col justify-center rounded-lg bg-secondary/50 p-3">
        {room.currentCourse ? (
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{room.currentCourse.name}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {room.currentCourse.teacher} | {room.currentCourse.time}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">暂无课程安排</span>
          </div>
        )}
      </div>

      {/* 进入驾驶舱按钮 - 固定高度 */}
      <Button
        size="sm"
        onClick={handleEnterCockpit}
        className="mt-3 w-full shrink-0 gap-1.5"
      >
        <LayoutDashboard className="h-4 w-4" />
        进入驾驶舱
      </Button>
    </div>
  )
}
