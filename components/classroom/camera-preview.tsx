"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Camera,
  Monitor,
  Maximize2,
  Volume2,
  VolumeX,
  Video,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface CameraSource {
  id: string
  label: string
  icon: React.ElementType
  type: "camera" | "screen"
}

const cameraSources: CameraSource[] = [
  { id: "teacher", label: "教师", icon: Camera, type: "camera" },
  { id: "student", label: "学生", icon: Users, type: "camera" },
  { id: "blackboard", label: "板书", icon: Video, type: "camera" },
  { id: "desktop", label: "桌面", icon: Monitor, type: "screen" },
]

export function CameraPreview() {
  const [activeSource, setActiveSource] = useState<string>("teacher")
  const [isMuted, setIsMuted] = useState(true)

  const currentSource = cameraSources.find((s) => s.id === activeSource)
  const IconComponent = currentSource?.icon

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* 画面源选择器 */}
      <div className="flex shrink-0 items-center gap-1 border-b border-border bg-secondary/30 p-2">
        {cameraSources.map((source) => {
          const SourceIcon = source.icon
          return (
            <button
              key={source.id}
              onClick={() => setActiveSource(source.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                activeSource === source.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <SourceIcon className="h-3.5 w-3.5" />
              {source.label}
            </button>
          )
        })}
      </div>

      {/* 主预览区 - 填充父容器 */}
      <div className="relative flex-1 bg-muted/30">
        {/* 模拟视频画面占位 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              {IconComponent && <IconComponent className="h-6 w-6 text-muted-foreground" />}
            </div>
            <p className="text-sm text-muted-foreground">{currentSource?.label}画面</p>
          </div>
        </div>

        {/* 左上角标签 */}
        <div className="absolute left-3 top-3 rounded bg-background/80 px-2 py-1 backdrop-blur-sm">
          <span className="text-xs font-medium text-foreground">{currentSource?.label}</span>
        </div>

        {/* 右上角状态 */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded bg-background/80 px-2 py-1 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs text-foreground">直播</span>
        </div>

        {/* 底部控制栏 */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-background/90 to-transparent px-3 py-2">
          <span className="text-xs text-muted-foreground">1920x1080 @ 30fps</span>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
