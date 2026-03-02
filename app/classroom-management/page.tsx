"use client"

import { useState } from "react"
import { ClassroomGrid } from "@/components/classroom/classroom-grid"
import { ClassroomTree } from "@/components/classroom/classroom-tree"
import { ClassroomToolbar } from "@/components/classroom/classroom-toolbar"
import { ClassroomDetailModal } from "@/components/classroom/classroom-detail-modal"

export default function ClassroomManagementPage() {
  const [viewMode, setViewMode] = useState<"list" | "large" | "small" | "iot">("large")
  const [filterStatus, setFilterStatus] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNode, setSelectedNode] = useState<string>("campus-1")
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null)
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([])
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false)

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Tree Structure */}
      <aside className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-base">校区结构</h2>
          <p className="text-xs text-muted-foreground mt-1">选择查看教室</p>
        </div>
        <ClassroomTree selectedNode={selectedNode} onSelectNode={setSelectedNode} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <ClassroomToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          isMultiSelectMode={isMultiSelectMode}
          onMultiSelectModeChange={setIsMultiSelectMode}
          selectedClassrooms={selectedClassrooms}
          onClearSelection={() => setSelectedClassrooms([])}
        />

        {/* Classroom Grid */}
        <div className="flex-1 overflow-auto p-6">
          <ClassroomGrid
            viewMode={viewMode}
            filterStatus={filterStatus}
            searchQuery={searchQuery}
            selectedNode={selectedNode}
            onClassroomClick={setSelectedClassroom}
            isMultiSelectMode={isMultiSelectMode}
            selectedClassrooms={selectedClassrooms}
            onToggleClassroom={(id) => {
              if (selectedClassrooms.includes(id)) {
                setSelectedClassrooms(selectedClassrooms.filter((cid) => cid !== id))
              } else {
                setSelectedClassrooms([...selectedClassrooms, id])
              }
            }}
          />
        </div>
      </main>

      {/* Detail Modal */}
      {selectedClassroom && (
        <ClassroomDetailModal classroomId={selectedClassroom} onClose={() => setSelectedClassroom(null)} />
      )}
    </div>
  )
}
