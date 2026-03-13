"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BuildingTree, getAllRoomIds, getRoomIdToName, type TreeNode } from "@/components/classroom/building-tree"

import {
  LayoutGrid,
  Grid2x2,
  Grid3x3,
  Maximize2,
  Volume2,
  VolumeX,
  Video,
  Play,
  Building2,
} from "lucide-react"
import { TeachingEvaluationSheet, type CourseInfo } from "@/components/monitoring/teaching-evaluation-sheet"
import { MonitorCard } from "@/components/monitoring/monitor-card"

// 教室监控状态 Mock 数据（与 treeData 中的 roomId 对应）
type MonitorStatus = "in-class" | "idle" | "fault"
const mockClassroomStatus: Record<
  string,
  {
    name: string
    status: MonitorStatus
    teacher: string | null
    course: string | null
    time: string | null
    camera: "teacher" | "student" | "desktop"
  }
> = {
  a101: { name: "A101", status: "in-class", teacher: "张教授", course: "数据结构与算法", time: "08:00-09:40", camera: "teacher" },
  a102: { name: "A102", status: "idle", teacher: null, course: null, time: null, camera: "student" },
  a103: { name: "A103", status: "in-class", teacher: "李老师", course: "大学英语", time: "08:00-09:40", camera: "teacher" },
  a201: { name: "A201", status: "idle", teacher: null, course: null, time: null, camera: "teacher" },
  a202: { name: "A202", status: "fault", teacher: null, course: null, time: null, camera: "teacher" },
  a203: { name: "A203", status: "in-class", teacher: "赵老师", course: "化学实验", time: "10:00-11:40", camera: "teacher" },
  b101: { name: "B101", status: "in-class", teacher: "孙老师", course: "计算机编程", time: "14:00-15:40", camera: "desktop" },
  b102: { name: "B102", status: "idle", teacher: null, course: null, time: null, camera: "teacher" },
}

