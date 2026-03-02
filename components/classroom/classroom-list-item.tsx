"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, BookOpen, Thermometer, Droplets, Wind, Leaf, Activity, MoreVertical, Check } from "lucide-react"

interface ClassroomListItemProps {
  classroom: any
  onClick: () => void
  isMultiSelectMode?: boolean
  isSelected?: boolean
  onToggleSelect?: () => void
}

export function ClassroomListItem({
  classroom,
  onClick,
  isMultiSelectMode = false,
  isSelected = false,
  onToggleSelect,
}: ClassroomListItemProps) {
  const statusConfig = {
    "in-class": { label: "上课中", color: "oklch(0.65 0.19 230)", textColor: "text-info" },
    idle: { label: "空闲", color: "oklch(0.65 0.18 145)", textColor: "text-success" },
    fault: { label: "故障", color: "oklch(0.55 0.22 25)", textColor: "text-destructive" },
    offline: { label: "离线", color: "oklch(0.4 0 0)", textColor: "text-muted-foreground" },
  }

  const status = statusConfig[classroom.status as keyof typeof statusConfig]

  const handleClick = () => {
    if (isMultiSelectMode && onToggleSelect) {
      onToggleSelect()
    } else {
      onClick()
    }
  }

  return (
    <Card
      className={`p-4 cursor-pointer hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 border-l-2 group ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
      style={{ borderLeftColor: status.color }}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between gap-6">
        {isMultiSelectMode && (
          <div
            className="flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              onToggleSelect?.()
            }}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? "bg-primary border-primary" : "border-border bg-background hover:border-primary"}`}
            >
              {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 min-w-[200px]">
          <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{classroom.name}</h3>
          <Badge className="text-xs px-2 py-0.5 border-0" style={{ backgroundColor: status.color, color: "white" }}>
            {status.label}
          </Badge>
        </div>

        <div className="flex items-center gap-4 flex-1 min-w-[200px]">
          {classroom.teacher && (
            <>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-foreground">{classroom.teacher}</span>
              </div>
              <div className="flex items-center gap-2 text-sm max-w-[180px]">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-foreground truncate">{classroom.course}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm">
            <Thermometer className="h-3.5 w-3.5 text-orange-400" />
            <span className="font-medium">{classroom.temperature}°C</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Droplets className="h-3.5 w-3.5 text-blue-400" />
            <span className="font-medium">{classroom.humidity}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Wind className="h-3.5 w-3.5 text-gray-400" />
            <span className="font-medium">{classroom.pm25}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Leaf className="h-3.5 w-3.5 text-green-400" />
            <span className="font-medium">{classroom.co2}</span>
          </div>
        </div>

        {/* Device status and actions */}
        <div className="flex items-center gap-3">
          <Activity className={`h-4 w-4 ${classroom.online ? "text-success" : "text-muted-foreground"}`} />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
