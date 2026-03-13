"use client"

import { useEffect, useRef, useState } from "react"
import { Video } from "lucide-react"

interface FlvPlayerProps {
  /** 完整 FLV 流地址 */
  url: string | null
  /** 是否静音 */
  muted?: boolean
  /** 是否自动播放 */
  autoPlay?: boolean
  className?: string
}

export function FlvPlayer({ url, muted = true, autoPlay = true, className = "" }: FlvPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const flvRef = useRef<ReturnType<typeof import("flv.js").createPlayer> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!url || !videoRef.current) {
      setLoading(false)
      return
    }

    let mounted = true
    setError(null)
    setLoading(true)

    const initPlayer = async () => {
      try {
        const flvjs = (await import("flv.js")).default
        if (!flvjs.isSupported()) {
          setError("当前浏览器不支持 FLV 播放")
          return
        }

        if (!mounted || !videoRef.current) return

        flvRef.current?.destroy()
        const player = flvjs.createPlayer(
          { type: "flv", url, isLive: true },
          { enableStashBuffer: false, stashInitialSize: 128 }
        )
        flvRef.current = player
        player.attachMediaElement(videoRef.current)
        player.load()
        if (autoPlay) {
          player.play().catch(() => {})
        }
        setLoading(false)
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e.message : "播放失败")
          setLoading(false)
        }
      }
    }

    initPlayer()
    return () => {
      mounted = false
      flvRef.current?.destroy()
      flvRef.current = null
    }
  }, [url, autoPlay])

  if (!url) {
    return (
      <div
        className={`flex items-center justify-center bg-black ${className}`}
      >
        <div className="text-center text-muted-foreground">
          <Video className="h-12 w-12 mx-auto mb-2 opacity-30" />
          <p className="text-xs">暂无流地址</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-black ${className}`}
      >
        <div className="text-center text-muted-foreground">
          <Video className="h-12 w-12 mx-auto mb-2 opacity-30" />
          <p className="text-xs text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
          <div className="animate-pulse text-muted-foreground text-xs">加载中...</div>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        muted={muted}
        playsInline
        controls={false}
      />
    </div>
  )
}