export default function MonitoringPage() {
  const [gridMode, setGridMode] = useState<"single" | "quad" | "six">("quad")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [audioEnabled, setAudioEnabled] = useState<Set<string>>(new Set())
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([])
  const [autoRotate, setAutoRotate] = useState(false)
  const [evaluationOpen, setEvaluationOpen] = useState(false)
  const [evaluationCourse, setEvaluationCourse] = useState<CourseInfo | null>(null)
  const [allRoomIds, setAllRoomIds] = useState<string[]>([])
  const [roomIdToName, setRoomIdToName] = useState<Record<string, string>>({})

  const handleTreeLoaded = useCallback((tree: TreeNode[]) => {
    setAllRoomIds(getAllRoomIds(tree))
    setRoomIdToName(getRoomIdToName(tree))
  }, [])

  const maxDisplay = gridMode === "single" ? 1 : gridMode === "quad" ? 4 : 6

  const handleRoomSelectionChange = useCallback(
    (next: string[]) => {
      if (next.length <= maxDisplay) {
        setSelectedClassrooms(next)
        return
      }
      setSelectedClassrooms(next.slice(-maxDisplay))
    },
    [maxDisplay]
  )

  useEffect(() => {
    setSelectedClassrooms((prev) => {
      if (prev.length <= maxDisplay) return prev
      return prev.slice(-maxDisplay)
    })
  }, [maxDisplay])

  const openEvaluation = (classroom: (typeof mockClassroomStatus)[string] & { id: string }) => {
    if (classroom.status !== "in-class" || !classroom.course || !classroom.teacher) return
    setEvaluationCourse({
      room: classroom.name,
      courseName: classroom.course,
      teacher: classroom.teacher,
      time: classroom.time ?? "—",
    })
    setEvaluationOpen(true)
  }

  const toggleAudio = (id: string) => {
    const newAudio = new Set(audioEnabled)
    if (newAudio.has(id)) {
      newAudio.delete(id)
    } else {
      newAudio.add(id)
    }
    setAudioEnabled(newAudio)
  }

  const gridClass = gridMode === "single" ? "grid-cols-1" : gridMode === "quad" ? "grid-cols-2" : "grid-cols-3"

  const filteredClassrooms = selectedClassrooms
    .map((id) => {
      const info = mockClassroomStatus[id]
      const fallback = {
        id,
        name: roomIdToName[id] ?? id,
        status: "idle" as MonitorStatus,
        teacher: null as string | null,
        course: null as string | null,
        time: null as string | null,
        camera: "teacher" as const,
      }
      return info ? { id, ...info } : fallback
    })
    .filter((c) => filterStatus === "all" || c.status === filterStatus)

  const displayClassrooms = filteredClassrooms


  return (
    <div className="flex h-full">
      {showSidebar && (
        <div className="w-64 shrink-0 flex flex-col min-h-0 border-r border-border bg-card p-4">
          <BuildingTree
            title="快速定位"
            subtitle={`已选 ${selectedClassrooms.length} / ${maxDisplay}（最多${maxDisplay}个）`}
            selectedRoomIds={selectedClassrooms}
            onRoomSelectionChange={handleRoomSelectionChange}
            roomStatusMap={Object.fromEntries(
              Object.entries(mockClassroomStatus).map(([id, info]) => [id, info.status])
            )}
            onTreeLoaded={handleTreeLoaded}
          />
        </div>
      )}

      <div className="flex flex-col flex-1">
        <div className="border-b border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="gap-2 bg-transparent"
              >
                <Building2 className="h-4 w-4" />
                {showSidebar ? "隐藏" : "显示"}楼栋
              </Button>

              <div className="h-6 w-px bg-border" />

              <div className="flex items-center gap-0.5 p-0.5 bg-secondary/50 rounded-lg border border-border">
                <Button
                  variant={gridMode === "single" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridMode("single")}
                  className="h-8 w-8 p-0"
                  title="单画面"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridMode === "quad" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridMode("quad")}
                  className="h-8 w-8 p-0"
                  title="4画面"
                >
                  <Grid2x2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridMode === "six" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridMode("six")}
                  className="h-8 w-8 p-0"
                  title="6画面"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              </div>

              <div className="h-6 w-px bg-border" />

              <div className="flex items-center gap-2">
                <Badge
                  variant={filterStatus === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterStatus("all")}
                >
                  全部
                </Badge>
                <Badge
                  variant={filterStatus === "in-class" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterStatus("in-class")}
                >
                  上课中
                </Badge>
                <Badge
                  variant={filterStatus === "fault" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterStatus("fault")}
                >
                  故障
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={autoRotate ? "default" : "outline"}
                size="sm"
                className="gap-2 bg-transparent"
                onClick={() => setAutoRotate(!autoRotate)}
              >
                <Play className="h-4 w-4" />
                自动轮巡
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Maximize2 className="h-4 w-4" />
                全屏
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {displayClassrooms.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <Video className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-sm">暂无选择的教室</p>
                <p className="text-xs mt-2">请从左侧选择要监控的教室</p>
              </div>
            </div>
          ) : (
            <div className={`grid ${gridClass} gap-4`}>
              {displayClassrooms.map((classroom) => (
                <MonitorCard
                  key={classroom.id}
                  roomId={classroom.id}
                  name={classroom.name}
                  status={classroom.status}
                  teacher={classroom.teacher}
                  course={classroom.course}
                  time={classroom.time}
                  audioEnabled={audioEnabled.has(classroom.id)}
                  onToggleAudio={() => toggleAudio(classroom.id)}
                  onOpenEvaluation={
                    classroom.status === "in-class" && classroom.course
                      ? () => openEvaluation(classroom)
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <TeachingEvaluationSheet
        open={evaluationOpen}
        onOpenChange={setEvaluationOpen}
        courseInfo={evaluationCourse}
        onSave={(data) => {
          console.log("保存听评课记录:", data)
        }}
      />
    </div>
  )
}
