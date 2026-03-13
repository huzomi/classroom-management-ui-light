"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Clock, Repeat, Zap, Hand, Calendar, ArrowLeft, Info, CheckCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { taskEdit } from "@/lib/api/task"
import { getJoinLabelList, type EDUJoinnumLabelVO } from "@/lib/api/joinLabel"
import { BuildingTree, getAllRoomIds, type TreeNode } from "@/components/classroom/building-tree"
import { cn } from "@/lib/utils"

function getCurrentTime(): string {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
}

function mapButtonStatusToCommand(buttonStatus: string, buttonStatusList: string[]): number {
  const idx = buttonStatusList.indexOf(buttonStatus)
  if (idx === -1) return 1
  if (buttonStatusList.length === 1) return 1
  if (buttonStatusList.length === 2) return idx === 0 ? 0 : 1
  if (buttonStatusList.length >= 3) return idx
  return idx === 0 ? 0 : 1
}

interface ActionItem {
  id: string
  label: string
  joinnumLabelId: string
  joinNum: number
  checked: boolean
  command: number
  buttonStatus: string
  buttonStatusList: string[]
  hasNumInput: boolean
  numValue: number
  taskType: "control" | "patrol"
}

const WEEKDAYS = [
  { label: "周一", value: "monday" },
  { label: "周二", value: "tuesday" },
  { label: "周三", value: "wednesday" },
  { label: "周四", value: "thursday" },
  { label: "周五", value: "friday" },
  { label: "周六", value: "saturday" },
  { label: "周日", value: "sunday" },
] as const

const WEEKDAY_TO_CRON: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

