"use client"

import { useState, useEffect } from "react"
import {
  getTimetableNow,
  getTimetableNum,
  getTimetableList,
  type TimetableNowVO,
  type TimetableClassNumVO,
  type TimetableDO,
} from "@/lib/api/timetable"
import { getLessonList, type LessonPageVO } from "@/lib/api/lesson"
import { getCampusTree, type CampusBuildingFloorTreeVO } from "@/lib/api/campus"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  Calendar,
  MapPin,
  User,
  BookOpen,
  Settings,
  Download,
  Upload,
  X,
  Check,
  ChevronRight,
  ChevronDown,
  Building,
  Layers,
  Monitor,
  Loader2,
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

const MAX_PERIODS = 20

function timetableListToGrid(list: TimetableDO[] | null | undefined): Record<number, Record<number, CourseData | null>> {
  const grid: Record<number, Record<number, CourseData | null>> = {}
  for (let d = 0; d < 7; d++) {
    grid[d] = {}
    for (let p = 0; p < MAX_PERIODS; p++) grid[d][p] = null
  }
  if (!list || !Array.isArray(list)) return grid
  for (const item of list) {
    const dayIndex = item.weekday ? parseInt(item.weekday, 10) - 1 : 0
    if (dayIndex < 0 || dayIndex > 6) continue
    const lessonStrs = (item.lessons ?? "1").split(",").map((s) => s.trim())
    const course: CourseData = {
      id: item.id,
      classroom: item.roomName ?? "",
      course: item.courseName ?? "",
      teacher: item.teacherName ?? "",
      building: item.roomName ?? "",
      status: "scheduled",
    }
    for (const ls of lessonStrs) {
      const periodIndex = parseInt(ls, 10) - 1
      if (periodIndex >= 0 && periodIndex < MAX_PERIODS) {
        grid[dayIndex][periodIndex] = course
      }
    }
  }
  return grid
}

type ScheduleClassroomTree = {
  campus: string
  buildings: {
    name: string
    floors: {
      name: string
      rooms: { id: string; name: string }[]
    }[]
  }[]
}

function convertCampusToScheduleTree(data: CampusBuildingFloorTreeVO[]): ScheduleClassroomTree[] {
  return (data ?? []).map((campus) => ({
    campus: campus.name,
    buildings: (campus.buildings ?? []).map((building) => ({
      name: building.name,
      floors: (building.floors ?? []).map((floor) => ({
        name: floor.name,
        rooms: (floor.rooms ?? []).map((room) => ({ id: room.id, name: room.name })),
      })),
    })),
  }))
}

