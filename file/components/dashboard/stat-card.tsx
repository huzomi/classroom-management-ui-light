"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    isUp: boolean
  }
  icon?: React.ReactNode
  variant?: "default" | "success" | "warning" | "destructive"
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = "default",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p
            className={cn(
              "text-3xl font-semibold tracking-tight",
              variant === "success" && "text-primary",
              variant === "warning" && "text-chart-3",
              variant === "destructive" && "text-destructive"
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              variant === "default" && "bg-secondary text-muted-foreground",
              variant === "success" && "bg-primary/10 text-primary",
              variant === "warning" && "bg-chart-3/10 text-chart-3",
              variant === "destructive" && "bg-destructive/10 text-destructive"
            )}
          >
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          {trend.isUp ? (
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              trend.isUp ? "text-primary" : "text-destructive"
            )}
          >
            {trend.isUp ? "+" : ""}
            {trend.value}%
          </span>
          <span className="text-xs text-muted-foreground">较昨日</span>
        </div>
      )}
    </div>
  )
}