export default function CreateTaskPage() {
  const router = useRouter()
  const [taskMode, setTaskMode] = useState<"auto" | "manual">("auto")
  const [actionType, setActionType] = useState<"device_control" | "inspection">("device_control")
  const [cycleType, setCycleType] = useState<"daily" | "weekly" | "class_time">("daily")
  const [taskName, setTaskName] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState(1)
  const [executeTime, setExecuteTime] = useState(getCurrentTime())
  const [selectedWeekday, setSelectedWeekday] = useState<string>("monday")
  const [classTimePoint, setClassTimePoint] = useState<"class_start" | "class_end">("class_start")
  const [availableActions, setAvailableActions] = useState<ActionItem[]>([])
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([])
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [submitting, setSubmitting] = useState(false)

  const loadDeviceList = useCallback(async () => {
    try {
      const list = await getJoinLabelList({ pageSize: 2000 })
      const actions: ActionItem[] = list.map((d: EDUJoinnumLabelVO) => {
        const buttonStatusList = (d.buttonStatusList ?? ["关", "开"]).map(String)
        const hasNumInput = buttonStatusList.includes("NUM")
        const defaultStatus = hasNumInput ? "NUM" : buttonStatusList[buttonStatusList.length - 1] ?? "开"
        const deviceTaskType = d.taskType === "patrol" ? "patrol" : "control"
        return {
          id: String(d.id),
          label: d.equipmentName ?? `设备${d.joinNum ?? 0}`,
          joinnumLabelId: String(d.id),
          joinNum: d.joinNum ?? 0,
          checked: false,
          command: hasNumInput ? 1 : mapButtonStatusToCommand(defaultStatus, buttonStatusList),
          buttonStatus: defaultStatus,
          buttonStatusList,
          hasNumInput,
          numValue: 0,
          taskType: deviceTaskType,
        }
      })
      setAvailableActions(actions)
    } catch (err) {
      console.error("加载设备列表失败:", err)
    }
  }, [])

  useEffect(() => {
    loadDeviceList()
  }, [loadDeviceList])

  const handleTreeLoaded = useCallback((tree: TreeNode[]) => {
    setTreeData(tree)
  }, [])

  const allRoomIds = getAllRoomIds(treeData)

  const handleModeChange = (mode: "auto" | "manual") => {
    setTaskMode(mode)
    if (mode === "manual") {
      setCycleType("daily")
    } else {
      setCycleType("daily")
      setExecuteTime(getCurrentTime())
    }
  }

  const handleCycleChange = (cycle: "daily" | "weekly" | "class_time") => {
    setCycleType(cycle)
    if (cycle === "daily" || cycle === "weekly") {
      setExecuteTime(getCurrentTime())
    }
    if (cycle === "weekly") {
      setSelectedWeekday("monday")
    }
    if (cycle === "class_time") {
      setClassTimePoint("class_start")
    }
  }

  const handleActionCheckChange = (action: ActionItem) => {
    if (!action.checked) {
      const defaultStatus = action.hasNumInput ? "NUM" : (action.buttonStatusList[action.buttonStatusList.length - 1] ?? "开")
      action.buttonStatus = defaultStatus
      action.command = action.hasNumInput ? 1 : mapButtonStatusToCommand(defaultStatus, action.buttonStatusList)
      if (action.hasNumInput) action.numValue = 0
    }
    setAvailableActions([...availableActions])
  }

  const handleButtonStatusChange = (action: ActionItem, buttonStatus: string) => {
    action.buttonStatus = buttonStatus
    action.command = mapButtonStatusToCommand(buttonStatus, action.buttonStatusList)
    setAvailableActions([...availableActions])
  }

  const handleSubmit = async () => {
    if (!taskName.trim()) return
    const checkedActions = availableActions.filter((a) => a.checked)
    if (checkedActions.length === 0) {
      alert("请至少选择一个执行动作")
      return
    }

    setSubmitting(true)
    try {
      let taskCycle = ""
      let taskHour = ""
      let cronSpec = ""
      let cronConfig = ""

      if (taskMode === "auto") {
        if (cycleType === "daily") {
          cronSpec = "day"
          taskHour = executeTime
          taskCycle = `每天 ${taskHour} 点`
          const [hour, minute] = taskHour.split(":")
          cronConfig = `0 ${minute} ${hour} * * *`
        } else if (cycleType === "weekly") {
          cronSpec = "week"
          taskHour = executeTime
          const dayName = WEEKDAYS.find((d) => d.value === selectedWeekday)?.label ?? "周一"
          taskCycle = `${dayName} ${taskHour} 点`
          const [hour, minute] = taskHour.split(":")
          const dayOfWeek = WEEKDAY_TO_CRON[selectedWeekday] ?? 1
          cronConfig = `0 ${minute} ${hour} * * ${dayOfWeek}`
        } else if (cycleType === "class_time") {
          if (classTimePoint === "class_start") {
            cronSpec = "timetable_before"
            cronConfig = "timetable_before"
            taskCycle = "按照课表时间上课执行"
          } else {
            cronSpec = "timetable_after"
            cronConfig = "timetable_after"
            taskCycle = "按照课表时间下课执行"
          }
          taskHour = ""
        }
      } else {
        taskCycle = "手动触发"
      }

      const taskTypeDOS = checkedActions.map((action) => {
        let command = action.command
        let value: string | undefined
        if (action.hasNumInput && action.buttonStatus === "NUM") {
          command = 1
          value = String(action.numValue ?? 0)
        } else {
          command = mapButtonStatusToCommand(action.buttonStatus, action.buttonStatusList)
        }
        return {
          joinnum: action.joinNum,
          joinnumLabelId: action.joinnumLabelId,
          command,
          name: action.label,
          taskType: action.taskType === "patrol" ? "patrol" : "control",
          value,
        }
      })

      const payload: Parameters<typeof taskEdit>[0] = {
        taskName: taskName.trim(),
        taskType: taskMode,
        taskCycle,
        cronSpec,
        cronConfig,
        description: description.trim() || undefined,
        status,
        taskHour: taskHour || undefined,
        taskDay: cycleType === "weekly" ? 2 : cycleType === "daily" ? 1 : 0,
        roomIds: selectedRoomIds,
        taskTypeDOS,
      }

      await taskEdit(payload)
      router.push("/teaching-integration/tasks")
    } catch (err) {
      console.error("创建任务失败:", err)
      setSubmitting(false)
    }
  }

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/teaching-integration/tasks">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">创建新任务</h1>
            <p className="mt-1 text-sm text-muted-foreground">配置任务参数，实现自动化控制或巡检</p>
          </div>
        </div>

        <div className="space-y-6 rounded-lg border border-border bg-card p-6">
          {/* 是否启用 */}
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">是否启用</Label>
            <div className="flex items-center gap-3">
              <Switch checked={status === 1} onCheckedChange={(c) => setStatus(c ? 1 : 0)} />
              <span className="text-sm text-muted-foreground">{status === 1 ? "启用" : "暂停"}</span>
            </div>
          </div>

          {/* 任务类型 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">任务类型</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleModeChange("auto")}
                className={cn(
                  "flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all",
                  taskMode === "auto" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-500">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">自动任务</div>
                  <div className="text-xs text-muted-foreground">自动任务按设定的时间和周期自动执行</div>
                </div>
                {taskMode === "auto" && <CheckCircle className="h-5 w-5 shrink-0 text-primary" />}
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("manual")}
                className={cn(
                  "flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all",
                  taskMode === "manual" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/20 text-orange-500">
                  <Hand className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">手动任务</div>
                  <div className="text-xs text-muted-foreground">需要手动触发执行</div>
                </div>
                {taskMode === "manual" && <CheckCircle className="h-5 w-5 shrink-0 text-primary" />}
              </button>
            </div>
          </div>

          {/* 任务名称 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">任务名称</Label>
            <Input
              placeholder="例如：早晨设备预热"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="h-10"
            />
          </div>

          {/* 任务描述 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">任务描述</Label>
            <Textarea
              placeholder="请输入任务描述"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={200}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">{description.length}/200</p>
          </div>

          {/* 动作类型 - 仅自动任务 */}
          {taskMode === "auto" && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">动作类型</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setActionType("device_control")}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all",
                    actionType === "device_control" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-500">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">设备控制</div>
                    <div className="text-xs text-muted-foreground">控制设备开关状态</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActionType("inspection")}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all",
                    actionType === "inspection" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-500">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">设备巡检</div>
                    <div className="text-xs text-muted-foreground">检查设备状态和环境</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 执行周期 - 仅自动任务 */}
          {taskMode === "auto" && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">执行周期</Label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleCycleChange("daily")}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all",
                    cycleType === "daily" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-pink-200/80 text-pink-600">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium">按日执行</div>
                    <div className="text-xs text-muted-foreground">每天固定时间执行</div>
                  </div>
                  {cycleType === "daily" && <CheckCircle className="ml-auto h-5 w-5 shrink-0 text-primary" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleCycleChange("weekly")}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all",
                    cycleType === "weekly" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-200/80 text-cyan-600">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium">按周执行</div>
                    <div className="text-xs text-muted-foreground">每周指定日期执行</div>
                  </div>
                  {cycleType === "weekly" && <CheckCircle className="ml-auto h-5 w-5 shrink-0 text-primary" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleCycleChange("class_time")}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all",
                    cycleType === "class_time" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-200/80 text-orange-600">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium">按课表执行</div>
                    <div className="text-xs text-muted-foreground">根据上课下课时间执行</div>
                  </div>
                  {cycleType === "class_time" && <CheckCircle className="ml-auto h-5 w-5 shrink-0 text-primary" />}
                </button>
              </div>
            </div>
          )}

          {/* 执行时间配置 */}
          {taskMode === "auto" && (
            <div className="space-y-3">
              {cycleType === "daily" && (
                <>
                  <Label className="text-base font-semibold">执行时间</Label>
                  <Input
                    type="time"
                    value={executeTime}
                    onChange={(e) => setExecuteTime(e.target.value)}
                    className="h-10 w-full max-w-xs"
                  />
                </>
              )}
              {cycleType === "weekly" && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">重复日期</Label>
                    <div className="flex flex-wrap gap-2">
                      {WEEKDAYS.map((d) => (
                        <Button
                          key={d.value}
                          type="button"
                          variant={selectedWeekday === d.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedWeekday(d.value)}
                        >
                          {d.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">执行时间</Label>
                    <Input
                      type="time"
                      value={executeTime}
                      onChange={(e) => setExecuteTime(e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
              )}
              {cycleType === "class_time" && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">课表时间点</Label>
                  <Select value={classTimePoint} onValueChange={(v) => setClassTimePoint(v as "class_start" | "class_end")}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class_start">上课</SelectItem>
                      <SelectItem value="class_end">下课</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* 执行动作 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">执行动作</Label>
            <div className="max-h-[300px] space-y-2 overflow-y-auto rounded-lg border border-border bg-muted/30 p-4">
              {availableActions.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">加载设备列表中...</div>
              ) : (
                availableActions.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center gap-3 rounded-md border border-border bg-background p-3"
                  >
                    <Checkbox
                      checked={action.checked}
                      onCheckedChange={(c) => {
                        action.checked = !!c
                        handleActionCheckChange(action)
                      }}
                    />
                    <span className="flex-1 text-sm">{action.label}</span>
                    {action.hasNumInput && action.checked ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={action.numValue}
                          onChange={(e) => {
                            action.numValue = parseInt(e.target.value, 10) || 0
                            setAvailableActions([...availableActions])
                          }}
                          disabled={!action.checked}
                          className="h-8 w-24"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    ) : (
                      <Select
                        value={action.buttonStatus}
                        onValueChange={(v) => handleButtonStatusChange(action, v)}
                        disabled={!action.checked}
                      >
                        <SelectTrigger className="h-8 w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {action.buttonStatusList.filter((s) => s !== "NUM").map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 应用教室 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">应用教室</Label>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <BuildingTree
                title="选择教室"
                selectedRoomIds={selectedRoomIds}
                onRoomSelectionChange={setSelectedRoomIds}
                onTreeLoaded={handleTreeLoaded}
              />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
              <Info className="h-4 w-4 shrink-0" />
              <span>
                已选择 <strong>{selectedRoomIds.length}</strong> 个教室，任务将控制选定范围内的所有教室设备
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" asChild>
            <Link href="/teaching-integration/tasks">取消</Link>
          </Button>
          <Button onClick={handleSubmit} disabled={!taskName.trim() || submitting}>
            <Plus className="mr-2 h-4 w-4" />
            {submitting ? "创建中..." : "创建任务"}
          </Button>
        </div>
      </div>
    </main>
  )
}
