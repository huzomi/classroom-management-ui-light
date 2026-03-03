"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

import {
  LayoutGrid,
  Grid2x2,
  Grid3x3,
  Maximize2,
  Volume2,
  VolumeX,
  Video,
  Play,
  ChevronRight,
  ChevronDown,
  Building2,
  Layers,
  DoorOpen,
  MapPin,
} from "lucide-react"

const mockClassroomStructure = [
  {
    campus: "主校区",
    buildings: [
      {
        building: "第一教学楼",
        floors: [
          {
            floor: "1层",
            classrooms: [
              { id: "101", name: "101教室", status: "in-class", teacher: "张老师", course: "高等数学", camera: "teacher" },
              { id: "102", name: "102教室", status: "idle", teacher: null, course: null, camera: "student" },
              { id: "103", name: "103教室", status: "in-class", teacher: "李老师", course: "大学英语", camera: "teacher" },
              { id: "104", name: "104教室", status: "in-class", teacher: "王老师", course: "物理实验", camera: "desktop" },
            ],
          },
          {
            floor: "2层",
            classrooms: [
              { id: "201", name: "201教室", status: "idle", teacher: null, course: null, camera: "teacher" },
              { id: "202", name: "202教室", status: "fault", teacher: null, course: null, camera: "teacher" },
              { id: "203", name: "203教室", status: "in-class", teacher: "赵老师", course: "化学实验", camera: "teacher" },
            ],
          },
        ],
      },
      {
        building: "实验楼",
        floors: [
          {
            floor: "1层",
            classrooms: [
              {
                id: "501",
                name: "501教室",
                status: "in-class",
                teacher: "孙老师",
                course: "计算机编程",
                camera: "desktop",
              },
              { id: "502", name: "502教室", status: "idle", teacher: null, course: null, camera: "teacher" },
            ],
          },
        ],
      },
    ],
  },
  {
    campus: "南校区",
    buildings: [
      {
        building: "综合楼",
        floors: [
          {
            floor: "1层",
            classrooms: [
              { id: "N101", name: "N101教室", status: "in-class", teacher: "周老师", course: "数据结构", camera: "teacher" },
              { id: "N102", name: "N102教室", status: "idle", teacher: null, course: null, camera: "student" },
            ],
          },
        ],
      },
    ],
  },
]

const allClassrooms = mockClassroomStructure.flatMap((campus) => 
  campus.buildings.flatMap((b) => b.floors.flatMap((f) => f.classrooms))
)

