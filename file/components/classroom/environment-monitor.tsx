"use client"

import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Zap,
  Cpu,
  HardDrive,
  MemoryStick,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface EnvironmentData {
  temperature: number
  humidity: number
  pm25: number
  co2: number
  formaldehyde: number
  tvoc: number
  illuminance: number
}

interface DeviceHealth {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  temperature: number
  projectorHours: number
  cloudStorage: { used: number; total: number }
}

interface EnergyData {
  currentPower: number
  dailyConsumption: number
}

const mockEnvironment: EnvironmentData = {
  temperature: 24.2,
  humidity: 55,
  pm25: 18,
  co2: 520,
  formaldehyde: 0.02,
  tvoc: 0.15,
  illuminance: 450,
}

const mockDeviceHealth: DeviceHealth = {
  cpuUsage: 35,
  memoryUsage: 62,
  diskUsage: 48,
  temperature: 52,
  projectorHours: 2456,
  cloudStorage: { used: 128, total: 256 },
}

const mockEnergy: EnergyData = {
  currentPower: 2450,
  dailyConsumption: 18.5,
}

function getStatusColor(value: number, thresholds: { good: number; warning: number }) {
  if (value <= thresholds.good) return "text-primary"
  if (value <= thresholds.warning) return "text-chart-3"
  return "text-destructive"
}

export function EnvironmentMonitor() {
  return (
    <div className="space-y-4">
      {/* Environment Metrics */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-foreground">环境信息</h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-chart-5" />
              <span className="text-xs text-muted-foreground">温度</span>
            </div>
            <p className="mt-1 text-xl font-semibold text-foreground">
              {mockEnvironment.temperature}°C
            </p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-chart-2" />
              <span className="text-xs text-muted-foreground">湿度</span>
            </div>
            <p className="mt-1 text-xl font-semibold text-foreground">
              {mockEnvironment.humidity}%
            </p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">PM2.5</span>
            </div>
            <p
              className={cn(
                "mt-1 text-xl font-semibold",
                getStatusColor(mockEnvironment.pm25, { good: 35, warning: 75 })
              )}
            >
              {mockEnvironment.pm25}
            </p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">CO2</span>
            </div>
            <p
              className={cn(
                "mt-1 text-xl font-semibold",
                getStatusColor(mockEnvironment.co2, { good: 800, warning: 1000 })
              )}
            >
              {mockEnvironment.co2}
              <span className="text-xs font-normal text-muted-foreground"> ppm</span>
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">甲醛</span>
            </div>
            <p
              className={cn(
                "mt-1 text-lg font-semibold",
                getStatusColor(mockEnvironment.formaldehyde, {
                  good: 0.08,
                  warning: 0.1,
                })
              )}
            >
              {mockEnvironment.formaldehyde}
              <span className="text-xs font-normal text-muted-foreground"> mg/m3</span>
            </p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">TVOC</span>
            </div>
            <p
              className={cn(
                "mt-1 text-lg font-semibold",
                getStatusColor(mockEnvironment.tvoc, { good: 0.5, warning: 0.6 })
              )}
            >
              {mockEnvironment.tvoc}
              <span className="text-xs font-normal text-muted-foreground"> mg/m3</span>
            </p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-chart-3" />
              <span className="text-xs text-muted-foreground">光照度</span>
            </div>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {mockEnvironment.illuminance}
              <span className="text-xs font-normal text-muted-foreground"> lux</span>
            </p>
          </div>
        </div>
      </div>

      {/* Device Health */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-foreground">设备状态</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            <span className="w-16 text-xs text-muted-foreground">CPU</span>
            <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  mockDeviceHealth.cpuUsage < 60
                    ? "bg-primary"
                    : mockDeviceHealth.cpuUsage < 80
                      ? "bg-chart-3"
                      : "bg-destructive"
                )}
                style={{ width: `${mockDeviceHealth.cpuUsage}%` }}
              />
            </div>
            <span className="w-12 text-right text-sm font-medium text-foreground">
              {mockDeviceHealth.cpuUsage}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
            <span className="w-16 text-xs text-muted-foreground">内存</span>
            <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  mockDeviceHealth.memoryUsage < 60
                    ? "bg-primary"
                    : mockDeviceHealth.memoryUsage < 80
                      ? "bg-chart-3"
                      : "bg-destructive"
                )}
                style={{ width: `${mockDeviceHealth.memoryUsage}%` }}
              />
            </div>
            <span className="w-12 text-right text-sm font-medium text-foreground">
              {mockDeviceHealth.memoryUsage}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            <span className="w-16 text-xs text-muted-foreground">磁盘</span>
            <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  mockDeviceHealth.diskUsage < 60
                    ? "bg-primary"
                    : mockDeviceHealth.diskUsage < 80
                      ? "bg-chart-3"
                      : "bg-destructive"
                )}
                style={{ width: `${mockDeviceHealth.diskUsage}%` }}
              />
            </div>
            <span className="w-12 text-right text-sm font-medium text-foreground">
              {mockDeviceHealth.diskUsage}%
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <Thermometer className="mx-auto h-4 w-4 text-chart-5" />
            <p className="mt-1 text-lg font-semibold text-foreground">
              {mockDeviceHealth.temperature}°C
            </p>
            <p className="text-xs text-muted-foreground">设备温度</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <Clock className="mx-auto h-4 w-4 text-chart-3" />
            <p className="mt-1 text-lg font-semibold text-foreground">
              {mockDeviceHealth.projectorHours}h
            </p>
            <p className="text-xs text-muted-foreground">灯泡时长</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3 text-center">
            <HardDrive className="mx-auto h-4 w-4 text-chart-2" />
            <p className="mt-1 text-lg font-semibold text-foreground">
              {mockDeviceHealth.cloudStorage.used}/{mockDeviceHealth.cloudStorage.total}G
            </p>
            <p className="text-xs text-muted-foreground">云盘容量</p>
          </div>
        </div>
      </div>

      {/* Energy */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-medium text-foreground">能耗监测</h3>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-chart-3/10">
            <Zap className="h-8 w-8 text-chart-3" />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-foreground">
                {mockEnergy.currentPower}
              </span>
              <span className="text-sm text-muted-foreground">W</span>
            </div>
            <p className="text-sm text-muted-foreground">当前功率</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-primary">
                {mockEnergy.dailyConsumption}
              </span>
              <span className="text-sm text-muted-foreground">kWh</span>
            </div>
            <p className="text-sm text-muted-foreground">今日用电</p>
          </div>
        </div>
      </div>
    </div>
  )
}
