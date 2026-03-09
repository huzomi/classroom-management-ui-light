"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { BuildingTree, treeData, getAllRoomIds } from "@/components/classroom/building-tree"
import { fetchClassrooms } from "@/lib/api/classroom"
import type { RoomData } from "@/components/classroom/room-card"

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

type DisplayStatus = "in-class" | "idle" | "fault"

function roomToDisplayStatus(status: RoomData["status"]): DisplayStatus {
  if (status === "teaching" || status === "exam" || status === "self-study") return "in-class"
  if (status === "fault" || status === "abnormal") return "fault"
  return "idle"
}

const allRoomIds = getAllRoomIds(treeData)

export default function MonitoringPage() {
  const [gridMode, setGridMode] = useState<"single" | "quad" | "six">("quad")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [audioEnabled, setAudioEnabled] = useState<Set<string>>(new Set())
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>(() =>
    allRoomIds.slice(0, 4)
  )
  const [autoRotate, setAutoRotate] = useState(false)
  const [rooms, setRooms] = useState<RoomData[]>([])

  useEffect(() => {
    fetchClassrooms().then(setRooms)
  }, [])

  const roomDisplayMap = useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string; status: DisplayStatus; teacher: string | null; course: string | null; camera: "teacher" | "student" | "desktop" }
    >()
    for (const r of rooms) {
      map.set(r.id, {
        id: r.id,
        name: r.name,
        status: roomToDisplayStatus(r.status),
        teacher: r.currentCourse?.teacher ?? null,
        course: r.currentCourse?.name ?? null,
        camera: "teacher",
      })
    }
    return map
  }, [rooms])

  const roomStatusMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const r of rooms) {
      map[r.id] = roomToDisplayStatus(r.status)
    }
    return map
  }, [rooms])

  const toggleAudio = (id: string) => {
    setAudioEnabled((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectClassroom = (id: string) => {
    setSelectedClassrooms((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    )
  }

  const allClassrooms = useMemo(() => {
    return allRoomIds
      .map((id) => roomDisplayMap.get(id))
      .filter(Boolean) as Array<{
      id: string
      name: string
      status: DisplayStatus
      teacher: string | null
      course: string | null
      camera: "teacher" | "student" | "desktop"
    }>
  }, [roomDisplayMap])

  const filteredClassrooms = allClassrooms.filter((c) => {
    if (filterStatus !== "all" && c.status !== filterStatus) return false
    return true
  })

  const gridClass = gridMode === "single" ? "grid-cols-1" : gridMode === "quad" ? "grid-cols-2" : "grid-cols-3"
  const maxDisplay = gridMode === "single" ? 1 : gridMode === "quad" ? 4 : 6

  const displayClassrooms = filteredClassrooms
    .filter((c) => selectedClassrooms.includes(c.id))
    .slice(0, maxDisplay)


  return (
    <div className="flex h-full">
      {showSidebar && (
        <div className="w-64 shrink-0 border-r border-border bg-card flex flex-col">
          <div className="flex-1 overflow-auto p-4">
            <BuildingTree
              title="快速定位"
              subtitle={`已选 ${selectedClassrooms.length} / ${allRoomIds.length}`}
              selectedRoomIds={selectedClassrooms}
              onRoomClick={selectClassroom}
              roomStatusMap={roomStatusMap}
            />
          </div>

          <div className="shrink-0 p-3 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">已选择 {selectedClassrooms.length} 个教室</div>
            <Button
              size="sm"
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => setSelectedClassrooms([...allRoomIds])}
            >
              选择全部
            </Button>
          </div>
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
