"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCaptcha } from "@/lib/api/auth"

export interface GraphicalCaptchaProps {
  /** 验证码刷新时回调，传入 checkKey 供登录使用 */
  onCheckKeyChange?: (checkKey: string) => void
  /** 刷新时清空用户输入 */
  onRefresh?: () => void
  className?: string
  width?: number
  height?: number
}

export function GraphicalCaptcha({
  onCheckKeyChange,
  onRefresh,
  className,
  width = 120,
  height = 40,
}: GraphicalCaptchaProps) {
  const [checkKey, setCheckKey] = useState("")
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCaptcha = useCallback(async () => {
    const key = Date.now().toString()
    setCheckKey(key)
    setLoading(true)
    setError(null)
    try {
      const base64 = await getCaptcha(key)
      setImageSrc(base64)
      onCheckKeyChange?.(key)
    } catch (err) {
      setError("验证码加载失败")
      setImageSrc(null)
      console.error("获取验证码失败:", err)
    } finally {
      setLoading(false)
    }
    onRefresh?.()
  }, [onCheckKeyChange, onRefresh])

  useEffect(() => {
    loadCaptcha()
  }, [loadCaptcha])

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="flex items-center justify-center rounded border border-border overflow-hidden bg-muted/30 cursor-pointer select-none"
        style={{ width, height }}
        onClick={loadCaptcha}
        title="点击刷新验证码"
      >
        {loading ? (
          <span className="text-xs text-muted-foreground">加载中...</span>
        ) : error ? (
          <span className="text-xs text-destructive">{error}</span>
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt="验证码"
            className="w-full h-full object-contain"
            draggable={false}
          />
        ) : null}
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0"
        onClick={loadCaptcha}
        disabled={loading}
        title="刷新验证码"
      >
        <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
      </Button>
    </div>
  )
}
