"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  Calendar,
  MapPin,
  User,
  BookOpen,
  Power,
  Settings,
  Download,
  Upload,
  Move,
  X,
  Check,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

type CourseData = {
  id: string
  classroom: string
  course: string
  teacher: string
  building: string
  status?: "scheduled" | "in-class" | "completed"
}

export default function ScheduleManagementPage() {
  const [linkageEnabled, setLinkageEnabled] = useState(true)
  const [selectedBuilding, setSelectedBuilding] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null)
  const [targetDay, setTargetDay] = useState("")
  const [targetPeriod, setTargetPeriod] = useState("")
  const currentWeek = 12

  const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  const periods = [
    { id: 1, name: "第1节", time: "08:00-08:45" },
    { id: 2, name: "第2节", time: "08:55-09:40" },
    { id: 3, name: "第3节", time: "10:00-10:45" },
    { id: 4, name: "第4节", time: "10:55-11:40" },
    { id: 5, name: "第5节", time: "14:00-14:45" },
    { id: 6, name: "第6节", time: "14:55-15:40" },
    { id: 7, name: "第7节", time: "16:00-16:45" },
    { id: 8, name: "第8节", time: "16:55-17:40" },
    { id: 9, name: "第9节", time: "19:00-19:45" },
    { id: 10, name: "第10节", time: "19:55-20:40" },
    { id: 11, name: "第11节", time: "20:50-21:35" },
    { id: 12, name: "第12节", time: "21:45-22:30" },
  ]

  const [scheduleGrid, setScheduleGrid] = useState<Record<number, Record<number, CourseData | null>>>({
    0: {
      0: {
        id: "1",
        classroom: "101教室",
        course: "高等数学",
        teacher: "张老师",
        building: "第一教学楼",
        status: "completed",
      },
      1: {
        id: "2",
        classroom: "101教室",
        course: "高等数学",
        teacher: "张老师",
        building: "第一教学楼",
        status: "completed",
      },
      2: {
        id: "3",
        classroom: "102教室",
        course: "大学英语",
        teacher: "李老师",
        building: "第一教学楼",
        status: "in-class",
      },
      3: {
        id: "4",
        classroom: "102教室",
        course: "大学英语",
        teacher: "李老师",
        building: "第一教学楼",
        status: "in-class",
      },
      4: null,
      5: null,
      6: {
        id: "5",
        classroom: "201教室",
        course: "Python编程",
        teacher: "陈老师",
        building: "实验楼",
        status: "scheduled",
      },
      7: {
        id: "6",
        classroom: "201教室",
        course: "Python编程",
        teacher: "陈老师",
        building: "实验楼",
        status: "scheduled",
      },
      8: null,
      9: null,
      10: null,
      11: null,
    },
    1: {
      0: {
        id: "7",
        classroom: "103教室",
        course: "数据结构",
        teacher: "赵老师",
        building: "第一教学楼",
        status: "scheduled",
      },
      1: {
        id: "8",
        classroom: "103教室",
        course: "数据结构",
        teacher: "赵老师",
        building: "第一教学楼",
        status: "scheduled",
      },
      2: null,
      3: null,
      4: {
        id: "9",
        classroom: "201教室",
        course: "计算机网络",
        teacher: "王老师",
        building: "实验楼",
        status: "scheduled",
      },
      5: {
        id: "10",
        classroom: "201教室",
        course: "计算机网络",
        teacher: "王老师",
        building: "实验楼",
        status: "scheduled",
      },
      6: null,
      7: null,
      8: {
        id: "11",
        classroom: "301教室",
        course: "操作系统",
        teacher: "孙老师",
        building: "第一教学楼",
        status: "scheduled",
      },
      9: {
        id: "12",
        classroom: "301教室",
        course: "操作系统",
        teacher: "孙老师",
        building: "第一教学楼",
        status: "scheduled",
      },
      10: null,
      11: null,
    },
    2: {
      0: null,
      1: null,
      2: {
        id: "13",
        classroom: "102教室",
        course: "线性代数",
        teacher: "周老师",
        building: "第一教学楼",
        status: "scheduled",
      },
      3: {
        id: "14",
        classroom: "102教室",
        course: "线性代数",
        teacher: "周老师",
        building: "第一教学楼",
        status: "scheduled",
      },
      4: {
        id: "15",
        classroom: "203教室",
        course: "数据库原理",
        teacher: "吴老师",
        building: "实验楼",
        status: "scheduled",
      },
      5: {
        id: "16",
        classroom: "203教室",
        course: "数据库原理",
        teacher: "吴老师",
        building: "实验楼",
        status: "scheduled",
      },
      6: null,
      7: null,
      8: null,
      9: null,
      10: null,
      11: null,
    },
    3: {
      0: {
        id: "17",
        classroom: "104教室",
        course: "大学物理",
        teacher: "郑老师",
        building: "第一教学楼",
        status: "scheduled",
      },
      1: {
        id: "18",
        classroom: "104教室",
        course: "大学物理",
        teacher: "郑老师",
        building: "第一教学楼",
        status: "scheduled",
      },
      2: {
        id: "19",
        classroom: "201教室",
        course: "软件工程",
        teacher: "刘老师",
        building: "实验楼",
        status: "scheduled",
      },
      3: {
        id: "20",
        classroom: "201教室",
        course: "软件工程",
        teacher: "刘老师",
        building: "实验楼",
        status: "scheduled",
      },
      4: null,
      5: null,
      6: {
        id: "21",
        classroom: "105教室",
        course: "概率论",
        teacher: "钱老师",
        building: "第一教学楼",
        status: "scheduled",
      },
      7: {
        id: "22",
        classroom: "105教室",
        course: "概率论",
        teacher: "钱老师",
        building: "第一教学楼",
        status: "scheduled",
      },
      8: null,
      9: null,
      10: null,
      11: null,
    },
    4: {
      0: null,
      1: null,
      2: null,
      3: null,
      4: {
        id: "23",
        classroom: "202教室",
        course: "人工智能",
        teacher: "冯老师",
        building: "实验楼",
        status: "scheduled",
      },
      5: {
        id: "24",
        classroom: "202教室",
        course: "人工智能",
        teacher: "冯老师",
        building: "实验楼",
        status: "scheduled",
      },
      6: {
        id: "25",
        classroom: "106教室",
        course: "大学英语",
        teacher: "李老师",
        building: "第一教学楼",
        status: "scheduled",
      },
      7: {
        id: "26",
        classroom: "106教室",
        course: "大学英语",
        teacher: "李老师",
        building: "第一教学楼",
        status: "scheduled",
      },
      8: null,
      9: null,
      10: null,
      11: null,
    },
    5: {
      0: null,
      1: null,
      2: {
        id: "27",
        classroom: "301教室",
        course: "机器学习",
        teacher: "陈老师",
        building: "实验楼",
        status: "scheduled",
      },
      3: {
        id: "28",
        classroom: "301教室",
        course: "机器学习",
        teacher: "陈老师",
        building: "实验楼",
        status: "scheduled",
      },
      4: null,
      5: null,
      6: null,
      7: null,
      8: null,
      9: null,
      10: null,
      11: null,
    },
    6: {
      0: null,
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
      7: null,
      8: null,
      9: null,
      10: null,
      11: null,
    },
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-class":
        return <Badge className="bg-blue-500">上课中</Badge>
      case "completed":
        return <Badge variant="secondary">已结束</Badge>
      default:
        return <Badge variant="outline">待上课</Badge>
    }
  }

  const handleAdjustCourse = (course: CourseData, dayIndex: number, periodIndex: number) => {
    setSelectedCourse(course)
    setAdjustDialogOpen(true)
  }

  const confirmAdjustment = () => {
    if (!selectedCourse || !targetDay || !targetPeriod) return

    // Remove from original position and add to target position
    // This is a simplified version - in real app would update backend
    setAdjustDialogOpen(false)
    setSelectedCourse(null)
    setTargetDay("")
    setTargetPeriod("")
  }

  const handleClassControl = (course: CourseData, action: "start" | "end") => {
    console.log(`[v0] ${action === "start" ? "上课" : "下课"} - ${course.classroom} ${course.course}`)
    // In real app, this would trigger device control
  }

  // Calculate stats
  const totalCourses = Object.values(scheduleGrid).reduce((acc, day) => {
    return acc + Object.values(day).filter((c) => c !== null).length
  }, 0)
  const inClassCount = Object.values(scheduleGrid).reduce((acc, day) => {
    return acc + Object.values(day).filter((c) => c?.status === "in-class").length
  }, 0)
  const scheduledCount = Object.values(scheduleGrid).reduce((acc, day) => {
    return acc + Object.values(day).filter((c) => c?.status === "scheduled").length
  }, 0)
  const completedCount = Object.values(scheduleGrid).reduce((acc, day) => {
    return acc + Object.values(day).filter((c) => c?.status === "completed").length
  }, 0)

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-[1800px] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">课表管理</h1>
            <p className="mt-1 text-sm text-muted-foreground">根据排课时间联动控制教室设备，实现教学场景智能控制</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              导入课表
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              导出课表
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加课程
            </Button>
          </div>
        </div>

        {/* Week Indicator & Linkage Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-blue-400" />
            <div>
              <div className="text-sm text-muted-foreground">当前教学周</div>
              <div className="text-lg font-semibold text-foreground">第 {currentWeek} 周</div>
            </div>
            <div className="ml-4 text-sm text-muted-foreground">2024年9月 - 2025年1月</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">课表联动控制</div>
              <div className="text-xs text-muted-foreground">自动开关教室设备</div>
            </div>
            <Switch checked={linkageEnabled} onCheckedChange={setLinkageEnabled} />
            <Badge variant={linkageEnabled ? "default" : "secondary"}>{linkageEnabled ? "已启用" : "已禁用"}</Badge>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索教室、课程或教师..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="选择楼栋" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部楼栋</SelectItem>
              <SelectItem value="building1">第一教学楼</SelectItem>
              <SelectItem value="building2">实验楼</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            场景设置
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">本周课程</div>
            <div className="mt-1 text-2xl font-semibold text-foreground">{totalCourses}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">上课中</div>
            <div className="mt-1 text-2xl font-semibold text-blue-400">{inClassCount}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">待上课</div>
            <div className="mt-1 text-2xl font-semibold text-green-400">{scheduledCount}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm text-muted-foreground">已结束</div>
            <div className="mt-1 text-2xl font-semibold text-muted-foreground">{completedCount}</div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="overflow-auto rounded-lg border border-border bg-card">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="sticky left-0 z-10 w-24 border-r border-border bg-muted/50 p-2 text-left text-xs font-semibold text-foreground">
                  节次
                </th>
                {weekDays.map((day, index) => (
                  <th
                    key={index}
                    className="min-w-[180px] border-r border-border p-2 text-center text-sm font-semibold text-foreground last:border-r-0"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period, periodIndex) => (
                <tr key={period.id} className="border-b border-border last:border-b-0">
                  <td className="sticky left-0 z-10 border-r border-border bg-muted/30 p-2">
                    <div className="text-xs font-medium text-foreground">{period.name}</div>
                    <div className="text-[10px] text-muted-foreground">{period.time}</div>
                  </td>
                  {weekDays.map((day, dayIndex) => {
                    const course = scheduleGrid[dayIndex]?.[periodIndex]
                    return (
                      <td key={dayIndex} className="border-r border-border p-1.5 align-top last:border-r-0">
                        {course ? (
                          <div className="group relative rounded-md border border-border bg-blue-500/5 p-2 transition-all hover:border-blue-500/50 hover:bg-blue-500/10">
                            <div className="mb-1.5 flex items-start justify-between gap-1">
                              <div className="flex-1 min-w-0">
                                <div className="mb-0.5 flex items-center gap-1">
                                  <BookOpen className="h-3 w-3 flex-shrink-0 text-blue-400" />
                                  <span className="text-xs font-medium text-foreground truncate">{course.course}</span>
                                </div>
                                <div className="mb-0.5 flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                  <User className="h-2.5 w-2.5 flex-shrink-0" />
                                  <span className="truncate">{course.teacher}</span>
                                </div>
                                <div className="mb-0.5 flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                  <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
                                  <span className="truncate">{course.classroom}</span>
                                </div>
                              </div>
                              {course.status && (
                                <div className="ml-1 flex-shrink-0">
                                  {course.status === "in-class" ? (
                                    <Badge className="h-4 px-1 text-[10px] bg-blue-500">上课</Badge>
                                  ) : course.status === "completed" ? (
                                    <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                                      结束
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="h-4 px-1 text-[10px]">
                                      待上
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="mt-1.5 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 flex-1 text-[10px] bg-transparent px-1"
                                onClick={() => handleClassControl(course, "start")}
                                disabled={course.status === "completed" || course.status === "in-class"}
                              >
                                <Power className="mr-0.5 h-2.5 w-2.5" />
                                上课
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 flex-1 text-[10px] bg-transparent px-1"
                                onClick={() => handleClassControl(course, "end")}
                                disabled={course.status !== "in-class"}
                              >
                                <Power className="mr-0.5 h-2.5 w-2.5" />
                                下课
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-1.5 text-[10px]"
                                onClick={() => handleAdjustCourse(course, dayIndex, periodIndex)}
                              >
                                <Move className="h-2.5 w-2.5" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-full min-h-[80px] items-center justify-center rounded-md border border-dashed border-border bg-muted/20 transition-colors hover:border-blue-500/30 hover:bg-muted/40">
                            <Button variant="ghost" size="sm" className="h-6 text-[10px] text-muted-foreground px-1">
                              <Plus className="mr-0.5 h-3 w-3" />
                              添加
                            </Button>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>调课</DialogTitle>
            <DialogDescription>将课程调整到新的时间段</DialogDescription>
          </DialogHeader>

          {selectedCourse && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="text-sm font-medium text-foreground">当前课程</div>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <div>
                    {selectedCourse.course} - {selectedCourse.teacher}
                  </div>
                  <div>
                    {selectedCourse.classroom} ({selectedCourse.building})
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">目标星期</label>
                  <Select value={targetDay} onValueChange={setTargetDay}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择星期" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekDays.map((day, index) => (
                        <SelectItem key={index} value={String(index)}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">目标节次</label>
                  <Select value={targetPeriod} onValueChange={setTargetPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择节次" />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map((period, index) => (
                        <SelectItem key={index} value={String(index)}>
                          {period.name} ({period.time})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              取消
            </Button>
            <Button onClick={confirmAdjustment} disabled={!targetDay || !targetPeriod}>
              <Check className="mr-2 h-4 w-4" />
              确认调课
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
