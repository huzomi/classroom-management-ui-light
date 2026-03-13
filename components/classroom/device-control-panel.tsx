"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { cn } from "@/lib/utils"
import { remoteControl, multiControlDevice } from "@/lib/api/equipment"
import { toast } from "@/hooks/use-toast"
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
  Video,
  VideoOff,
  Lightbulb,
  LightbulbOff,
  DoorOpen,
  DoorClosed,
  Blinds,
  Activity,
  Cpu,
  HardDrive,
  Thermometer,
} from "lucide-react"

export interface EquipmentStatusItem {
  joinnumId: string
  name: string
  value: string
  joinnum: number
}

interface DeviceControlPanelProps {
  equipmentStatus?: EquipmentStatusItem[]
  isInClass?: boolean
  roomId?: string
}

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
  bigScreen: "on" | "off"
  ac: { on: boolean; mode: "cool" | "heat" | "fan"; temp: number }
  recording: "on" | "off"
  light: "on" | "off"
  door: "locked" | "unlocked"
  curtain: "open" | "closed"
  activeMode: number
}

// API 设备名 → 内部 state key 的映射
const DEVICE_NAME_MAP: Record<string, keyof DeviceState> = {
  "投影": "projector",
  "大屏": "bigScreen",
  "幕布": "screen",
  "灯光": "light",
  "空调": "ac",
  "录播": "recording",
  "门禁": "door",
  "窗帘": "curtain",
  "帘": "curtain",
  "门": "door",
  "PC": "pc",
  "电脑": "pc",
}

// 内部 key → API 设备名（反向映射，用于查 joinnum）
const KEY_TO_NAMES: Record<string, string[]> = {
  projector: ["投影"],
  bigScreen: ["大屏"],
  screen: ["幕布"],
  light: ["灯光"],
  ac: ["空调"],
  recording: ["录播"],
  door: ["门禁", "门"],
  curtain: ["窗帘", "帘"],
  pc: ["PC", "电脑"],
}

