"use client"

import { useState } from "react"
import { Calendar, Clock, Search, Plus, Download, Upload, ChevronRight, ChevronDown, Building, Layers, Monitor } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// 教室树形结构数据
const classroomStructure = [
  {
    campus: "主校区",
    buildings: [
      {
        name: "教一楼",
        floors: [
          {
            name: "一楼",
            classrooms: ["109", "110", "501", "208", "209", "211"],
          },
          {
            name: "二楼",
            classrooms: ["212", "213", "214", "215"],
          },
        ],
      },
      {
        name: "教二楼",
        floors: [
          {
            name: "一楼",
            classrooms: ["101", "102", "103"],
          },
        ],
      },
    ],
  },
  {
    campus: "南校区",
    buildings: [
      {
        name: "综合楼",
        floors: [
          {
            name: "一楼",
            classrooms: ["N101", "N102", "N103"],
          },
        ],
      },
    ],
  },
]

const timeSlots = ["08:00", "10:00", "14:00", "16:00", "19:00"]
const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]

export default function SchedulePage() {
  const [expandedCampuses, setExpandedCampuses] = useState<Set<string>>(new Set(["主校区"]))
  const [expandedBuildings, setExpandedBuildings] = useState<Set<string>>(new Set(["主校区-教一楼"]))
  const [expandedFloors, setExpandedFloors] = useState<Set<string>>(new Set(["主校区-教一楼-一楼"]))
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>("109")

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

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Classroom Selection Tree */}
      <div className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">教室选择</h3>
          <p className="text-xs text-muted-foreground mt-1">选择教室查看课表</p>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {classroomStructure.map((campusData) => (
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
                                  {/* 楼层层级 */}
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
                                      {floor.classrooms.map((classroom) => (
                                        <button
                                          key={classroom}
                                          onClick={() => setSelectedClassroom(classroom)}
                                          className={`flex items-center gap-2 w-full p-2 rounded-md text-sm transition-colors ${
                                            selectedClassroom === classroom
                                              ? "bg-primary/10 text-primary"
                                              : "hover:bg-accent text-primary"
                                          }`}
                                        >
                                          <Monitor className="h-3 w-3" />
                                          <span className="text-sm">{classroom}</span>
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
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">课表排课</h1>
            <p className="mt-1 text-sm text-muted-foreground">教学课程安排与管理</p>
          </div>
          <div className="flex items-center gap-2">
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
              新建课程
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="搜索课程、教师、教室..."
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Grid */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>本周课表</CardTitle>
                  <CardDescription>2024年第3周 (1月15日 - 1月21日)</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    上一周
                  </Button>
                  <Button variant="ghost" size="sm">
                    下一周
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-3 text-left text-sm font-medium text-muted-foreground">时间</th>
                      {weekDays.map((day) => (
                        <th key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((time, timeIndex) => (
                      <tr key={time} className="border-b border-border">
                        <td className="p-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {time}
                          </div>
                        </td>
                        {weekDays.map((day, dayIndex) => {
                          const hasCourse = Math.random() > 0.3
                          return (
                            <td key={day} className="p-2">
                              {hasCourse ? (
                                <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 hover:bg-primary/20 transition-colors cursor-pointer">
                                  <p className="text-sm font-medium text-foreground">高等数学</p>
                                  <p className="mt-1 text-xs text-muted-foreground">张老师</p>
                                  <p className="mt-1 text-xs text-muted-foreground">101教室</p>
                                  <Badge variant="outline" className="mt-2 text-xs border-primary/50 text-primary">
                                    已排课
                                  </Badge>
                                </div>
                              ) : (
                                <div className="flex h-full min-h-[100px] items-center justify-center rounded-lg border border-dashed border-border hover:border-muted-foreground hover:bg-accent transition-colors cursor-pointer">
                                  <Plus className="h-5 w-5 text-muted-foreground" />
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
            </CardContent>
          </Card>

          {/* Course List */}
          <Card>
            <CardHeader>
              <CardTitle>课程列表</CardTitle>
              <CardDescription>所有已排课程</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "高等数学", teacher: "张老师", room: "101", time: "周一 08:00-09:40", students: 120 },
                  { name: "大学英语", teacher: "李老师", room: "102", time: "周一 10:00-11:40", students: 80 },
                  { name: "计算机基础", teacher: "王老师", room: "103", time: "周二 14:00-15:40", students: 100 },
                  { name: "物理实验", teacher: "刘老师", room: "201", time: "周三 14:00-16:40", students: 45 },
                ].map((course, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{course.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {course.teacher} · {course.room}教室 · {course.students}人
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{course.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        编辑
                      </Button>
                      <Button size="sm" variant="ghost">
                        删除
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  )
}
