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
    <div className="flex h-[calc(100vh-4rem)]">
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
              <h1 className="text-2xl font-semibold text-foreground">课表管理</h1>
              <p className="mt-1 text-sm text-muted-foreground">根据排课时间联动控制教室设备，实现教学场景智能控制</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                导入课表
              </Button>
              <Button variant="outline">
                导出课表
              </Button>
              <Button>
                添加课程
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Week Selector and Search */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">教学周</span>
                <select className="border border-border rounded-md px-3 py-1.5 text-sm bg-background">
                  <option>第4周</option>
                  <option>第5周</option>
                  <option>第6周</option>
                </select>
                <span className="text-sm text-muted-foreground">2024-2025第二学期</span>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Input
                placeholder="搜索教室、课程或教师..."
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">本周课程</p>
                  <p className="text-3xl font-bold text-foreground mt-1">0</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">上课中</p>
                  <p className="text-3xl font-bold text-primary mt-1">0</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">待上课</p>
                  <p className="text-3xl font-bold text-primary mt-1">0</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">已结束</p>
                  <p className="text-3xl font-bold text-foreground mt-1">0</p>
                </CardContent>
              </Card>
            </div>

            {/* Schedule Grid */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="p-3 text-left text-sm font-medium text-muted-foreground w-28">节次</th>
                        {weekDays.map((day) => (
                          <th key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "第1节", time: "08:30-09:15" },
                        { name: "第2节", time: "09:15-10:00" },
                        { name: "第3节", time: "10:10-10:55" },
                        { name: "第4节", time: "10:55-11:40" },
                        { name: "第5节", time: "14:00-14:45" },
                        { name: "第6节", time: "14:45-15:30" },
                      ].map((slot) => (
                        <tr key={slot.name} className="border-b border-border">
                          <td className="p-3 text-sm">
                            <div className="font-medium text-foreground">{slot.name}</div>
                            <div className="text-xs text-muted-foreground">{slot.time}</div>
                          </td>
                          {weekDays.map((day) => (
                            <td key={day} className="p-2">
                              <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer group">
                                <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary">
                                  <Plus className="h-4 w-4" />
                                  <span className="text-xs mt-1">添加</span>
                                </div>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
