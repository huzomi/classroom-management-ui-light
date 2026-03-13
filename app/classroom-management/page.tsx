"use client"

import { useState, useEffect } from "react"
import { BuildingTree, type TreeNode } from "@/components/classroom/building-tree"
import { RoomCard, type RoomData, type RoomStatus, type UsageStatus } from "@/components/classroom/room-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  LayoutGrid,
  List,
  Power,
  PowerOff,
  Lock,
  Unlock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { searchRooms } from "@/lib/api/room"

type ViewMode = "list" | "card"
type StatusFilter = "all" | RoomStatus | "offline"

function getFilterFromNode(
  treeData: TreeNode[],
  nodeId: string | null
): { buildingId?: string; floorId?: string } {
  if (!nodeId) return {}

  const findNode = (
    nodes: TreeNode[],
    id: string,
    parent?: { buildingId?: string; floorId?: string }
  ): { node?: TreeNode; context?: { buildingId?: string; floorId?: string } } => {
    for (const node of nodes) {
      if (node.id === id) return { node, context: parent }
      if (node.children) {
        const newContext =
          node.type === "building"
            ? { buildingId: node.id }
            : node.type === "floor"
              ? { ...parent, floorId: node.id }
              : parent
        const result = findNode(node.children, id, newContext)
        if (result.node) return result
      }
    }
    return {}
  }

  const { node, context } = findNode(treeData, nodeId)
  if (!node) return {}

  if (node.type === "building") return { buildingId: node.id }
  if (node.type === "floor") return { ...context, floorId: node.id }
  return {}
}

function mapSearchVOToRoomData(vo: import("@/lib/api/room").RoomSearchVO): RoomData {
  const statusMap: Record<number, UsageStatus> = {
    1: "teaching",
    2: "idle",
    3: "offline",
    4: "self-study",
    5: "exam",
  }
  const env = vo.environmentalInfo ?? {}
  return {
    id: vo.roomId,
    name: vo.classRoom,
    building: "",
    floor: "",
    usageStatus: statusMap[vo.status] ?? "idle",
    faultType: vo.isFault === 1 ? "ip-phone" : undefined,
    abnormalType: vo.isFault === 3 ? "no-class-power-on" : undefined,
    currentCourse:
      vo.courseName
        ? {
            name: vo.courseName,
            teacher: vo.teacherName ?? "",
            time: vo.lessonStartTime && vo.lessonEndTime
              ? `${vo.lessonStartTime.slice(0, 5)}-${vo.lessonEndTime.slice(0, 5)}`
              : "",
          }
        : undefined,
    devices: { pc: "online", projector: "online", light: "on", ac: "on", door: "locked" },
    iotInfo: { controller: vo.status === 3 ? "offline" : "online" },
    environment: {
      temp: Number(env["温度"] ?? 0),
      humidity: Number(env["湿度"] ?? 0),
      co2: Number(env["CO2"] ?? 0),
    },
    power: 0,
  }
}

const STATUS_TO_API: Record<StatusFilter, number | undefined> = {
  all: undefined,
  teaching: 1,
  idle: 2,
  offline: 3,
  "self-study": 4,
  exam: 5,
  fault: undefined,
  abnormal: undefined,
}
const IS_FAULT_MAP: Record<StatusFilter, number | undefined> = {
  all: undefined,
  teaching: undefined,
  idle: undefined,
  offline: undefined,
  "self-study": undefined,
  exam: undefined,
  fault: 1,
  abnormal: 3,
}

