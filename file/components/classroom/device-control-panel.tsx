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
  Power,
  PowerOff,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  Monitor,
  Projector,
  ArrowUpFromLine,
  ArrowDownToLine,
  Square,
  Snowflake,
  ThermometerSun,
  Wind,
  Video,
  VideoOff,
  Lightbulb,
  LightbulbOff,
  DoorOpen,
  DoorClosed,
  Blinds,
  Layers,
  Activity,
  Cpu,
  HardDrive,
  Thermometer,
} from "lucide-react"

interface DeviceState {
  classStatus: "on" | "off"
  panelLocked: boolean
  volume: number
  muted: boolean
  signalInput: number
  signalOutput: number
  pc: "on" | "off"
  screen: "up" | "down" | "stop"
  projector: "on" | "off"
  otherDevice: "on" | "off"
  ac: { on: boolean; mode: "cool" | "heat" | "fan"; temp: number }
  recording: "on" | "off"
  light: "on" | "off"
  door: "locked" | "unlocked"
  curtain: "open" | "closed"
  activeMode: number
}

export function DeviceControlPanel() {
  const [devices, setDevices] = useState<DeviceState>({
    classStatus: "off",
    panelLocked: false,
    volume: 50,
    muted: false,
    signalInput: 1,
    signalOutput: 1,
    pc: "on",
    screen: "down",
    projector: "on",
    otherDevice: "off",
    ac: { on: true, mode: "cool", temp: 24 },
    recording: "off",
    light: "on",
    door: "locked",
    curtain: "open",
    activeMode: 1,
  })

  // 控制按钮组件
  const ControlButton = ({
    active,
    onClick,
    icon: Icon,
    label,
    variant = "default",
    className,
  }: {
    active?: boolean
    onClick: () => void
    icon: React.ElementType
    label: string
    variant?: "default" | "primary" | "danger"
    className?: string
  }) => {
    const colorClass = active
      ? variant === "danger"
        ? "bg-destructive/10 text-destructive border-destructive/30"
        : "bg-primary/10 text-primary border-primary/30"
      : "bg-secondary text-muted-foreground border-transparent hover:bg-secondary/80"

    return (
      <button
        onClick={onClick}
        className={cn(
          "flex h-8 items-center justify-center gap-1.5 rounded-md border px-2 text-xs font-medium transition-all",
          colorClass,
          className
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </button>
    )
  }

  // 信号切换按钮
  const SignalButton = ({
    active,
    onClick,
    label,
  }: {
    active: boolean
    onClick: () => void
    label: string
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded text-xs font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
      )}
    >
      {label}
    </button>
  )

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      {/* 标题栏 + 设备状态 */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2">
        <span className="text-sm font-semibold text-foreground">设备控制</span>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1.5 px-2 text-xs">
              <Activity className="h-3.5 w-3.5" />
              设备状态
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>设备状态</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">CPU</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[45%] bg-primary" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">45%</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-chart-2" />
                  <span className="text-sm font-medium">内存</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[62%] bg-chart-2" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">62%</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-chart-3" />
                  <span className="text-sm font-medium">磁盘</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-[38%] bg-chart-3" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">38%</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-chart-5" />
                  <span className="text-sm font-medium">温度</span>
                </div>
                <p className="mt-2 text-lg font-semibold">42°C</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2">
                  <Projector className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">灯泡时长</span>
                </div>
                <p className="mt-2 text-lg font-semibold">1,250h</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">云盘</span>
                </div>
                <p className="mt-2 text-lg font-semibold">45/100GB</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 控制面板 */}
      <div className="flex flex-1 flex-col gap-2 overflow-auto p-3">
        {/* 上下课、面板锁定 */}
        <div className="grid grid-cols-4 gap-1.5">
          <ControlButton
            active={devices.classStatus === "on"}
            onClick={() => setDevices((p) => ({ ...p, classStatus: "on" }))}
            icon={Power}
            label="上课"
            variant="primary"
          />
          <ControlButton
            active={devices.classStatus === "off"}
            onClick={() => setDevices((p) => ({ ...p, classStatus: "off" }))}
            icon={PowerOff}
            label="下课"
          />
          <ControlButton
            active={devices.panelLocked}
            onClick={() => setDevices((p) => ({ ...p, panelLocked: true }))}
            icon={Lock}
            label="锁定"
            variant="danger"
          />
          <ControlButton
            active={!devices.panelLocked}
            onClick={() => setDevices((p) => ({ ...p, panelLocked: false }))}
            icon={Unlock}
            label="解锁"
          />
        </div>

        {/* 音量控制 */}
        <div className="grid grid-cols-4 gap-1.5">
          <ControlButton
            onClick={() => setDevices((p) => ({ ...p, volume: Math.min(100, p.volume + 10) }))}
            icon={Plus}
            label="音量+"
          />
          <ControlButton
            onClick={() => setDevices((p) => ({ ...p, volume: Math.max(0, p.volume - 10) }))}
            icon={Minus}
            label="音量-"
          />
          <ControlButton
            active={devices.muted}
            onClick={() => setDevices((p) => ({ ...p, muted: !p.muted }))}
            icon={devices.muted ? VolumeX : Volume2}
            label="静音"
            variant="danger"
          />
          <ControlButton
            active={devices.classStatus === "off"}
            onClick={() => setDevices((p) => ({ ...p, muted: !p.muted }))}
            icon={devices.muted ? VolumeX : Volume2}
            label="恢复"

          />
        </div>

        {/* 信号切换 */}
        <div className="rounded-md bg-secondary/50 p-2">
          <div className="mb-1.5 text-center text-xs text-muted-foreground">信号切换</div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="w-8 text-xs text-muted-foreground">输入</span>
              <div className="flex flex-1 justify-between gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <SignalButton
                    key={`in-${n}`}
                    active={devices.signalInput === n}
                    onClick={() => setDevices((p) => ({ ...p, signalInput: n }))}
                    label={String(n)}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 text-xs text-muted-foreground">输出</span>
              <div className="flex flex-1 justify-between gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <SignalButton
                    key={`out-${n}`}
                    active={devices.signalOutput === n}
                    onClick={() => setDevices((p) => ({ ...p, signalOutput: n }))}
                    label={String(n)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PC、投影机 */}
        <div className="grid grid-cols-4 gap-1.5">
          <ControlButton
            active={devices.pc === "on"}
            onClick={() => setDevices((p) => ({ ...p, pc: "on" }))}
            icon={Monitor}
            label="PC开"
            variant="primary"
          />
          <ControlButton
            active={devices.pc === "off"}
            onClick={() => setDevices((p) => ({ ...p, pc: "off" }))}
            icon={Monitor}
            label="PC关"
          />
          <ControlButton
            active={devices.projector === "on"}
            onClick={() => setDevices((p) => ({ ...p, projector: "on" }))}
            icon={Projector}
            label="投影开"
            variant="primary"
          />
          <ControlButton
            active={devices.projector === "off"}
            onClick={() => setDevices((p) => ({ ...p, projector: "off" }))}
            icon={Projector}
            label="投影关"
          />
        </div>

        {/* 幕布、其他设备 */}
        <div className="grid grid-cols-5 gap-1.5">
          <ControlButton
            active={devices.screen === "up"}
            onClick={() => setDevices((p) => ({ ...p, screen: "up" }))}
            icon={ArrowUpFromLine}
            label="升"
          />
          <ControlButton
            active={devices.screen === "down"}
            onClick={() => setDevices((p) => ({ ...p, screen: "down" }))}
            icon={ArrowDownToLine}
            label="降"
          />
          <ControlButton
            active={devices.screen === "stop"}
            onClick={() => setDevices((p) => ({ ...p, screen: "stop" }))}
            icon={Square}
            label="停"
          />
          <ControlButton
            active={devices.otherDevice === "on"}
            onClick={() => setDevices((p) => ({ ...p, otherDevice: "on" }))}
            icon={Layers}
            label="其他开"
            variant="primary"
          />
          <ControlButton
            active={devices.otherDevice === "off"}
            onClick={() => setDevices((p) => ({ ...p, otherDevice: "off" }))}
            icon={Layers}
            label="其他关"
          />
        </div>

        {/* 录播 */}
        <div className="grid grid-cols-2 gap-1.5">
          <ControlButton
            active={devices.recording === "on"}
            onClick={() => setDevices((p) => ({ ...p, recording: "on" }))}
            icon={Video}
            label="录播开"
            variant="danger"
          />
          <ControlButton
            active={devices.recording === "off"}
            onClick={() => setDevices((p) => ({ ...p, recording: "off" }))}
            icon={VideoOff}
            label="录播关"
          />
        </div>

        {/* 空调控制 - 单独区块 */}
        <div className="rounded-md bg-secondary/50 p-2">
          <div className="mb-1.5 text-center text-xs text-muted-foreground">空调控制</div>
          <div className="grid grid-cols-4 gap-1.5">
            <ControlButton
              active={devices.ac.on}
              onClick={() => setDevices((p) => ({ ...p, ac: { ...p.ac, on: !p.ac.on } }))}
              icon={devices.ac.on ? Snowflake : Wind}
              label={devices.ac.on ? "开" : "关"}
              variant={devices.ac.on ? "primary" : "default"}
            />
            <ControlButton
              active={devices.ac.mode === "cool"}
              onClick={() => setDevices((p) => ({ ...p, ac: { ...p.ac, mode: "cool" } }))}
              icon={Snowflake}
              label="制冷"
            />
            <ControlButton
              active={devices.ac.mode === "heat"}
              onClick={() => setDevices((p) => ({ ...p, ac: { ...p.ac, mode: "heat" } }))}
              icon={ThermometerSun}
              label="制热"
            />
            <ControlButton
              active={devices.ac.mode === "fan"}
              onClick={() => setDevices((p) => ({ ...p, ac: { ...p.ac, mode: "fan" } }))}
              icon={Wind}
              label="通风"
            />
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            <ControlButton
              onClick={() => setDevices((p) => ({ ...p, ac: { ...p.ac, temp: Math.min(30, p.ac.temp + 1) } }))}
              icon={Plus}
              label="温度+"
            />
            <ControlButton
              onClick={() => setDevices((p) => ({ ...p, ac: { ...p.ac, temp: Math.max(16, p.ac.temp - 1) } }))}
              icon={Minus}
              label="温度-"
            />
          </div>
        </div>

        {/* 环境控制：灯、门、窗帘 */}
        <div className="rounded-md bg-secondary/50 p-2">
          <div className="mb-1.5 text-center text-xs text-muted-foreground">环境控制</div>
          <div className="grid grid-cols-3 gap-1.5">
            <ControlButton
              active={devices.light === "on"}
              onClick={() => setDevices((p) => ({ ...p, light: "on" }))}
              icon={Lightbulb}
              label="灯开"
              variant="primary"
            />
            <ControlButton
              active={devices.light === "off"}
              onClick={() => setDevices((p) => ({ ...p, light: "off" }))}
              icon={Blinds}
              label="帘开"
            />
            <ControlButton
              active={devices.door === "unlocked"}
              onClick={() => setDevices((p) => ({ ...p, door: "unlocked" }))}
              icon={DoorOpen}
              label="门开"
              variant="primary"
            />
            <ControlButton
              active={devices.door === "locked"}
              onClick={() => setDevices((p) => ({ ...p, door: "locked" }))}
              icon={LightbulbOff}
              label="灯关"
            />
            <ControlButton
              active={devices.curtain === "open"}
              onClick={() => setDevices((p) => ({ ...p, curtain: "open" }))}
              icon={Blinds}
              label="帘关"
              variant="primary"
            />
            <ControlButton
              active={devices.curtain === "closed"}
              onClick={() => setDevices((p) => ({ ...p, curtain: "closed" }))}
              icon={DoorClosed}
              label="门关"
            />
          </div>
        </div>

        {/* 模式 1-4 */}
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((mode) => (
            <button
              key={mode}
              onClick={() => setDevices((p) => ({ ...p, activeMode: mode }))}
              className={cn(
                "flex h-8 items-center justify-center rounded-md text-xs font-medium transition-all",
                devices.activeMode === mode
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              模式{mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