export default function ScheduleManagementPage() {
  const [linkageEnabled, setLinkageEnabled] = useState(true)
  const [selectedBuilding, setSelectedBuilding] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null)
  const [targetDay, setTargetDay] = useState("")
  const [targetPeriod, setTargetPeriod] = useState("")
  const [timetableNow, setTimetableNow] = useState<TimetableNowVO | null>(null)
  const [timetableNum, setTimetableNum] = useState<TimetableClassNumVO | null>(null)
  const [timetableList, setTimetableList] = useState<TimetableDO[] | null>(null)
  const [lessonList, setLessonList] = useState<LessonPageVO[]>([])

  const [classroomStructure, setClassroomStructure] = useState<ScheduleClassroomTree[]>([])
  const [roomIdToName, setRoomIdToName] = useState<Record<string, string>>({})
  const [treeLoading, setTreeLoading] = useState(true)
  const [expandedCampuses, setExpandedCampuses] = useState<Set<string>>(new Set())
  const [expandedBuildings, setExpandedBuildings] = useState<Set<string>>(new Set())
  const [expandedFloors, setExpandedFloors] = useState<Set<string>>(new Set())
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)

  useEffect(() => {
    getTimetableNow()
      .then(setTimetableNow)
      .catch((err) => console.error("获取当前教学周失败:", err))
  }, [])

  useEffect(() => {
    if (!timetableNow?.semesterId || timetableNow.week == null) return
    getTimetableNum({
      semesterId: timetableNow.semesterId,
      week: String(timetableNow.week),
      ...(selectedRoomId && { roomId: selectedRoomId }),
    })
      .then(setTimetableNum)
      .catch((err) => console.error("获取课表数量失败:", err))
  }, [timetableNow?.semesterId, timetableNow?.week, selectedRoomId])

  useEffect(() => {
    if (!timetableNow?.semesterId || timetableNow.week == null) return
    getTimetableList({
      semesterId: timetableNow.semesterId,
      week: String(timetableNow.week),
      ...(selectedRoomId && { roomId: selectedRoomId }),
    })
      .then(setTimetableList)
      .catch((err) => console.error("获取课表列表失败:", err))
  }, [timetableNow?.semesterId, timetableNow?.week, selectedRoomId])

  useEffect(() => {
    getLessonList({ pageSize: 2000, page: 1 })
      .then(setLessonList)
      .catch((err) => console.error("获取节次列表失败:", err))
  }, [])

  useEffect(() => {
    setTreeLoading(true)
    getCampusTree()
      .then((data) => {
        const tree = convertCampusToScheduleTree(data ?? [])
        setClassroomStructure(tree)
        const map: Record<string, string> = {}
        tree.forEach((c) =>
          c.buildings.forEach((b) =>
            b.floors.forEach((f) => f.rooms.forEach((r) => (map[r.id] = r.name)))
          )
        )
        setRoomIdToName(map)
        if (tree.length > 0) {
          const firstCampus = tree[0].campus
          setExpandedCampuses(new Set([firstCampus]))
          if (tree[0].buildings.length > 0) {
            const firstBuilding = `${firstCampus}-${tree[0].buildings[0].name}`
            setExpandedBuildings(new Set([firstBuilding]))
            if (tree[0].buildings[0].floors.length > 0) {
              const firstFloor = `${firstBuilding}-${tree[0].buildings[0].floors[0].name}`
              setExpandedFloors(new Set([firstFloor]))
              const firstRoom = tree[0].buildings[0].floors[0].rooms[0]
              if (firstRoom) setSelectedRoomId(firstRoom.id)
            }
          }
        }
      })
      .catch((err) => console.error("加载教室树失败:", err))
      .finally(() => setTreeLoading(false))
  }, [])

  const currentWeek = timetableNow?.week ?? 0

  const toggleCampus = (campus: string) => {
    const newExpanded = new Set(expandedCampuses)
    if (newExpanded.has(campus)) {
      newExpanded.delete(campus)
    } else {
      newExpanded.add(campus)
    }
    setExpandedCampuses(newExpanded)
  }

  const toggleBuilding = (buildingKey: string) => {
    const newExpanded = new Set(expandedBuildings)
    if (newExpanded.has(buildingKey)) {
      newExpanded.delete(buildingKey)
    } else {
      newExpanded.add(buildingKey)
    }
    setExpandedBuildings(newExpanded)
  }

  const toggleFloor = (floorKey: string) => {
    const newExpanded = new Set(expandedFloors)
    if (newExpanded.has(floorKey)) {
      newExpanded.delete(floorKey)
    } else {
      newExpanded.add(floorKey)
    }
    setExpandedFloors(newExpanded)
  }

  const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  const periods =
    lessonList.length > 0
      ? lessonList.map((l, i) => ({
          id: parseInt(l.id, 10) || i + 1,
          name: `第${i + 1}节`,
          time: `${(l.startTime ?? "").slice(0, 5)}-${(l.endTime ?? "").slice(0, 5)}`,
        }))
      : [
          { id: 1, name: "第1节", time: "—" },
          { id: 2, name: "第2节", time: "—" },
          { id: 3, name: "第3节", time: "—" },
          { id: 4, name: "第4节", time: "—" },
          { id: 5, name: "第5节", time: "—" },
          { id: 6, name: "第6节", time: "—" },
          { id: 7, name: "第7节", time: "—" },
          { id: 8, name: "第8节", time: "—" },
          { id: 9, name: "第9节", time: "—" },
          { id: 10, name: "第10节", time: "—" },
          { id: 11, name: "第11节", time: "—" },
          { id: 12, name: "第12节", time: "—" },
        ]

  const scheduleGrid = timetableListToGrid(timetableList)

  const confirmAdjustment = () => {
    if (!selectedCourse || !targetDay || !targetPeriod) return

    // Remove from original position and add to target position
    // This is a simplified version - in real app would update backend
    setAdjustDialogOpen(false)
    setSelectedCourse(null)
    setTargetDay("")
    setTargetPeriod("")
  }

  // 统计数据来自接口 /common/timetable/num
  const totalCourses = timetableNum?.all ?? 0
  const inClassCount = timetableNum?.ing ?? 0
  const scheduledCount = timetableNum?.will ?? 0
  const completedCount = timetableNum?.over ?? 0

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Sidebar - Classroom Selection Tree */}
      <div className="w-64 border-r border-border bg-card flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">教室选择</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {selectedRoomId ? `已选: ${roomIdToName[selectedRoomId] ?? selectedRoomId}` : "选择教室查看课表"}
          </p>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {treeLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            classroomStructure.map((campusData) => (
            <div key={campusData.campus} className="mb-1">
              {/* 校区层级 */}
              <button
                onClick={() => toggleCampus(campusData.campus)}
                className="flex items-center gap-2 w-full p-2 hover:bg-accent rounded-md text-sm transition-colors"
              >
                {expandedCampuses.has(campusData.campus) ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <Building className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">{campusData.campus}</span>
              </button>

              {expandedCampuses.has(campusData.campus) && (
                <div className="ml-4">
                  {campusData.buildings.map((building) => {
                    const buildingKey = `${campusData.campus}-${building.name}`
                    return (
                      <div key={buildingKey} className="mb-1">
                        {/* 教学楼层级 */}
                        <button
                          onClick={() => toggleBuilding(buildingKey)}
                          className="flex items-center gap-2 w-full p-2 hover:bg-accent rounded-md text-sm transition-colors"
                        >
                          {expandedBuildings.has(buildingKey) ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <Building className="h-4 w-4 text-primary" />
                          <span className="text-primary">{building.name}</span>
                        </button>

                        {expandedBuildings.has(buildingKey) && (
                          <div className="ml-4">
                            {building.floors.map((floor) => {
                              const floorKey = `${campusData.campus}-${building.name}-${floor.name}`
                              return (
                                <div key={floorKey} className="mb-1">
                                  {/* ��层层级 */}
                                  <button
                                    onClick={() => toggleFloor(floorKey)}
                                    className="flex items-center gap-2 w-full p-2 hover:bg-accent rounded-md text-sm transition-colors"
                                  >
                                    {expandedFloors.has(floorKey) ? (
                                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                    ) : (
                                      <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                    )}
                                    <Layers className="h-3 w-3 text-primary" />
                                    <span className="text-primary text-sm">{floor.name}</span>
                                  </button>

                                  {expandedFloors.has(floorKey) && (
                                    <div className="ml-6 space-y-0.5">
                                      {/* 教室层级 */}
                                      {floor.rooms.map((room) => (
                                        <button
                                          key={room.id}
                                          onClick={() => setSelectedRoomId(room.id)}
                                          className={`flex items-center gap-2 w-full p-2 rounded-md text-sm transition-colors ${
                                            selectedRoomId === room.id
                                              ? "bg-primary/10 text-primary"
                                              : "hover:bg-accent text-primary"
                                          }`}
                                        >
                                          <Monitor className="h-3 w-3" />
                                          <span className="text-sm">{room.name}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            ))
          )}
        </div>
      </div>

      {/* Right Content */}
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
              <div className="text-lg font-semibold text-foreground">
                {timetableNow ? `第 ${currentWeek} 周` : "加载中..."}
              </div>
            </div>
            <div className="ml-4 text-sm text-muted-foreground">
              {timetableNow?.semesterName ?? "—"}
            </div>
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
    </div>
  )
}
