"use client"

import { useCallback, useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

// 生成随机验证码字符（4位，数字+字母，排除易混淆字符）
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

function generateCode(length = 4): string {
  let code = ""
  for (let i = 0; i < length; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return code
}

function drawCaptcha(
  canvas: HTMLCanvasElement,
  code: string,
  width: number,
  height: number
) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // 清空画布
  ctx.fillStyle = "#f8fafc"
  ctx.fillRect(0, 0, width, height)

  // 绘制干扰线
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `hsl(${Math.random() * 360}, 70%, 80%)`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(Math.random() * width, Math.random() * height)
    ctx.lineTo(Math.random() * width, Math.random() * height)
    ctx.stroke()
  }

  // 绘制干扰点
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 70%)`
    ctx.beginPath()
    ctx.arc(Math.random() * width, Math.random() * height, 1, 0, Math.PI * 2)
    ctx.fill()
  }

  // 绘制验证码文字
  const space = width / (code.length + 1)
  for (let i = 0; i < code.length; i++) {
    ctx.save()
    ctx.font = `bold ${Math.floor(height * 0.6)}px system-ui`
    ctx.fillStyle = `hsl(${200 + Math.random() * 60}, 60%, 35%)`
    ctx.textBaseline = "middle"
    const x = space * (i + 1) - ctx.measureText(code[i]).width / 2
    const y = height / 2
    const angle = (Math.random() - 0.5) * 0.4
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.translate(-x, -y)
    ctx.fillText(code[i], x, y)
    ctx.restore()
  }
}

export interface GraphicalCaptchaProps {
  value?: string
  onChange?: (value: string) => void
  onRefresh?: () => void
  className?: string
  width?: number
  height?: number
}

export function GraphicalCaptcha({
  value,
  onChange,
  onRefresh,
  className,
  width = 120,
  height = 40,
}: GraphicalCaptchaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [code, setCode] = useState(() => generateCode())

  const refresh = useCallback(() => {
    const newCode = generateCode()
    setCode(newCode)
    onChange?.(newCode)
    onRefresh?.()
  }, [onChange, onRefresh])

  useEffect(() => {
    onChange?.(code)
  }, [onChange, code])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(dpr, dpr)
      drawCaptcha(canvas, code, width, height)
    }
  }, [code, width, height])

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <canvas
        ref={canvasRef}
        className="rounded border border-border cursor-pointer select-none"
        style={{ width, height }}
        onClick={refresh}
        title="点击刷新验证码"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-10 w-10 shrink-0"
        onClick={refresh}
        title="刷新验证码"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  )
}
