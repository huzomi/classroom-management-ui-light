"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Clock, Repeat, Zap, Play, Trash2, Copy, Edit, Hand, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export default function TaskManagementPage() {
  const [taskFilter, setTaskFilter] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [taskType, setTaskType] = useState<"manual" | "auto">("auto")
  const [scheduleType, setScheduleType] = useState<"daily" | "weekly" | "follow-schedule">("daily")
  const [actionType, setActionType] = useState<"control" | "inspection">("control")

  const tasks = [
    {
      id: 1,
      name: "早晨设备预热",
      type: "auto" as const,
      time: "07:30",
      repeat: "工作日",
      actions: ["开启投影", "开启电脑", "开启空调"],
      enabled: true,
      nextRun: "2024-12-30 07:30",
      lastRun: "2024-12-29 07:30",
      status: "success",
      actionType: "control",
    },
    {
      id: 2,
      name: "晚间设备关闭",
      type: "auto" as const,
      time: "22:00",
      repeat: "每天",
      actions: ["关闭投影", "关闭电脑", "关闭灯光", "关闭空调"],
      enabled: true,
      nextRun: "2024-12-29 22:00",
      lastRun: "2024-12-28 22:00",
      status: "success",
      actionType: "control",
    },
    {
      id: 3,
      name: "周末巡检",
      type: "auto" as const,
      time: "09:00",
      repeat: "周末",
      actions: ["设备自检", "环境监测"],
      enabled: false,
      nextRun: "2024-12-30 09:00",
      lastRun: "2024-12-28 09:00",
      status: "paused",
      actionType: "inspection",
    },
    {
      id: 4,
      name: "午休设备关闭",
      type: "auto" as const,
      time: "12:00",
      repeat: "工作日",
      actions: ["关闭投影", "降低空调", "关闭部分灯光"],
      enabled: true,
      nextRun: "2024-12-30 12:00",
      lastRun: "2024-12-29 12:00",
      status: "success",
      actionType: "control",
    },
    {
      id: 5,
      name: "手动检查教学设备",
      type: "manual" as const,
      time: "-",
      repeat: "手动触发",
      actions: ["设备巡检", "生成报告"],
      enabled: true,
      nextRun: "-",
      lastRun: "2024-12-28 14:30",
      status: "success",
      actionType: "inspection",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <div className="h-2 w-2 rounded-full bg-green-400"></div>
      case "error":
        return <div className="h-2 w-2 rounded-full bg-red-400"></div>
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-400"></div>
    }
  }

  const getTaskIcon = (type: "manual" | "auto") => {
    return type === "manual" ? (
      <Hand className="h-6 w-6 text-orange-400" />
    ) : (
      <Zap className="h-6 w-6 text-purple-400" />
    )
  }

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">总任务数</div>
            <div className="mt-1 text-2xl font-semibold text-foreground">{tasks.length}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">运行中</div>
            <div className="mt-1 text-2xl font-semibold text-green-400">{tasks.filter((t) => t.enabled).length}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">已暂停</div>
            <div className="mt-1 text-2xl font-semibold text-muted-foreground">
              {tasks.filter((t) => !t.enabled).length}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">今日执行</div>
            <div className="mt-1 text-2xl font-semibold text-blue-400">12</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                创建任务
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>创建新任务</DialogTitle>
                <DialogDescription>配置任务参数，实现自动化控制或巡检</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Task Type Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">任务类型</Label>
                  <Tabs value={taskType} onValueChange={(v) => setTaskType(v as "manual" | "auto")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-12">
                      <TabsTrigger value="auto" className="gap-2">
                        <Zap className="h-4 w-4" />
                        自动任务
                      </TabsTrigger>
                      <TabsTrigger value="manual" className="gap-2">
                        <Hand className="h-4 w-4" />
                        手动任务
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <p className="text-xs text-muted-foreground">
                    {taskType === "auto" ? "自动任务按设定的时间和周期自动执行" : "手动任务需要手动触发执行"}
                  </p>
                </div>

                {/* Task Name */}
                <div className="space-y-3">
                  <Label htmlFor="task-name" className="text-base font-semibold">
                    任务名称
                  </Label>
                  <Input id="task-name" placeholder="例如：早晨设备预热" className="h-10" />
                </div>

                {/* Action Type */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">动作类型</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setActionType("control")}
                      className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                        actionType === "control"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Zap className="h-6 w-6" />
                      <span className="font-medium">设备控制</span>
                      <span className="text-xs text-muted-foreground">控制设备开关状态</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionType("inspection")}
                      className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                        actionType === "inspection"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Search className="h-6 w-6" />
                      <span className="font-medium">设备巡检</span>
                      <span className="text-xs text-muted-foreground">检查设备状态和环境</span>
                    </button>
                  </div>
                </div>

                {/* Auto Task Settings */}
                {taskType === "auto" && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">执行周期</Label>
                    <Select
                      value={scheduleType}
                      onValueChange={(v) => setScheduleType(v as "daily" | "weekly" | "follow-schedule")}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="follow-schedule">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>跟随课表</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="daily">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>按日执行</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="weekly">
                          <div className="flex items-center gap-2">
                            <Repeat className="h-4 w-4" />
                            <span>按周执行</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Follow Schedule Settings */}
                    {scheduleType === "follow-schedule" && (
                      <div className="space-y-4 rounded-lg border border-primary/50 bg-primary/5 p-4">
                        <div className="space-y-3">
                          <Label className="font-medium">触发时机</Label>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 rounded-md border border-border bg-background p-3">
                              <Checkbox id="before-class" defaultChecked />
                              <Label htmlFor="before-class" className="flex-1 font-normal cursor-pointer">
                                上课前触发
                              </Label>
                              <Input type="number" className="w-16 h-8" placeholder="5" defaultValue="5" />
                              <span className="text-sm text-muted-foreground">分钟</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-md border border-border bg-background p-3">
                              <Checkbox id="after-class" />
                              <Label htmlFor="after-class" className="flex-1 font-normal cursor-pointer">
                                下课后触发
                              </Label>
                              <Input type="number" className="w-16 h-8" placeholder="5" defaultValue="5" />
                              <span className="text-sm text-muted-foreground">分钟</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label className="font-medium">应用教室</Label>
                          <Select defaultValue="all">
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="选择教室范围" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">全部教室</SelectItem>
                              <SelectItem value="building">指定教学楼</SelectItem>
                              <SelectItem value="floor">指定楼层</SelectItem>
                              <SelectItem value="custom">自定义选择</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Daily Settings */}
                    {scheduleType === "daily" && (
                      <div className="space-y-4 rounded-lg border border-primary/50 bg-primary/5 p-4">
                        <div className="space-y-3">
                          <Label htmlFor="daily-time" className="font-medium">
                            执行时间
                          </Label>
                          <Input id="daily-time" type="time" defaultValue="07:30" className="h-10" />
                        </div>
                        <div className="space-y-3">
                          <Label className="font-medium">重复日期</Label>
                          <div className="grid grid-cols-7 gap-2">
                            {["一", "二", "三", "四", "五", "六", "日"].map((day, idx) => (
                              <div key={day} className="flex flex-col items-center gap-2">
                                <Checkbox id={`day-${idx}`} defaultChecked={idx < 5} />
                                <Label htmlFor={`day-${idx}`} className="text-xs font-normal cursor-pointer">
                                  周{day}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Weekly Settings */}
                    {scheduleType === "weekly" && (
                      <div className="space-y-4 rounded-lg border border-primary/50 bg-primary/5 p-4">
                        <div className="space-y-3">
                          <Label htmlFor="weekly-time" className="font-medium">
                            执行时间
                          </Label>
                          <Input id="weekly-time" type="time" defaultValue="09:00" className="h-10" />
                        </div>
                        <div className="space-y-3">
                          <Label className="font-medium">星期选择</Label>
                          <Select defaultValue="1">
                            <SelectTrigger className="h-10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">每周一</SelectItem>
                              <SelectItem value="2">每周二</SelectItem>
                              <SelectItem value="3">每周三</SelectItem>
                              <SelectItem value="4">每周四</SelectItem>
                              <SelectItem value="5">每周五</SelectItem>
                              <SelectItem value="6">每周六</SelectItem>
                              <SelectItem value="0">每周日</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions Configuration - Only for Control Type */}
                {actionType === "control" && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">执行动作</Label>
                    <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                      <div className="grid gap-3">
                        <div className="flex items-center gap-3 rounded-md border border-primary/50 bg-primary/5 p-3">
                          <Checkbox id="class-control" />
                          <Label htmlFor="class-control" className="flex-1 font-normal cursor-pointer">
                            上下课
                          </Label>
                          <Select defaultValue="open">
                            <SelectTrigger className="w-28 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">开启</SelectItem>
                              <SelectItem value="close">关闭</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="my-2 border-t border-border"></div>
                        {[
                          { id: "projector", label: "投影仪", options: ["开启", "关闭"] },
                          { id: "computer", label: "电脑", options: ["开启", "关闭"] },
                          { id: "lights", label: "灯光", options: ["开启", "关闭"] },
                          { id: "ac", label: "空调", options: ["开启", "关闭", "24°C", "26°C"] },
                          { id: "amplifier", label: "功放", options: ["开启", "关闭"] },
                        ].map((device) => (
                          <div
                            key={device.id}
                            className="flex items-center gap-3 rounded-md border border-border bg-background p-3"
                          >
                            <Checkbox id={device.id} />
                            <Label htmlFor={device.id} className="flex-1 font-normal cursor-pointer">
                              {device.label}
                            </Label>
                            <Select defaultValue={device.options[0]}>
                              <SelectTrigger className="w-28 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {device.options.map((opt) => (
                                  <SelectItem key={opt} value={opt.toLowerCase()}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Inspection Configuration - Only for Inspection Type */}
                {actionType === "inspection" && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">巡检项目</Label>
                    <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
                      {[
                        { id: "status", label: "设备状态检查", description: "检查设备在线状态和运行情况" },
                        { id: "environment", label: "环境监测", description: "温度、湿度、PM2.5等环境数据" },
                        { id: "report", label: "生成报告", description: "自动生成巡检报告" },
                        { id: "alert", label: "异常告警", description: "发现异常自动发送告警" },
                      ].map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 rounded-md border border-border bg-background p-3"
                        >
                          <Checkbox id={item.id} className="mt-0.5" defaultChecked />
                          <div className="flex-1">
                            <Label htmlFor={item.id} className="font-normal cursor-pointer">
                              {item.label}
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Apply to Classrooms */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">应用教室</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="选择应用范围" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部教室</SelectItem>
                      <SelectItem value="building-1">第一教学楼</SelectItem>
                      <SelectItem value="building-2">第二教学楼</SelectItem>
                      <SelectItem value="building-3">实验楼</SelectItem>
                      <SelectItem value="floor-1">第一教学楼 1层</SelectItem>
                      <SelectItem value="floor-2">第一教学楼 2层</SelectItem>
                      <SelectItem value="custom">自定义选择教室</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {actionType === "control" ? "任务将控制选定范围内的所有教室设备" : "任务将巡检选定范围内的所有教室"}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  取消
                </Button>
                <Button onClick={() => setShowCreateDialog(false)}>
                  <Plus className="mr-2 h-4 w-4" />
                  创建任务
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="搜索任务..." className="pl-10" />
          </div>
          <Select value={taskFilter} onValueChange={setTaskFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="任务状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部任务</SelectItem>
              <SelectItem value="enabled">运行中</SelectItem>
              <SelectItem value="disabled">已暂停</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-purple-500/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-1 items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                      task.type === "manual" ? "bg-orange-500/10" : "bg-purple-500/10"
                    }`}
                  >
                    {getTaskIcon(task.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-foreground">{task.name}</h3>
                      <Badge variant="outline">{task.type === "manual" ? "手动任务" : "自动任务"}</Badge>
                      <Badge variant={task.enabled ? "default" : "secondary"}>
                        {task.enabled ? "运行中" : "已暂停"}
                      </Badge>
                      {getStatusIcon(task.status)}
                    </div>

                    <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>执行时间: {task.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Repeat className="h-4 w-4" />
                        <span>循环: {task.repeat}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>类型: {task.actionType === "control" ? "设备控制" : "设备巡检"}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {task.actions.map((action, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>

                    {task.type === "auto" && (
                      <div className="mt-3 flex gap-6 text-xs text-muted-foreground">
                        <span>下次执行: {task.nextRun}</span>
                        <span>上次执行: {task.lastRun}</span>
                      </div>
                    )}
                    {task.type === "manual" && (
                      <div className="mt-3 flex gap-6 text-xs text-muted-foreground">
                        <span>上次执行: {task.lastRun}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {task.type === "auto" && <Switch checked={task.enabled} />}
                  <Button size="sm" variant="ghost" title="立即执行">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="复制任务">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="编辑任务">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="删除任务">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
