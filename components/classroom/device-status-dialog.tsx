"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Thermometer,
  Clock,
  Activity,
} from "lucide-react"

interface DeviceHealth {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  temperature: number
  projectorHours: number
  cloudStorage: { used: number; total: number }
}

const mockDeviceHealth: DeviceHealth = {
  cpuUsage: 35,
  memoryUsage: 62,
  diskUsage: 48,
  temperature: 52,
  projectorHours: 2456,
  cloudStorage: { used: 128, total: 256 },
}

function getStatusColor(value: number, thresholds: { good: number; warning: number }) {
  if (value <= thresholds.good) return "bg-primary"
  if (value <= thresholds.warning) return "bg-chart-3"
  return "bg-destructive"
}

export function DeviceStatusDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Activity className="h-4 w-4" />
          设备状态
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>设备运行状态</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 性能指标 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              <span className="w-16 text-sm text-muted-foreground">CPU</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    getStatusColor(mockDeviceHealth.cpuUsage, { good: 60, warning: 80 })
                  )}
                  style={{ width: `${mockDeviceHealth.cpuUsage}%` }}
                />
              </div>
              <span className="w-12 text-right text-sm font-medium">
                {mockDeviceHealth.cpuUsage}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MemoryStick className="h-4 w-4 text-muted-foreground" />
              <span className="w-16 text-sm text-muted-foreground">内存</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    getStatusColor(mockDeviceHealth.memoryUsage, { good: 60, warning: 80 })
                  )}
                  style={{ width: `${mockDeviceHealth.memoryUsage}%` }}
                />
              </div>
              <span className="w-12 text-right text-sm font-medium">
                {mockDeviceHealth.memoryUsage}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span className="w-16 text-sm text-muted-foreground">磁盘</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    getStatusColor(mockDeviceHealth.diskUsage, { good: 60, warning: 80 })
                  )}
                  style={{ width: `${mockDeviceHealth.diskUsage}%` }}
                />
              </div>
              <span className="w-12 text-right text-sm font-medium">
                {mockDeviceHealth.diskUsage}%
              </span>
            </div>
          </div>

          {/* 其他指标 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <Thermometer className="mx-auto h-5 w-5 text-chart-5" />
              <p className="mt-2 text-lg font-semibold text-foreground">
                {mockDeviceHealth.temperature}°C
              </p>
              <p className="text-xs text-muted-foreground">设备温度</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <Clock className="mx-auto h-5 w-5 text-chart-3" />
              <p className="mt-2 text-lg font-semibold text-foreground">
                {mockDeviceHealth.projectorHours}h
              </p>
              <p className="text-xs text-muted-foreground">灯泡时长</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <HardDrive className="mx-auto h-5 w-5 text-chart-2" />
              <p className="mt-2 text-lg font-semibold text-foreground">
                {mockDeviceHealth.cloudStorage.used}/{mockDeviceHealth.cloudStorage.total}G
              </p>
              <p className="text-xs text-muted-foreground">云盘容量</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
