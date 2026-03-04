"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClassroomCard } from "./classroom-card"
import { ClassroomListItem } from "./classroom-list-item"

type DeviceKey = "projector" | "lights" | "ac" | "computer"

interface ClassroomGridProps {
  viewMode: "list" | "large"
  filterStatus: string[]
  searchQuery: string
  selectedNode: string
  onClassroomClick: (id: string) => void
  isMultiSelectMode?: boolean
  selectedClassrooms?: string[]
  onToggleClassroom?: (id: string) => void
}

// Mock data
const mockClassrooms = [
  {
    id: "101",
    name: "101教室",
    status: "in-class",
    teacher: "张老师",
    course: "高等数学",
    temperature: 24,
    humidity: 45,
    pm25: 12,
    co2: 450,
    online: true,
    deviceStatus: { projector: true, lights: true, ac: true, computer: true },
  },
  {
    id: "102",
    name: "102教室",
    status: "idle",
    teacher: null,
    course: null,
    temperature: 23,
    humidity: 40,
    pm25: 10,
    co2: 400,
    online: true,
    deviceStatus: { projector: false, lights: false, ac: false, computer: false },
  },
  {
    id: "103",
    name: "103教室",
    status: "fault",
    teacher: null,
    course: null,
    temperature: 0,
    humidity: 0,
    pm25: 0,
    co2: 0,
    online: false,
    deviceStatus: { projector: false, lights: false, ac: false, computer: false },
  },
  {
    id: "104",
    name: "104教室",
    status: "in-class",
    teacher: "李老师",
    course: "大学英语",
    temperature: 25,
    humidity: 48,
    pm25: 15,
    co2: 500,
    online: true,
    deviceStatus: { projector: true, lights: true, ac: true, computer: true },
  },
  {
    id: "201",
    name: "201教室",
    status: "idle",
    teacher: null,
    course: null,
    temperature: 22,
    humidity: 42,
    pm25: 11,
    co2: 420,
    online: true,
    deviceStatus: { projector: false, lights: false, ac: false, computer: false },
  },
  {
    id: "202",
    name: "202教室",
    status: "offline",
    teacher: null,
    course: null,
    temperature: 0,
    humidity: 0,
    pm25: 0,
    co2: 0,
    online: false,
    deviceStatus: { projector: false, lights: false, ac: false, computer: false },
  },
]

export function ClassroomGrid({
  viewMode,
  filterStatus,
  searchQuery,
  selectedNode,
  onClassroomClick,
  isMultiSelectMode = false,
  selectedClassrooms = [],
  onToggleClassroom,
}: ClassroomGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [classrooms, setClassrooms] = useState(mockClassrooms)

  const handleDeviceToggle = (classroomId: string, deviceKey: DeviceKey) => {
    setClassrooms((prev) =>
      prev.map((c) =>
        c.id === classroomId
          ? {
              ...c,
              deviceStatus: {
                ...c.deviceStatus,
                [deviceKey]: !c.deviceStatus[deviceKey],
              },
            }
          : c
      )
    )
  }

  // Filter classrooms
  const filteredClassrooms = classrooms.filter((classroom) => {
    if (filterStatus.length > 0 && !filterStatus.includes(classroom.status)) {
      return false
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        classroom.name.toLowerCase().includes(query) ||
        classroom.teacher?.toLowerCase().includes(query) ||
        classroom.course?.toLowerCase().includes(query)
      )
    }
    return true
  })

  const totalItems = filteredClassrooms.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  // 筛选条件变化导致总页数减少时，确保当前页不超出范围
  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages))
  }, [totalPages])
  const startIndex = (currentPage - 1) * pageSize
  const paginatedClassrooms = filteredClassrooms.slice(startIndex, startIndex + pageSize)

  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          {paginatedClassrooms.map((classroom) => (
          <ClassroomListItem
            key={classroom.id}
            classroom={classroom}
            onClick={() => onClassroomClick(classroom.id)}
            onDeviceToggle={(deviceKey) => handleDeviceToggle(classroom.id, deviceKey)}
            isMultiSelectMode={isMultiSelectMode}
            isSelected={selectedClassrooms.includes(classroom.id)}
            onToggleSelect={() => onToggleClassroom?.(classroom.id)}
          />
        ))}
        </div>
        {/* 分页 */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <span className="text-sm text-muted-foreground">共 {totalItems} 条数据</span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              ‹
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-primary text-primary-foreground"
            >
              {currentPage}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              ›
            </Button>
          </div>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1) }}>
            <SelectTrigger className="w-24 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">8 条/页</SelectItem>
              <SelectItem value="12">12 条/页</SelectItem>
              <SelectItem value="24">24 条/页</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  const gridClass = "grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"

  return (
    <div className="flex flex-col gap-4">
      <div className={`grid ${gridClass} gap-4`}>
        {paginatedClassrooms.map((classroom) => (
        <ClassroomCard
          key={classroom.id}
          classroom={classroom}
          viewMode={viewMode}
          onClick={() => onClassroomClick(classroom.id)}
          onDeviceToggle={(deviceKey) => handleDeviceToggle(classroom.id, deviceKey)}
          isMultiSelectMode={isMultiSelectMode}
          isSelected={selectedClassrooms.includes(classroom.id)}
          onToggleSelect={() => onToggleClassroom?.(classroom.id)}
        />
      ))}
      </div>
      {/* 分页 */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <span className="text-sm text-muted-foreground">共 {totalItems} 条数据</span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            ‹
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-primary text-primary-foreground"
          >
            {currentPage}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            ›
          </Button>
        </div>
        <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1) }}>
          <SelectTrigger className="w-24 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="8">8 条/页</SelectItem>
            <SelectItem value="12">12 条/页</SelectItem>
            <SelectItem value="24">24 条/页</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