export function DeviceControlPanel({ equipmentStatus = [], isInClass, roomId }: DeviceControlPanelProps) {
  const availableDevices = useMemo(() => {
    const set = new Set<string>()
    for (const item of equipmentStatus) {
      const key = DEVICE_NAME_MAP[item.name]
      if (key) set.add(key)
    }
    return set
  }, [equipmentStatus])

  // 根据内部 key 从 equipmentStatus 中查找对应的 joinnum
  const getJoinNum = useCallback((deviceKey: string): number | null => {
    const names = KEY_TO_NAMES[deviceKey]
    if (!names) return null
    const item = equipmentStatus.find((e) => names.includes(e.name))
    return item?.joinnum ?? null
  }, [equipmentStatus])

  const has = (key: keyof DeviceState) => availableDevices.size === 0 || availableDevices.has(key)

  const initialState = useMemo((): DeviceState => {
    const state: DeviceState = {
      classStatus: isInClass ? "on" : "off",
      panelLocked: false,
      volume: 50,
      muted: false,
      signalInput: 1,
      signalOutput: 1,
      pc: "off",
      screen: "stop",
      projector: "off",
      bigScreen: "off",
      ac: { on: false, mode: "cool", temp: 24 },
      recording: "off",
      light: "off",
      door: "locked",
      curtain: "closed",
      activeMode: 1,
    }

    for (const item of equipmentStatus) {
      const isOn = item.value === "1"
      const key = DEVICE_NAME_MAP[item.name]
      switch (key) {
        case "projector": state.projector = isOn ? "on" : "off"; break
        case "bigScreen": state.bigScreen = isOn ? "on" : "off"; break
        case "screen": state.screen = isOn ? "down" : "up"; break
        case "light": state.light = isOn ? "on" : "off"; break
        case "ac": state.ac = { ...state.ac, on: isOn }; break
        case "recording": state.recording = isOn ? "on" : "off"; break
        case "door": state.door = isOn ? "unlocked" : "locked"; break
        case "curtain": state.curtain = isOn ? "open" : "closed"; break
        case "pc": state.pc = isOn ? "on" : "off"; break
      }
    }

    return state
  }, [equipmentStatus, isInClass])

  const [devices, setDevices] = useState<DeviceState>(initialState)

  useEffect(() => {
    setDevices(initialState)
  }, [initialState])

  // 上下课控制
  const handleClassControl = useCallback(async (action: "on" | "off") => {
    if (!roomId) return
    const label = action === "on" ? "上课" : "下课"
    const value = action === "on" ? 1 : 2
    try {
      await remoteControl([roomId], value)
      setDevices((p) => ({ ...p, classStatus: action }))
      toast({ title: `${label}指令发送成功` })
    } catch {
      toast({ title: `${label}指令发送失败`, description: "请稍后重试", variant: "destructive" })
    }
  }, [roomId])

  // 通用设备控制（调用 multicontroldevice，joinnum 从接口数据动态获取）
  const handleDeviceControl = useCallback(async (
    deviceKey: string,
    label: string,
    value: number,
    onSuccess: () => void,
  ) => {
    if (!roomId) return
    const joinNum = getJoinNum(deviceKey)
    if (joinNum == null) {
      onSuccess()
      toast({ title: label })
      return
    }
    try {
      await multiControlDevice([roomId], joinNum, value)
      onSuccess()
      toast({ title: `${label}指令发送成功` })
    } catch {
      toast({ title: `${label}指令发送失败`, description: "请稍后重试", variant: "destructive" })
    }
  }, [roomId, getJoinNum])

  const ControlButton = ({
    active,
    onClick,
    icon: Icon,
    label,
    variant = "default",
    className,
    disabled,
  }: {
    active?: boolean
    onClick: () => void
    icon: React.ElementType
    label: string
    variant?: "default" | "primary" | "danger"
    className?: string
    disabled?: boolean
  }) => {
    const colorClass = disabled
      ? "bg-muted text-muted-foreground/40 border-transparent cursor-not-allowed"
      : active
        ? variant === "danger"
          ? "bg-destructive/10 text-destructive border-destructive/30"
          : "bg-primary/10 text-primary border-primary/30"
        : "bg-secondary text-muted-foreground border-transparent hover:bg-secondary/80"

    return (
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
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

  const noProjector = !has("projector")
  const noBigScreen = !has("bigScreen")
  const noScreen = !has("screen")
  const noAc = !has("ac")
  const noRecording = !has("recording")
  const noLight = !has("light")
  const noDoor = !has("door")
  const noCurtain = !has("curtain")
  const noPc = !has("pc")

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
            {equipmentStatus.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {equipmentStatus.map((item) => (
                  <div key={item.joinnumId} className="rounded-lg bg-secondary/50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className={cn(
                        "rounded px-2 py-0.5 text-xs font-medium",
                        item.value === "1"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {item.value === "1" ? "开启" : "关闭"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* 控制面板 */}
      <div className="flex flex-1 flex-col gap-2 overflow-auto p-3">
        {/* 上下课、面板锁定 */}
        <div className="grid grid-cols-4 gap-1.5">
          <ControlButton
            active={devices.classStatus === "on"}
            onClick={() => handleClassControl("on")}
            icon={Power}
            label="上课"
            variant="primary"
          />
          <ControlButton
            active={devices.classStatus === "off"}
            onClick={() => handleClassControl("off")}
            icon={PowerOff}
            label="下课"
          />
          <ControlButton
            active={devices.panelLocked}
            onClick={() => {
              setDevices((p) => ({ ...p, panelLocked: true }))
              toast({ title: "面板已锁定" })
            }}
            icon={Lock}
            label="锁定"
            variant="danger"
          />
          <ControlButton
            active={!devices.panelLocked}
            onClick={() => {
              setDevices((p) => ({ ...p, panelLocked: false }))
              toast({ title: "面板已解锁" })
            }}
            icon={Unlock}
            label="解锁"
          />
        </div>

        {/* 音量控制 */}
        <div className="grid grid-cols-4 gap-1.5">
          <ControlButton
            onClick={() => {
              setDevices((p) => ({ ...p, volume: Math.min(100, p.volume + 10) }))
              toast({ title: "音量+" })
            }}
            icon={Plus}
            label="音量+"
          />
          <ControlButton
            onClick={() => {
              setDevices((p) => ({ ...p, volume: Math.max(0, p.volume - 10) }))
              toast({ title: "音量-" })
            }}
            icon={Minus}
            label="音量-"
          />
          <ControlButton
            active={devices.muted}
            onClick={() => {
              setDevices((p) => ({ ...p, muted: true }))
              toast({ title: "已静音" })
            }}
            icon={VolumeX}
            label="静音"
            variant="danger"
          />
          <ControlButton
            active={!devices.muted}
            onClick={() => {
              setDevices((p) => ({ ...p, muted: false }))
              toast({ title: "已恢复声音" })
            }}
            icon={Volume2}
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
                    onClick={() => {
                      setDevices((p) => ({ ...p, signalInput: n }))
                      toast({ title: `信号输入切换为 ${n}` })
                    }}
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
                    onClick={() => {
                      setDevices((p) => ({ ...p, signalOutput: n }))
                      toast({ title: `信号输出切换为 ${n}` })
                    }}
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
            onClick={() => handleDeviceControl("pc", "PC开", 1, () => setDevices((p) => ({ ...p, pc: "on" })))}
            icon={Monitor}
            label="PC开"
            variant="primary"
            disabled={noPc}
          />
          <ControlButton
            active={devices.pc === "off"}
            onClick={() => handleDeviceControl("pc", "PC关", 0, () => setDevices((p) => ({ ...p, pc: "off" })))}
            icon={Monitor}
            label="PC关"
            disabled={noPc}
          />
          <ControlButton
            active={devices.projector === "on"}
            onClick={() => handleDeviceControl("projector", "投影开", 1, () => setDevices((p) => ({ ...p, projector: "on" })))}
            icon={Projector}
            label="投影开"
            variant="primary"
            disabled={noProjector}
          />
          <ControlButton
            active={devices.projector === "off"}
            onClick={() => handleDeviceControl("projector", "投影关", 0, () => setDevices((p) => ({ ...p, projector: "off" })))}
            icon={Projector}
            label="投影关"
            disabled={noProjector}
          />
        </div>

        {/* 幕布、大屏 */}
        <div className="grid grid-cols-5 gap-1.5">
          <ControlButton
            active={devices.screen === "up"}
            onClick={() => handleDeviceControl("screen", "幕布升", 1, () => setDevices((p) => ({ ...p, screen: "up" })))}
            icon={ArrowUpFromLine}
            label="升"
            disabled={noScreen}
          />
          <ControlButton
            active={devices.screen === "down"}
            onClick={() => handleDeviceControl("screen", "幕布降", 0, () => setDevices((p) => ({ ...p, screen: "down" })))}
            icon={ArrowDownToLine}
            label="降"
            disabled={noScreen}
          />
          <ControlButton
            active={devices.screen === "stop"}
            onClick={() => handleDeviceControl("screen", "幕布停", 2, () => setDevices((p) => ({ ...p, screen: "stop" })))}
            icon={Square}
            label="停"
            disabled={noScreen}
          />
          <ControlButton
            active={devices.bigScreen === "on"}
            onClick={() => handleDeviceControl("bigScreen", "大屏开", 1, () => setDevices((p) => ({ ...p, bigScreen: "on" })))}
            icon={Monitor}
            label="大屏开"
            variant="primary"
            disabled={noBigScreen}
          />
          <ControlButton
            active={devices.bigScreen === "off"}
            onClick={() => handleDeviceControl("bigScreen", "大屏关", 0, () => setDevices((p) => ({ ...p, bigScreen: "off" })))}
            icon={Monitor}
            label="大屏关"
            disabled={noBigScreen}
          />
        </div>

        {/* 录播 */}
        <div className="grid grid-cols-2 gap-1.5">
          <ControlButton
            active={devices.recording === "on"}
            onClick={() => handleDeviceControl("recording", "录播开", 1, () => setDevices((p) => ({ ...p, recording: "on" })))}
            icon={Video}
            label="录播开"
            variant="danger"
            disabled={noRecording}
          />
          <ControlButton
            active={devices.recording === "off"}
            onClick={() => handleDeviceControl("recording", "录播关", 0, () => setDevices((p) => ({ ...p, recording: "off" })))}
            icon={VideoOff}
            label="录播关"
            disabled={noRecording}
          />
        </div>

        {/* 空调控制 */}
        <div className={cn("rounded-md bg-secondary/50 p-2", noAc && "opacity-50")}>
          <div className="mb-1.5 text-center text-xs text-muted-foreground">空调控制</div>
          <div className="grid grid-cols-4 gap-1.5">
            <ControlButton
              active={devices.ac.on}
              onClick={() => handleDeviceControl("ac", "空调开", 1, () => setDevices((p) => ({ ...p, ac: { ...p.ac, on: true } })))}
              icon={Power}
              label="开"
              variant="primary"
              disabled={noAc}
            />
            <ControlButton
              active={!devices.ac.on}
              onClick={() => handleDeviceControl("ac", "空调关", 0, () => setDevices((p) => ({ ...p, ac: { ...p.ac, on: false } })))}
              icon={PowerOff}
              label="关"
              disabled={noAc}
            />
            <ControlButton
              active={devices.ac.on && devices.ac.mode === "cool"}
              onClick={() => handleDeviceControl("ac", "空调制冷", 2, () => setDevices((p) => ({ ...p, ac: { ...p.ac, on: true, mode: "cool" } })))}
              icon={Snowflake}
              label="制冷"
              disabled={noAc}
            />
            <ControlButton
              active={devices.ac.on && devices.ac.mode === "heat"}
              onClick={() => handleDeviceControl("ac", "空调制热", 3, () => setDevices((p) => ({ ...p, ac: { ...p.ac, on: true, mode: "heat" } })))}
              icon={ThermometerSun}
              label="制热"
              disabled={noAc}
            />
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            <ControlButton
              onClick={() => handleDeviceControl("ac", "空调温度+", 4, () => setDevices((p) => ({ ...p, ac: { ...p.ac, temp: Math.min(30, p.ac.temp + 1) } })))}
              icon={Plus}
              label="温度+"
              disabled={noAc}
            />
            <ControlButton
              onClick={() => handleDeviceControl("ac", "空调温度-", 5, () => setDevices((p) => ({ ...p, ac: { ...p.ac, temp: Math.max(16, p.ac.temp - 1) } })))}
              icon={Minus}
              label="温度-"
              disabled={noAc}
            />
          </div>
        </div>

        {/* 环境控制：灯、门、窗帘 */}
        <div className="rounded-md bg-secondary/50 p-2">
          <div className="mb-1.5 text-center text-xs text-muted-foreground">环境控制</div>
          <div className="grid grid-cols-3 gap-1.5">
            <ControlButton
              active={devices.light === "on"}
              onClick={() => handleDeviceControl("light", "灯开", 1, () => setDevices((p) => ({ ...p, light: "on" })))}
              icon={Lightbulb}
              label="灯开"
              variant="primary"
              disabled={noLight}
            />
            <ControlButton
              active={devices.light === "off"}
              onClick={() => handleDeviceControl("light", "灯关", 0, () => setDevices((p) => ({ ...p, light: "off" })))}
              icon={LightbulbOff}
              label="灯关"
              disabled={noLight}
            />
            <ControlButton
              active={devices.curtain === "open"}
              onClick={() => handleDeviceControl("curtain", "帘开", 1, () => setDevices((p) => ({ ...p, curtain: "open" })))}
              icon={Blinds}
              label="帘开"
              variant="primary"
              disabled={noCurtain}
            />
            <ControlButton
              active={devices.curtain === "closed"}
              onClick={() => handleDeviceControl("curtain", "帘关", 0, () => setDevices((p) => ({ ...p, curtain: "closed" })))}
              icon={Blinds}
              label="帘关"
              disabled={noCurtain}
            />
            <ControlButton
              active={devices.door === "unlocked"}
              onClick={() => handleDeviceControl("door", "门开", 1, () => setDevices((p) => ({ ...p, door: "unlocked" })))}
              icon={DoorOpen}
              label="门开"
              variant="primary"
              disabled={noDoor}
            />
            <ControlButton
              active={devices.door === "locked"}
              onClick={() => handleDeviceControl("door", "门关", 0, () => setDevices((p) => ({ ...p, door: "locked" })))}
              icon={DoorClosed}
              label="门关"
              disabled={noDoor}
            />
          </div>
        </div>

        {/* 模式 1-4 */}
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setDevices((p) => ({ ...p, activeMode: mode }))
                toast({ title: `已切换为模式${mode}` })
              }}
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
