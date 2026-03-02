"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  LayoutGrid,
  LayoutList,
  Search,
  Power,
  PowerOff,
  Lock,
  Unlock,
  Lightbulb,
  LightbulbOff,
  MonitorPlay,
  Volume2,
  Settings,
  RefreshCw,
  CheckSquare,
  X,
  MonitorOff,
  AirVent,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
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
import { useState } from "react"

interface ClassroomToolbarProps {
  viewMode: "list" | "large"
  onViewModeChange: (mode: "list" | "large") => void
  filterStatus: string[]
  onFilterStatusChange: (status: string[]) => void
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  isMultiSelectMode: boolean
  onMultiSelectModeChange: (enabled: boolean) => void
  selectedClassrooms: string[]
  onClearSelection: () => void
}

export function ClassroomToolbar({
  viewMode,
  onViewModeChange,
  filterStatus,
  onFilterStatusChange,
  searchQuery,
  onSearchQueryChange,
  isMultiSelectMode,
  onMultiSelectModeChange,
  selectedClassrooms,
  onClearSelection,
}: ClassroomToolbarProps) {
  const [showBatchDialog, setShowBatchDialog] = useState(false)
  const [batchAction, setBatchAction] = useState<string>("")

  const toggleFilter = (status: string) => {
    if (filterStatus.includes(status)) {
      onFilterStatusChange(filterStatus.filter((s) => s !== status))
    } else {
      onFilterStatusChange([...filterStatus, status])
    }
  }

  const handleBatchAction = (action: string) => {
    if (selectedClassrooms.length === 0) {
      alert("请先选择教室")
      return
    }
    setBatchAction(action)
    setShowBatchDialog(true)
  }

  const executeBatchAction = () => {
    console.log(`[v0] Executing ${batchAction} on ${selectedClassrooms.length} classrooms`)
    setShowBatchDialog(false)
    // Reset selection after action
    onClearSelection()
    onMultiSelectModeChange(false)
  }

  const actionLabels: Record<string, string> = {
    "class-start": "上课",
    "class-end": "下课",
    lock: "锁定面板",
    unlock: "解锁面板",
    "lights-on": "开启灯光",
    "lights-off": "关闭灯光",
    "projector-on": "开启投影",
    "projector-off": "关闭投影",
    "computer-on": "开启电脑",
    "computer-off": "关闭电脑",
    "ac-on": "开启空调",
    "ac-off": "关闭空调",
    "speaker-on": "开启功放",
  }

  return (
    <>
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="p-4 space-y-4">
          {/* View Mode & Quick Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-0.5 p-0.5 bg-secondary/50 rounded-lg border border-border">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange("list")}
                  className="h-8 w-8 p-0"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "large" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange("large")}
                  className="h-8 w-8 p-0"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>

              <div className="h-6 w-px bg-border" />

              {/* Status Filters */}
              <div className="flex items-center gap-2">
                <Badge
                  variant={filterStatus.includes("in-class") ? "default" : "outline"}
                  className="cursor-pointer hover:bg-info hover:text-white transition-colors"
                  style={filterStatus.includes("in-class") ? { backgroundColor: "oklch(0.65 0.19 230)" } : {}}
                  onClick={() => toggleFilter("in-class")}
                >
                  上课中
                </Badge>
                <Badge
                  variant={filterStatus.includes("idle") ? "default" : "outline"}
                  className="cursor-pointer hover:bg-success hover:text-white transition-colors"
                  style={filterStatus.includes("idle") ? { backgroundColor: "oklch(0.65 0.18 145)" } : {}}
                  onClick={() => toggleFilter("idle")}
                >
                  空闲
                </Badge>
                <Badge
                  variant={filterStatus.includes("fault") ? "default" : "outline"}
                  className="cursor-pointer hover:bg-destructive hover:text-white transition-colors"
                  style={filterStatus.includes("fault") ? { backgroundColor: "oklch(0.55 0.22 25)" } : {}}
                  onClick={() => toggleFilter("fault")}
                >
                  故障
                </Badge>
                <Badge
                  variant={filterStatus.includes("offline") ? "default" : "outline"}
                  className="cursor-pointer hover:bg-muted-foreground hover:text-white transition-colors"
                  style={filterStatus.includes("offline") ? { backgroundColor: "oklch(0.4 0 0)" } : {}}
                  onClick={() => toggleFilter("offline")}
                >
                  离线
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isMultiSelectMode ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                    onClick={() => onMultiSelectModeChange(true)}
                  >
                    <CheckSquare className="h-4 w-4" />
                    批量选择
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Settings className="h-4 w-4" />
                        快捷操作
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>课堂控制</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Power className="h-4 w-4 mr-2" />
                        全部上课
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <PowerOff className="h-4 w-4 mr-2" />
                        全部下课
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>面板控制</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Lock className="h-4 w-4 mr-2" />
                        全部锁定
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Unlock className="h-4 w-4 mr-2" />
                        全部解锁
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>设备控制</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Lightbulb className="h-4 w-4 mr-2" />
                        全部开灯
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <LightbulbOff className="h-4 w-4 mr-2" />
                        全部关灯
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MonitorPlay className="h-4 w-4 mr-2" />
                        全部开启投影
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
                    <CheckSquare className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">已选择 {selectedClassrooms.length} 间教室</span>
                  </div>

                  {selectedClassrooms.length > 0 && (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="default" size="sm" className="gap-2">
                            <Settings className="h-4 w-4" />
                            批量操作
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>课堂控制</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleBatchAction("class-start")}>
                            <Power className="h-4 w-4 mr-2" />
                            上课
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBatchAction("class-end")}>
                            <PowerOff className="h-4 w-4 mr-2" />
                            下课
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>面板控制</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleBatchAction("lock")}>
                            <Lock className="h-4 w-4 mr-2" />
                            锁定面板
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBatchAction("unlock")}>
                            <Unlock className="h-4 w-4 mr-2" />
                            解锁面板
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>设备控制</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleBatchAction("lights-on")}>
                            <Lightbulb className="h-4 w-4 mr-2" />
                            开启灯光
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBatchAction("lights-off")}>
                            <LightbulbOff className="h-4 w-4 mr-2" />
                            关闭灯光
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBatchAction("projector-on")}>
                            <MonitorPlay className="h-4 w-4 mr-2" />
                            开启投影
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBatchAction("projector-off")}>
                            <MonitorOff className="h-4 w-4 mr-2" />
                            关闭投影
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBatchAction("computer-on")}>
                            <MonitorPlay className="h-4 w-4 mr-2" />
                            开启电脑
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBatchAction("computer-off")}>
                            <MonitorOff className="h-4 w-4 mr-2" />
                            关闭电脑
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBatchAction("ac-on")}>
                            <AirVent className="h-4 w-4 mr-2" />
                            开启空调
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBatchAction("ac-off")}>
                            <AirVent className="h-4 w-4 mr-2" />
                            关闭空调
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBatchAction("speaker-on")}>
                            <Volume2 className="h-4 w-4 mr-2" />
                            开启功放
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      onMultiSelectModeChange(false)
                      onClearSelection()
                    }}
                  >
                    <X className="h-4 w-4" />
                    取消
                  </Button>
                </>
              )}

              <Button variant="ghost" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索教室 / 教师 / 课程"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="pl-9 bg-secondary/30 border-border"
            />
          </div>
        </div>
      </div>

      <AlertDialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认批量操作</AlertDialogTitle>
            <AlertDialogDescription>
              您即将对 <span className="font-semibold text-foreground">{selectedClassrooms.length}</span> 间教室执行
              <span className="font-semibold text-foreground">"{actionLabels[batchAction]}"</span> 操作，是否继续？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={executeBatchAction}>确认执行</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
