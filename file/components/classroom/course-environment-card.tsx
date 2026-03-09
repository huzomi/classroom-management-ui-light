"use client"

import {
  Play,
  Clock,
  Users,
  Thermometer,
  Droplets,
  Wind,
  Sun,
} from "lucide-react"

interface CourseInfo {
  name: string
  teacher: string
  department: string
  time: string
  students: number
  capacity: number
  week: string
  status: "ongoing" | "upcoming" | "ended"
}

interface EnvironmentInfo {
  temperature: number
  humidity: number
  pm25: number
  co2: number
  illuminance: number
}

interface CourseEnvironmentCardProps {
  course?: CourseInfo
  environment: EnvironmentInfo
}

export function CourseEnvironmentCard({
  course,
  environment,
}: CourseEnvironmentCardProps) {
  return (
    <div className="flex items-center gap-6 rounded-xl border border-border bg-card px-4 py-3">
      {/* 当前课程信息 */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Play className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">当前课程</span>
            {course?.status === "ongoing" && (
              <span className="flex items-center gap-1 text-xs text-primary">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                进行中
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            {course?.name || "暂无课程"}
          </h3>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="h-10 w-px bg-border" />

      {/* 课程详情 */}
      {course && (
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] text-muted-foreground">教师</p>
            <p className="text-sm font-medium text-foreground">{course.teacher}</p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground">时间</p>
            </div>
            <p className="text-sm font-medium text-foreground">{course.time}</p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground">出勤</p>
            </div>
            <p className="text-sm font-medium text-foreground">
              {course.students}/{course.capacity}
            </p>
          </div>
        </div>
      )}

      {/* 分隔线 */}
      <div className="h-10 w-px bg-border" />

      {/* 环境信息 */}
      <div className="flex flex-1 items-center gap-4">
        <span className="text-xs font-medium text-muted-foreground">环境</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-secondary/50 px-2.5 py-1.5">
            <Thermometer className="h-4 w-4 text-chart-5" />
            <span className="text-sm font-semibold text-foreground">
              {environment.temperature}°C
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-secondary/50 px-2.5 py-1.5">
            <Droplets className="h-4 w-4 text-chart-2" />
            <span className="text-sm font-semibold text-foreground">
              {environment.humidity}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-secondary/50 px-2.5 py-1.5">
            <Wind className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              {environment.pm25}
            </span>
            <span className="text-[10px] text-muted-foreground">PM2.5</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-secondary/50 px-2.5 py-1.5">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              {environment.co2}
            </span>
            <span className="text-[10px] text-muted-foreground">ppm</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-secondary/50 px-2.5 py-1.5">
            <Sun className="h-4 w-4 text-chart-3" />
            <span className="text-sm font-semibold text-foreground">
              {environment.illuminance}
            </span>
            <span className="text-[10px] text-muted-foreground">lux</span>
          </div>
        </div>
      </div>
    </div>
  )
}
