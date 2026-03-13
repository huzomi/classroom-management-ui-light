"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { cn } from "@/lib/utils"
import {
  Camera,
  Monitor,
  Maximize2,
  Volume2,
  VolumeX,
  Video,
  Users,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlvPlayer } from "@/components/monitoring/flv-player"
import {
  getPlayWindows,
  getFullStreamUrl,
  type CommonStreamOutputVO,
} from "@/lib/api/camera"

interface FixedChannel {
  type: number
  label: string
  icon: React.ElementType
}

const FIXED_CHANNELS: FixedChannel[] = [
  { type: 1, label: "教师", icon: Camera },
  { type: 0, label: "桌面", icon: Monitor },
  { type: 2, label: "学生", icon: Users },
  { type: 3, label: "近景", icon: Eye },
]

interface CameraPreviewProps {
  roomId?: string
}

export function CameraPreview({ roomId }: CameraPreviewProps) {
  const [channels, setChannels] = useState<CommonStreamOutputVO[]>([])
  const [loading, setLoading] = useState(false)
  const [activeType, setActiveType] = useState<number>(1)
  const [isMuted, setIsMuted] = useState(true)

  const fetchChannels = useCallback(async () => {
    if (!roomId) return
    setLoading(true)
    try {
      const list = await getPlayWindows(roomId, 0)
      setChannels(list)
    } catch (err) {
      console.error("获取摄像头通道失败", err)
    } finally {
      setLoading(false)
    }
  }, [roomId])

  useEffect(() => {
    fetchChannels()
  }, [fetchChannels])

  const activeStream = useMemo(
    () => channels.find((ch) => ch.type === activeType) ?? null,
    [channels, activeType]
  )

  const currentStreamUrl = activeStream?.url
    ? getFullStreamUrl(activeStream.url)
    : null

  const activeLabel = FIXED_CHANNELS.find((c) => c.type === activeType)?.label ?? ""

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* 通道选择器（固定四个） */}
      <div className="flex shrink-0 items-center gap-1 border-b border-border bg-secondary/30 p-2">
        {FIXED_CHANNELS.map((ch) => {
          const Icon = ch.icon
          const isActive = activeType === ch.type
          return (
            <button
              key={ch.type}
              onClick={() => setActiveType(ch.type)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {ch.label}
            </button>
          )
        })}
      </div>

      {/* 主预览区 */}
      <div className="relative flex-1 bg-black min-h-0">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
            <span className="text-sm text-muted-foreground">加载中...</span>
          </div>
        ) : (
          <FlvPlayer
            url={currentStreamUrl}
            muted={isMuted}
            className="absolute inset-0"
          />
        )}

        {/* 左上角标签 */}
        <div className="absolute left-3 top-3 rounded bg-background/80 px-2 py-1 backdrop-blur-sm z-20">
          <span className="text-xs font-medium text-foreground">{activeLabel}</span>
        </div>

        {/* 右上角状态 */}
        {activeStream && (
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded bg-background/80 px-2 py-1 backdrop-blur-sm z-20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs text-foreground">直播</span>
          </div>
        )}

        {/* 底部控制栏（仅有流地址时显示） */}
        {currentStreamUrl && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-background/90 to-transparent px-3 py-2 z-20">
            <span className="text-xs text-muted-foreground">
              {activeStream?.width && activeStream?.height
                ? `${activeStream.width}x${activeStream.height}`
                : ""}
              {activeStream?.fps ? ` @ ${activeStream.fps}fps` : ""}
            </span>
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
        )}
      </div>
    </div>
  )
}
