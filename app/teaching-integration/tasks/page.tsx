"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  Clock,
  Repeat,
  Zap,
  Play,
  Trash2,
  Copy,
  Edit,
  Hand,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  getTaskNum,
  getTaskPage,
  deleteTask,
  executeTask,
  reactiveTask,
  type TaskDataVO,
  type TaskVO,
} from "@/lib/api/task"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { TaskLogModal } from "./components/task-log-modal"

const TASK_TYPE_MAP: Record<string, string> = {
  device_control: "设备控制",
  inspection: "设备巡检",
  control: "设备控制",
  patrol: "设备巡检",
}

function getTaskTypeText(type?: string): string {
  return (type && TASK_TYPE_MAP[type]) || type || "-"
}

export default function TaskManagementPage() {
  const [statistics, setStatistics] = useState<TaskDataVO | null>(null)
  const [taskList, setTaskList] = useState<TaskVO[]>([])
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<TaskVO | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [logModalOpen, setLogModalOpen] = useState(false)
  const [logTaskId, setLogTaskId] = useState<string | null>(null)
  const [logTaskName, setLogTaskName] = useState<string>("")

  const loadStatistics = useCallback(async () => {
    try {
      const data = await getTaskNum()
      setStatistics(data ?? null)
    } catch (err) {
      console.error("加载统计数据失败:", err)
    }
  }, [])

  const loadTaskList = useCallback(async (taskName?: string) => {
    setLoading(true)
    try {
      const records = await getTaskPage({
        page: 1,
        pageSize: 100,
        name: taskName?.trim() || undefined,
      })
      setTaskList(records)
    } catch (err) {
      console.error("加载任务列表失败:", err)
      setTaskList([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStatistics()
  }, [loadStatistics])

  useEffect(() => {
    loadTaskList()
  }, [loadTaskList])

  const handleSearch = () => {
    loadTaskList(searchKeyword || undefined)
  }

  const handleEdit = (task: TaskVO) => {
    window.location.href = `/teaching-integration/tasks/create?id=${task.id}`
  }

  const handleDelete = async (task: TaskVO) => {
    setActionLoading(task.id)
    try {
      await deleteTask([task.id])
      setDeleteTarget(null)
      toast({ title: "删除成功" })
      await loadTaskList(searchKeyword || undefined)
      await loadStatistics()
    } catch (err) {
      console.error("删除失败:", err)
      toast({ title: "删除失败", variant: "destructive" })
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleTask = async (task: TaskVO) => {
    const nextStatus = task.status === 1 ? 0 : 1
    setActionLoading(task.id)
    try {
      await reactiveTask(task.id, nextStatus as 0 | 1)
      toast({ title: nextStatus === 1 ? "任务已启用" : "任务已暂停" })
      await loadTaskList(searchKeyword || undefined)
      await loadStatistics()
    } catch (err) {
      console.error("更新任务状态失败:", err)
      toast({ title: "更新状态失败", variant: "destructive" })
    } finally {
      setActionLoading(null)
    }
  }

  const handleExecuteTask = async (task: TaskVO) => {
    setActionLoading(task.id)
    try {
      await executeTask(task.id)
      toast({ title: "执行成功" })
      await loadTaskList(searchKeyword || undefined)
      await loadStatistics()
    } catch (err) {
      console.error("执行任务失败:", err)
      toast({ title: "执行失败", variant: "destructive" })
    } finally {
      setActionLoading(null)
    }
  }

  const handleCopyTask = (task: TaskVO) => {
    const params = new URLSearchParams()
    params.set("copy", task.id)
    params.set("name", `${task.taskName ?? ""}_副本`)
    window.location.href = `/teaching-integration/tasks/create?${params.toString()}`
  }

  const handleViewLog = (task: TaskVO) => {
    setLogTaskId(task.id)
    setLogTaskName(task.taskName ?? "")
    setLogModalOpen(true)
  }

  const taskMode = (t: TaskVO) => (t.taskType === "manual" ? "manual" : "auto")
  const actions = (t: TaskVO) => t.taskTypeVOS?.map((x) => x.name).filter(Boolean) ?? []
  const executeTime = (t: TaskVO) => t.taskHour ?? "-"
  const cycle = (t: TaskVO) => t.taskCycle ?? "-"
  const lastExecuteTime = (t: TaskVO) => t.lastActiveTime ?? null

  return (
    <main className="flex-1 overflow-auto p-6 bg-muted/30 min-h-full">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-sky-400 text-white shadow-md">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">总任务数</div>
              <div className="text-2xl font-bold text-foreground">{statistics?.all ?? "—"}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md">
              <Play className="h-7 w-7" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">运行中</div>
              <div className="text-2xl font-bold text-green-600">{statistics?.active ?? "—"}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-yellow-400 text-white shadow-md">
              <Clock className="h-7 w-7" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">暂停中</div>
              <div className="text-2xl font-bold text-muted-foreground">{statistics?.disable ?? "—"}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-md">
              <Calendar className="h-7 w-7" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">需要执行</div>
              <div className="text-2xl font-bold text-muted-foreground">{statistics?.today ?? "—"}</div>
            </div>
          </div>
        </div>

        {/* 任务列表 */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-xl font-semibold text-foreground">任务列表</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex w-60">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="请输入任务名称"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-9 pr-4"
                />
                <Button variant="secondary" size="sm" className="ml-2 shrink-0" onClick={handleSearch}>
                  搜索
                </Button>
              </div>
              <Button asChild>
                <Link href="/teaching-integration/tasks/create">
                  <Plus className="mr-2 h-4 w-4" />
                  新增任务
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : taskList.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">暂无任务</div>
            ) : (
              taskList.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md hover:-translate-y-0.5",
                    taskMode(task) === "auto" && "border-l-4 border-l-blue-500",
                    taskMode(task) === "manual" && "border-l-4 border-l-orange-500"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-lg shadow-md",
                      taskMode(task) === "auto"
                        ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white"
                        : "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                    )}
                  >
                    {taskMode(task) === "auto" ? (
                      <Zap className="h-6 w-6" />
                    ) : (
                      <Hand className="h-6 w-6" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-foreground">{task.taskName}</h4>
                      {task.description && (
                        <div
                          className="max-w-full truncate text-xs text-muted-foreground"
                          title={task.description}
                        >
                          {task.description}
                        </div>
                      )}
                      <Badge
                        variant="outline"
                        className={taskMode(task) === "auto" ? "border-blue-500/50 text-blue-600" : "border-orange-500/50 text-orange-600"}
                      >
                        {taskMode(task) === "auto" ? "自动任务" : "手动任务"}
                      </Badge>
                    </div>

                    <div className="mb-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>执行时间: {executeTime(task)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Repeat className="h-4 w-4" />
                        <span>循环: {cycle(task)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>类型: {getTaskTypeText(task.taskTypeVOS?.[0]?.taskType ?? task.taskType)}</span>
                      </div>
                    </div>

                    {actions(task).length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {actions(task).map((action, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs font-normal">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {lastExecuteTime(task) && (
                      <div className="text-xs text-muted-foreground">上次执行: {lastExecuteTime(task)}</div>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1 border-l border-border pl-4">
                    {taskMode(task) === "auto" && (
                      <Switch
                        checked={task.status === 1}
                        onCheckedChange={() => handleToggleTask(task)}
                        disabled={actionLoading === task.id}
                      />
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      title="立即执行"
                      onClick={() => handleExecuteTask(task)}
                      disabled={actionLoading === task.id}
                    >
                      {actionLoading === task.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      title="查看日志"
                      onClick={() => handleViewLog(task)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      title="复制任务"
                      onClick={() => handleCopyTask(task)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      title="编辑任务"
                      onClick={() => handleEdit(task)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title="删除任务"
                      onClick={() => setDeleteTarget(task)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 任务日志弹窗 */}
      <TaskLogModal
        open={logModalOpen}
        onOpenChange={setLogModalOpen}
        taskId={logTaskId}
        taskName={logTaskName}
      />

      {/* 删除确认 */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定删除该任务吗？</AlertDialogTitle>
            <AlertDialogDescription>
              删除后无法恢复，请谨慎操作。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
