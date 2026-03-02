"use client"

import { ClassroomCard } from "./classroom-card"
import { ClassroomListItem } from "./classroom-list-item"

interface ClassroomGridProps {
  viewMode: "list" | "large" | "small" | "iot"
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
  // Filter classrooms
  const filteredClassrooms = mockClassrooms.filter((classroom) => {
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

  if (viewMode === "list") {
    return (
      <div className="space-y-2">
        {filteredClassrooms.map((classroom) => (
          <ClassroomListItem
            key={classroom.id}
            classroom={classroom}
            onClick={() => onClassroomClick(classroom.id)}
            isMultiSelectMode={isMultiSelectMode}
            isSelected={selectedClassrooms.includes(classroom.id)}
            onToggleSelect={() => onToggleClassroom?.(classroom.id)}
          />
        ))}
      </div>
    )
  }

  const gridClass =
    viewMode === "small"
      ? "grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
      : viewMode === "iot"
        ? "grid-cols-3 xl:grid-cols-4"
        : "grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"

  return (
    <div className={`grid ${gridClass} gap-4`}>
      {filteredClassrooms.map((classroom) => (
        <ClassroomCard
          key={classroom.id}
          classroom={classroom}
          viewMode={viewMode}
          onClick={() => onClassroomClick(classroom.id)}
          isMultiSelectMode={isMultiSelectMode}
          isSelected={selectedClassrooms.includes(classroom.id)}
          onToggleSelect={() => onToggleClassroom?.(classroom.id)}
        />
      ))}
    </div>
  )
}