export default function MonitoringPage() {
  const [gridMode, setGridMode] = useState<"single" | "quad" | "six">("quad")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [audioEnabled, setAudioEnabled] = useState<Set<string>>(new Set())
  const [showSidebar, setShowSidebar] = useState(true)
  const [expandedCampuses, setExpandedCampuses] = useState<Set<string>>(new Set(["主校区"]))
  const [expandedBuildings, setExpandedBuildings] = useState<Set<string>>(new Set(["主校区-第一教学楼"]))
  const [expandedFloors, setExpandedFloors] = useState<Set<string>>(new Set(["主校区-第一教学楼-1层"]))
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>(["101", "102", "103", "104"])
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

  const filteredClassrooms = allClassrooms.filter((c) => {
    if (filterStatus !== "all" && c.status !== filterStatus) return false
    return true
  })

  const gridClass = gridMode === "single" ? "grid-cols-1" : gridMode === "quad" ? "grid-cols-2" : "grid-cols-3"
  const maxDisplay = gridMode === "single" ? 1 : gridMode === "quad" ? 4 : 6

  const displayClassrooms = filteredClassrooms.filter((c) => selectedClassrooms.includes(c.id)).slice(0, maxDisplay)

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

  const toggleFloor = (key: string) => {
    const newExpanded = new Set(expandedFloors)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedFloors(newExpanded)
  }

  const selectClassroom = (id: string) => {
    if (selectedClassrooms.includes(id)) {
      setSelectedClassrooms(selectedClassrooms.filter((cId) => cId !== id))
    } else {
      setSelectedClassrooms([...selectedClassrooms, id])
    }
  }

  const selectAllInFloor = (classroomIds: string[]) => {
    setSelectedClassrooms([...new Set([...selectedClassrooms, ...classroomIds])])
  }

  return (
    <div className="flex h-full">
      {showSidebar && (
        <div className="w-64 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-sm">快速定位</h3>
          </div>

          <div className="flex-1 overflow-auto p-2">
            {mockClassroomStructure.map((campusData) => (
              <div key={campusData.campus} className="mb-2">
                {/* 校区层级 */}
                <button
                  onClick={() => toggleCampus(campusData.campus)}
                  className="flex items-center gap-2 w-full p-2 hover:bg-accent rounded-md text-sm transition-colors"
                >
                  {expandedCampuses.has(campusData.campus) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">{campusData.campus}</span>
                </button>

                {expandedCampuses.has(campusData.campus) && (
                  <div className="ml-4 mt-1">
                    {campusData.buildings.map((building) => {
                      const buildingKey = `${campusData.campus}-${building.building}`
                      return (
                        <div key={buildingKey} className="mb-1">
                          {/* 教学楼层级 */}
                          <button
                            onClick={() => toggleBuilding(buildingKey)}
                            className="flex items-center gap-2 w-full p-2 hover:bg-accent rounded-md text-sm transition-colors"
                          >
                            {expandedBuildings.has(buildingKey) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <Building2 className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">{building.building}</span>
                          </button>

                          {expandedBuildings.has(buildingKey) && (
                            <div className="ml-4 mt-1">
                              {building.floors.map((floor) => {
                                const floorKey = `${campusData.campus}-${building.building}-${floor.floor}`
                                return (
                                  <div key={floorKey} className="mb-1">
                                    {/* 楼层层级 */}
                                    <button
                                      onClick={() => toggleFloor(floorKey)}
                                      className="flex items-center gap-2 w-full p-2 hover:bg-accent rounded-md text-sm transition-colors"
                                    >
                                      {expandedFloors.has(floorKey) ? (
                                        <ChevronDown className="h-3 w-3" />
                                      ) : (
                                        <ChevronRight className="h-3 w-3" />
                                      )}
                                      <Layers className="h-3 w-3 text-green-500" />
                                      <span className="text-sm">{floor.floor}</span>
                                      <span
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          selectAllInFloor(floor.classrooms.map((c) => c.id))
                                        }}
                                        className="ml-auto text-xs text-blue-500 hover:underline cursor-pointer"
                                      >
                                        全选
                                      </span>
                                    </button>

                                    {expandedFloors.has(floorKey) && (
                                      <div className="ml-4 mt-1 space-y-0.5">
                                        {/* 教室层级 */}
                                        {floor.classrooms.map((classroom) => (
                                          <button
                                            key={classroom.id}
                                            onClick={() => selectClassroom(classroom.id)}
                                            className={`flex items-center gap-2 w-full p-2 rounded-md text-sm transition-colors ${
                                              selectedClassrooms.includes(classroom.id)
                                                ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                                                : "hover:bg-accent"
                                            }`}
                                          >
                                            <DoorOpen className="h-3 w-3" />
                                            <span className="text-xs">{classroom.name}</span>
                                            {classroom.status === "in-class" && (
                                              <Badge variant="default" className="ml-auto h-5 px-1.5 text-xs bg-blue-500">
                                                上课
                                              </Badge>
                                            )}
                                            {classroom.status === "fault" && (
                                              <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">
                                                故障
                                              </Badge>
                                            )}
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
            ))}
          </div>

          <div className="p-3 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">已选择 {selectedClassrooms.length} 个教室</div>
            <Button
              size="sm"
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => setSelectedClassrooms(allClassrooms.map((c) => c.id))}
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