export default function ClassroomManagementPage() {
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [rooms, setRooms] = useState<RoomData[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 20
  const [loading, setLoading] = useState(true)

  const treeFilter = getFilterFromNode(treeData, selectedNode)

  useEffect(() => {
    setLoading(true)
    searchRooms({
      buildingId: treeFilter.buildingId,
      floorId: treeFilter.floorId,
      classRoom: searchQuery || undefined,
      status: STATUS_TO_API[statusFilter],
      isFault: IS_FAULT_MAP[statusFilter],
      page,
      pageSize,
    })
      .then((res) => {
        setRooms(res.records.map(mapSearchVOToRoomData))
        setTotal(res.total)
      })
      .catch((err) => {
        console.error("加载教室列表失败:", err)
        setRooms([])
        setTotal(0)
      })
      .finally(() => setLoading(false))
  }, [treeFilter.buildingId, treeFilter.floorId, statusFilter, searchQuery, page])

  useEffect(() => {
    setPage(1)
  }, [treeFilter.buildingId, treeFilter.floorId, statusFilter, searchQuery])

  const filteredRooms = rooms

  const toggleRoomSelection = (roomId: string) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    )
  }

  const handleBatchAction = (action: string) => {
    console.log(`Batch action: ${action} on rooms:`, selectedRooms)
  }

  const handleSelectAll = () => {
    setSelectedRooms(filteredRooms.map((r) => r.id))
  }

  const handleClearSelection = () => {
    setSelectedRooms([])
  }

  const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "全部" },
    { key: "teaching", label: "上课" },
    { key: "idle", label: "空闲" },
    { key: "offline", label: "离线" },
    { key: "self-study", label: "自习" },
    { key: "exam", label: "考试" },
    { key: "fault", label: "故障" },
    { key: "abnormal", label: "异常" },
  ]

  return (
    <div className="flex h-full">
      {/* Left Panel - Building Tree */}
      <div className="w-64 shrink-0 border-r border-border bg-card p-4">
        <BuildingTree
          selectedNode={selectedNode}
          onSelectNode={(node) => setSelectedNode(node.id)}
          onTreeLoaded={setTreeData}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden px-6 pt-4">
        {/* Toolbar */}
        <div className="mb-4 flex h-12 shrink-0 items-center justify-between gap-4 rounded-lg border border-border bg-card px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedRooms.length === filteredRooms.length && filteredRooms.length > 0}
                onChange={() => {
                  if (selectedRooms.length === filteredRooms.length) {
                    handleClearSelection()
                  } else {
                    handleSelectAll()
                  }
                }}
                className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
              />
              <span className="text-sm text-muted-foreground">
                已选 <span className="font-semibold text-primary">{selectedRooms.length}</span>/{filteredRooms.length}
              </span>
            </div>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleBatchAction("class-start")}
                className="h-8 gap-1.5 px-2"
                disabled={selectedRooms.length === 0}
              >
                <Power className="h-4 w-4" />
                上课
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleBatchAction("class-end")}
                className="h-8 gap-1.5 px-2"
                disabled={selectedRooms.length === 0}
              >
                <PowerOff className="h-4 w-4" />
                下课
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleBatchAction("lock-panel")}
                className="h-8 gap-1.5 px-2"
                disabled={selectedRooms.length === 0}
              >
                <Lock className="h-4 w-4" />
                锁定
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleBatchAction("unlock-panel")}
                className="h-8 gap-1.5 px-2"
                disabled={selectedRooms.length === 0}
              >
                <Unlock className="h-4 w-4" />
                解锁
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索教室..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-40 bg-secondary pl-8 text-sm"
              />
            </div>
            <div className="flex h-8 items-center rounded-md bg-secondary p-0.5">
              {statusFilters.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setStatusFilter(item.key)}
                  className={cn(
                    "h-7 rounded px-2 text-xs font-medium transition-colors",
                    statusFilter === item.key
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="h-5 w-px bg-border" />
            <div className="flex h-8 items-center rounded-md bg-secondary p-0.5">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded transition-colors",
                  viewMode === "list"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="列表视图"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded transition-colors",
                  viewMode === "card"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="卡片视图"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Room List/Cards */}
        <div
          className={cn(
            "flex-1 overflow-auto pb-6",
            viewMode === "list"
              ? "space-y-3 pr-1"
              : "grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 content-start"
          )}
        >
          {loading ? (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
              加载中...
            </div>
          ) : (
            filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                viewMode={viewMode}
                selected={selectedRooms.includes(room.id)}
                onSelect={() => toggleRoomSelection(room.id)}
              />
            ))
          )}
          {!loading && filteredRooms.length === 0 && (
            <div className="col-span-full flex h-64 items-center justify-center text-muted-foreground">
              没有找到符合条件的教室
            </div>
          )}
        </div>

        {total > pageSize && (
          <div className="flex items-center justify-center gap-2 py-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              上一页
            </Button>
            <span className="text-sm text-muted-foreground">
              第 {page} 页 / 共 {Math.ceil(total / pageSize)} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage((p) => p + 1)}
            >
              下一页
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
