"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Volume2, Check } from "lucide-react"
import {
  User,
  BookOpen,
  Thermometer,
  Droplets,
  Wind,
  Leaf,
  MoreVertical,
  Video,
  Lightbulb,
  AirVentIcon as AirConditioner,
  Monitor,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ClassroomCardProps {
  classroom: any
  viewMode: "large" | "small" | "iot"
  onClick: () => void
  isMultiSelectMode?: boolean
  isSelected?: boolean
  onToggleSelect?: () => void
}

export function ClassroomCard({
  classroom,
  viewMode,
  onClick,
  isMultiSelectMode = false,
  isSelected = false,
  onToggleSelect,
}: ClassroomCardProps) {
  const statusConfig = {
    "in-class": { label: "上课中", color: "oklch(0.65 0.19 230)", bgColor: "bg-info/10", borderColor: "border-info" },
    idle: { label: "空闲", color: "oklch(0.65 0.18 145)", bgColor: "bg-success/10", borderColor: "border-success" },
    fault: {
      label: "故障",
      color: "oklch(0.55 0.22 25)",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive",
    },
    offline: { label: "离线", color: "oklch(0.4 0 0)", bgColor: "bg-muted/10", borderColor: "border-muted" },
  }

  const status = statusConfig[classroom.status as keyof typeof statusConfig]

  const handleCardClick = () => {
    if (isMultiSelectMode && onToggleSelect) {
      onToggleSelect()
    } else {
      onClick()
    }
  }

  if (viewMode === "small") {
    return (
      <Card
        className={`p-4 cursor-pointer hover:shadow-xl hover:shadow-primary/5 transition-all duration-200 border-l-2 ${status.borderColor} ${status.bgColor} backdrop-blur ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
        onClick={handleCardClick}
      >
        {isMultiSelectMode && (
          <div className="absolute top-2 right-2">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? "bg-primary border-primary" : "border-border bg-background"}`}
            >
              {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
            </div>
          </div>
        )}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base">{classroom.name}</h3>
            <Badge className="text-xs px-2 py-0.5 border-0" style={{ backgroundColor: status.color, color: "white" }}>
              {status.label}
            </Badge>
          </div>

          {classroom.teacher && (
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{classroom.teacher}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <BookOpen className="h-3 w-3" />
                <span className="truncate">{classroom.course}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <Thermometer className="h-3 w-3 text-orange-400" />
              <span>{classroom.temperature}°C</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="h-3 w-3 text-blue-400" />
              <span>{classroom.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="h-3 w-3 text-gray-400" />
              <span>{classroom.pm25}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Leaf className="h-3 w-3 text-green-400" />
              <span>{classroom.co2}</span>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (viewMode === "iot") {
    return (
      <Card
        className={`p-5 border-l-2 ${status.borderColor} ${status.bgColor} backdrop-blur hover:shadow-xl hover:shadow-primary/5 transition-all duration-200 ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
      >
        {isMultiSelectMode && (
          <div
            className="absolute top-3 right-3"
            onClick={(e) => {
              e.stopPropagation()
              onToggleSelect?.()
            }}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${isSelected ? "bg-primary border-primary" : "border-border bg-background hover:border-primary"}`}
            >
              {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
            </div>
          </div>
        )}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <h3 className="font-semibold text-lg">{classroom.name}</h3>
              <Badge className="text-xs px-2 py-0.5 border-0" style={{ backgroundColor: status.color, color: "white" }}>
                {status.label}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-secondary">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onClick}>查看详情</DropdownMenuItem>
                <DropdownMenuItem>设备维护</DropdownMenuItem>
                <DropdownMenuItem>查看监控</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* IoT Controls */}
          <div className="grid grid-cols-4 gap-2">
            <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-secondary/50 transition-colors border border-border/50">
              <div className={`p-2 rounded-md ${classroom.deviceStatus.projector ? "bg-info/20" : "bg-secondary"}`}>
                <Video
                  className={`h-5 w-5 ${classroom.deviceStatus.projector ? "text-info" : "text-muted-foreground"}`}
                />
              </div>
              <span className="text-xs text-foreground">投影</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-secondary/50 transition-colors border border-border/50">
              <div className={`p-2 rounded-md ${classroom.deviceStatus.lights ? "bg-warning/20" : "bg-secondary"}`}>
                <Lightbulb
                  className={`h-5 w-5 ${classroom.deviceStatus.lights ? "text-warning" : "text-muted-foreground"}`}
                />
              </div>
              <span className="text-xs text-foreground">灯光</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-secondary/50 transition-colors border border-border/50">
              <div className={`p-2 rounded-md ${classroom.deviceStatus.ac ? "bg-cyan-500/20" : "bg-secondary"}`}>
                <AirConditioner
                  className={`h-5 w-5 ${classroom.deviceStatus.ac ? "text-cyan-400" : "text-muted-foreground"}`}
                />
              </div>
              <span className="text-xs text-foreground">空调</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-secondary/50 transition-colors border border-border/50">
              <div className={`p-2 rounded-md ${classroom.deviceStatus.computer ? "bg-success/20" : "bg-secondary"}`}>
                <Monitor
                  className={`h-5 w-5 ${classroom.deviceStatus.computer ? "text-success" : "text-muted-foreground"}`}
                />
              </div>
              <span className="text-xs text-foreground">电脑</span>
            </button>
          </div>

          {/* Volume Control */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Volume2 className="h-3.5 w-3.5" />
                音量
              </span>
              <span className="font-medium text-foreground">75%</span>
            </div>
            <Slider defaultValue={[75]} max={100} step={1} className="cursor-pointer" />
          </div>
        </div>
      </Card>
    )
  }

  // Large view (default)
  return (
    <Card
      className={`p-5 cursor-pointer hover:shadow-xl hover:shadow-primary/5 transition-all duration-200 border-l-2 ${status.borderColor} ${status.bgColor} backdrop-blur group relative overflow-hidden ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
      onClick={handleCardClick}
    >
      {isMultiSelectMode && (
        <div
          className="absolute top-3 right-3 z-10"
          onClick={(e) => {
            e.stopPropagation()
            onToggleSelect?.()
          }}
        >
          <div
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? "bg-primary border-primary" : "border-border bg-background hover:border-primary"}`}
          >
            {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
          </div>
        </div>
      )}
      <div className="space-y-3.5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{classroom.name}</h3>
            <Badge className="text-xs px-2 py-0.5 border-0" style={{ backgroundColor: status.color, color: "white" }}>
              {status.label}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>查看详情</DropdownMenuItem>
              <DropdownMenuItem>设备维护</DropdownMenuItem>
              <DropdownMenuItem>查看监控</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Course Info */}
        {classroom.teacher && (
          <div className="space-y-2 py-2.5 border-y border-border/50">
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 rounded bg-secondary/50">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-foreground font-medium">{classroom.teacher}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 rounded bg-secondary/50">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-foreground">{classroom.course}</span>
            </div>
          </div>
        )}

        {/* Environmental Data */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 border border-border/50">
            <div className="p-1.5 rounded-md bg-orange-500/20">
              <Thermometer className="h-3.5 w-3.5 text-orange-400" />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-foreground">{classroom.temperature}°C</div>
              <div className="text-muted-foreground">温度</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 border border-border/50">
            <div className="p-1.5 rounded-md bg-blue-500/20">
              <Droplets className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-foreground">{classroom.humidity}%</div>
              <div className="text-muted-foreground">湿度</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 border border-border/50">
            <div className="p-1.5 rounded-md bg-gray-500/20">
              <Wind className="h-3.5 w-3.5 text-gray-400" />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-foreground">{classroom.pm25}</div>
              <div className="text-muted-foreground">PM2.5</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 border border-border/50">
            <div className="p-1.5 rounded-md bg-green-500/20">
              <Leaf className="h-3.5 w-3.5 text-green-400" />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-foreground">{classroom.co2}</div>
              <div className="text-muted-foreground">CO₂</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
