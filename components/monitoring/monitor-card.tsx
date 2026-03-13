"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Video, Volume2, VolumeX, Maximize2, ClipboardList } from "lucide-react"
import { FlvPlayer } from "./flv-player"
import {
  getPlayWindows,
  getFullStreamUrl,
  type CommonStreamOutputVO,
} from "@/lib/api/camera"

/** API type 与 通道标签 映射 */
const TYPE_LABELS: Record<number, string> = {
  0: "桌面",
  1: "教师",
  2: "学生",
  3: "特写",
}

type MonitorStatus = "in-class" | "idle" | "fault"
interface MonitorCardProps {
  roomId: string
  name: string
  status: MonitorStatus
  teacher: string | null
  course: string | null
  time: string | null
  audioEnabled: boolean
  onToggleAudio: () => void
  onOpenEvaluation?: () => void
}

export function MonitorCard({
  roomId,
  name,
  status,
  teacher,
  course,
  time,
  audioEnabled,
  onToggleAudio,
  onOpenEvaluation,
}: MonitorCardProps) {
  const [streams, setStreams] = useState<CommonStreamOutputVO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<number>(1)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getPlayWindows(roomId, 0)
      .then((list) => {
        if (cancelled) return
        setStreams(list)
        if (list.length > 0) {
          setActiveType((prev) => (list.some((s) => s.type === prev) ? prev : list[0].type))
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "获取流地址失败")
          setStreams([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [roomId])

  const activeStream = streams.find((s) => s.type === activeType)
  const streamUrl = activeStream?.url ? getFullStreamUrl(activeStream.url) : null

  const availableTypes = [...new Set(streams.map((s) => s.type))].sort((a, b) => a - b)

  return (
    <Card className="relative aspect-video bg-secondary/20 overflow-hidden group">
      {/* 视频区域 */}
      <div className="absolute inset-0">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
            <div className="text-center text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-2 animate-pulse opacity-50" />
              <p className="text-xs">加载流地址...</p>
            </div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
            <div className="text-center text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          </div>
        ) : (
          <FlvPlayer
            url={streamUrl}
            muted={!audioEnabled}
            autoPlay
            className="absolute inset-0"
          />
        )}
      </div>

      {/* 左上角标签 */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-black/50 backdrop-blur text-white border-0">
            {name}
          </Badge>
          {course && (
            <Badge variant="default" className="bg-blue-500/80 backdrop-blur text-white border-0">
              {course}
            </Badge>
          )}
        </div>
        {teacher && (
          <Badge variant="default" className="bg-black/50 backdrop-blur text-white border-0 w-fit">
            {teacher}
          </Badge>
        )}
      </div>

      {/* 右下角控制 */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {status === "in-class" && course && (
          <Button
            size="sm"
            variant="default"
            className="h-8 gap-1.5 px-2 bg-primary hover:bg-primary/90"
            onClick={onOpenEvaluation}
            title="听评课评分"
          >
            <ClipboardList className="h-4 w-4" />
            评分
          </Button>
        )}
        <Button
          size="sm"
          variant="default"
          className="h-8 w-8 p-0 bg-black/50 backdrop-blur hover:bg-black/70"
          onClick={onToggleAudio}
        >
          {audioEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
        <Button
          size="sm"
          variant="default"
          className="h-8 w-8 p-0 bg-black/50 backdrop-blur hover:bg-black/70"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* 左下角通道切换 */}
      {availableTypes.length > 0 && (
        <div className="absolute bottom-3 left-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {availableTypes.map((type) => (
            <Button
              key={type}
              size="sm"
              variant={activeType === type ? "default" : "ghost"}
              className="h-7 px-2 text-xs bg-black/50 backdrop-blur border-0"
              onClick={() => setActiveType(type)}
            >
              {TYPE_LABELS[type] ?? streams.find((s) => s.type === type)?.title ?? `通道${type}`}
            </Button>
          ))}
        </div>
      )}
    </Card>
  )
}
