"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { BuildingTree, allRoomIds } from "@/components/classroom/building-tree"

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

// 教室监控状态 Mock 数据（与 treeData 中的 roomId 对应）
type MonitorStatus = "in-class" | "idle" | "fault"
const mockClassroomStatus: Record<
  string,
  { name: string; status: MonitorStatus; teacher: string | null; course: string | null; camera: "teacher" | "student" | "desktop" }
> = {
  a101: { name: "A101", status: "in-class", teacher: "张老师", course: "高等数学", camera: "teacher" },
  a102: { name: "A102", status: "idle", teacher: null, course: null, camera: "student" },
  a103: { name: "A103", status: "in-class", teacher: "李老师", course: "大学英语", camera: "teacher" },
  a201: { name: "A201", status: "idle", teacher: null, course: null, camera: "teacher" },
  a202: { name: "A202", status: "fault", teacher: null, course: null, camera: "teacher" },
  a203: { name: "A203", status: "in-class", teacher: "赵老师", course: "化学实验", camera: "teacher" },
  b101: { name: "B101", status: "in-class", teacher: "孙老师", course: "计算机编程", camera: "desktop" },
  b102: { name: "B102", status: "idle", teacher: null, course: null, camera: "teacher" },
}

export default function MonitoringPage() {
  const [gridMode, setGridMode] = useState<"single" | "quad" | "six">("quad")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [audioEnabled, setAudioEnabled] = useState<Set<string>>(new Set())
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>(["a101", "a102", "a103", "a201"])
  const [autoRotate, setAutoRotate] = useState(false)

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
  const maxDisplay = gridMode === "single" ? 1 : gridMode === "quad" ? 4 : 6

  const filteredClassrooms = selectedClassrooms
    .map((id) => {
      const info = mockClassroomStatus[id]
      return info ? { id, ...info } : null
    })
    .filter((c): c is NonNullable<typeof c> => c !== null && (filterStatus === "all" || c.status === filterStatus))

  const displayClassrooms = filteredClassrooms.slice(0, maxDisplay)


  return (
    <div className="flex h-full">
      {showSidebar && (
        <div className="w-64 shrink-0 flex flex-col min-h-0 border-r border-border bg-card p-4">
          <BuildingTree
            title="快速定位"
            subtitle={`已选 ${selectedClassrooms.length} / ${allRoomIds.length} 教室`}
            selectedRoomIds={selectedClassrooms}
            onRoomSelectionChange={setSelectedClassrooms}
            roomStatusMap={Object.fromEntries(
              Object.entries(mockClassroomStatus).map(([id, info]) => [id, info.status])
            )}
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
                <Card key={classroom.id} className="relative aspect-video bg-secondary/20 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-muted/50 flex items-center justify-center">
                    <Video className="h-16 w-16 text-muted-foreground/30" />
                  </div>

                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-black/50 backdrop-blur text-white border-0">
                        {classroom.name}
                      </Badge>
                      {classroom.course && (
                        <Badge variant="default" className="bg-blue-500/80 backdrop-blur text-white border-0">
                          {classroom.course}
                        </Badge>
                      )}
                    </div>
                    {classroom.teacher && (
                      <Badge variant="default" className="bg-black/50 backdrop-blur text-white border-0 w-fit">
                        {classroom.teacher}
                      </Badge>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="default"
                      className="h-8 w-8 p-0 bg-black/50 backdrop-blur hover:bg-black/70"
                      onClick={() => toggleAudio(classroom.id)}
                    >
                      {audioEnabled.has(classroom.id) ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      className="h-8 w-8 p-0 bg-black/50 backdrop-blur hover:bg-black/70"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant={classroom.camera === "teacher" ? "default" : "ghost"}
                      className="h-7 px-2 text-xs bg-black/50 backdrop-blur border-0"
                    >
                      教师
                    </Button>
                    <Button
                      size="sm"
                      variant={classroom.camera === "student" ? "default" : "ghost"}
                      className="h-7 px-2 text-xs bg-black/50 backdrop-blur border-0"
                    >
                      学生
                    </Button>
                    <Button
                      size="sm"
                      variant={classroom.camera === "desktop" ? "default" : "ghost"}
                      className="h-7 px-2 text-xs bg-black/50 backdrop-blur border-0"
                    >
                      桌面
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
