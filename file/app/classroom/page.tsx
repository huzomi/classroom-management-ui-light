"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { BuildingTree, TreeNode, treeData } from "@/components/classroom/building-tree"
import { RoomCard, RoomData, RoomStatus, FaultType, AbnormalType } from "@/components/classroom/room-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  LayoutGrid,
  List,
  Bell,
  User,
  Power,
  PowerOff,
  Lock,
  Unlock,
} from "lucide-react"
import { cn } from "@/lib/utils"

const mockRooms: RoomData[] = [
  {
    id: "a101",
    name: "A101",
    building: "教学楼A",
    floor: "1楼",
    status: "teaching",
    currentCourse: {
      name: "数据结构与算法",
      teacher: "张教授",
      time: "08:00-09:40",
    },
    devices: {
      pc: "online",
      projector: "online",
      light: "on",
      ac: "on",
      door: "locked",
    },
    iotInfo: {
      controller: "online",
    },
    environment: { temp: 24, humidity: 55, co2: 480 },
    power: 2450,
  },
  {
    id: "a102",
    name: "A102",
    building: "教学楼A",
    floor: "1楼",
    status: "idle",
    devices: {
      pc: "online",
      projector: "online",
      light: "off",
      ac: "off",
      door: "unlocked",
    },
    iotInfo: {
      controller: "online",
    },
    environment: { temp: 22, humidity: 52, co2: 420 },
    power: 120,
  },
  {
    id: "a103",
    name: "A103",
    building: "教学楼A",
    floor: "1楼",
    status: "fault",
    faultType: "mini-program",
    devices: {
      pc: "offline",
      projector: "online",
      light: "on",
      ac: "on",
      door: "locked",
    },
    iotInfo: {
      controller: "offline",
    },
    environment: { temp: 25, humidity: 58, co2: 510 },
    power: 1800,
  },
  {
    id: "a201",
    name: "A201",
    building: "教学楼A",
    floor: "2楼",
    status: "teaching",
    currentCourse: {
      name: "线性代数",
      teacher: "李教授",
      time: "08:00-09:40",
    },
    devices: {
      pc: "online",
      projector: "online",
      light: "on",
      ac: "on",
      door: "locked",
    },
    iotInfo: {
      controller: "online",
    },
    environment: { temp: 23, humidity: 54, co2: 520 },
    power: 2380,
  },
  {
    id: "a202",
    name: "A202",
    building: "教学楼A",
    floor: "2楼",
    status: "exam",
    currentCourse: {
      name: "期中考试",
      teacher: "监考组",
      time: "09:00-11:00",
    },
    devices: {
      pc: "online",
      projector: "offline",
      light: "on",
      ac: "on",
      door: "locked",
    },
    iotInfo: {
      controller: "online",
    },
    environment: { temp: 23, humidity: 50, co2: 580 },
    power: 1650,
  },
  {
    id: "a203",
    name: "A203",
    building: "教学楼A",
    floor: "2楼",
    status: "self-study",
    devices: {
      pc: "online",
      projector: "online",
      light: "on",
      ac: "on",
      door: "unlocked",
    },
    iotInfo: {
      controller: "online",
    },
    environment: { temp: 21, humidity: 48, co2: 400 },
    power: 1200,
  },
  {
    id: "b101",
    name: "B101",
    building: "教学楼B",
    floor: "1楼",
    status: "teaching",
    currentCourse: {
      name: "大学英语",
      teacher: "王老师",
      time: "08:00-09:40",
    },
    devices: {
      pc: "online",
      projector: "online",
      light: "on",
      ac: "on",
      door: "locked",
    },
    iotInfo: {
      controller: "online",
    },
    environment: { temp: 24, humidity: 56, co2: 490 },
    power: 2200,
  },
  {
    id: "b102",
    name: "B102",
    building: "教学楼B",
    floor: "1楼",
    status: "fault",
    faultType: "ip-phone",
    devices: {
      pc: "online",
      projector: "offline",
      light: "off",
      ac: "off",
      door: "unlocked",
    },
    iotInfo: {
      controller: "online",
    },
    environment: { temp: 22, humidity: 50, co2: 410 },
    power: 95,
  },
  {
    id: "a301",
    name: "A301",
    building: "教学楼A",
    floor: "3楼",
    status: "abnormal",
    abnormalType: "class-no-power",
    currentCourse: {
      name: "高等数学",
      teacher: "陈教授",
      time: "08:00-09:40",
    },
    devices: {
      pc: "offline",
      projector: "offline",
      light: "off",
      ac: "off",
      door: "unlocked",
    },
    iotInfo: {
      controller: "online",
    },
    environment: { temp: 21, humidity: 48, co2: 380 },
    power: 50,
  },
  {
    id: "a302",
    name: "A302",
    building: "教学楼A",
    floor: "3楼",
    status: "abnormal",
    abnormalType: "no-class-power-on",
    devices: {
      pc: "online",
      projector: "online",
      light: "on",
      ac: "on",
      door: "unlocked",
    },
    iotInfo: {
      controller: "online",
    },
    environment: { temp: 24, humidity: 52, co2: 420 },
    power: 2100,
  },
]

type ViewMode = "list" | "card"
type StatusFilter = "all" | RoomStatus

// 根据选中的节点获取筛选条件
function getFilterFromNode(nodeId: string | null): { building?: string; floor?: string } {
  if (!nodeId) return {}
  
  const findNode = (nodes: TreeNode[], id: string, parent?: { building?: string; floor?: string }): { node?: TreeNode; context?: { building?: string; floor?: string } } => {
    for (const node of nodes) {
      if (node.id === id) {
        return { node, context: parent }
      }
      if (node.children) {
        const newContext = node.type === "building" 
          ? { building: node.name }
          : node.type === "floor"
            ? { ...parent, floor: node.name }
            : parent
        const result = findNode(node.children, id, newContext)
        if (result.node) return result
      }
    }
    return {}
  }
  
  const { node, context } = findNode(treeData, nodeId)
  if (!node) return {}
  
  if (node.type === "building") {
    return { building: node.name }
  } else if (node.type === "floor") {
    return { ...context, floor: node.name }
  }
  
  return {}
}

export default function ClassroomPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>("building-a")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const treeFilter = getFilterFromNode(selectedNode)

  const filteredRooms = mockRooms.filter((room) => {
    if (treeFilter.building && room.building !== treeFilter.building) return false
    if (treeFilter.floor && room.floor !== treeFilter.floor) return false
    if (statusFilter !== "all" && room.status !== statusFilter) return false
    if (searchQuery && !room.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const toggleRoomSelection = (roomId: string) => {
    setSelectedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
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
    { key: "self-study", label: "自习" },
    { key: "exam", label: "考试" },
    { key: "fault", label: "故障" },
    { key: "abnormal", label: "异常" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={cn("transition-all duration-300", sidebarCollapsed ? "pl-0" : "pl-60")}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-foreground">教室管理</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                3
              </span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="flex">
          {/* Left Panel - Building Tree */}
          <div className="w-64 shrink-0 border-r border-border p-4">
            <BuildingTree
              selectedNode={selectedNode}
              onSelectNode={(node) => setSelectedNode(node.id)}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Toolbar - 固定高度，批量操作和搜索在同一行 */}
            <div className="mb-4 flex h-12 items-center justify-between gap-4 rounded-lg border border-border bg-card px-4">
              {/* 左侧：全选、选中计数、批量操作 */}
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

                {/* 批量操作按钮 - 始终显示但禁用状态变化 */}
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

              {/* 右侧：搜索、状态筛选、视图切换 */}
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
                viewMode === "list"
                  ? "space-y-2"
                  : "grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4"
              )}
            >
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  viewMode={viewMode}
                  selected={selectedRooms.includes(room.id)}
                  onSelect={() => toggleRoomSelection(room.id)}
                />
              ))}
            </div>

            {filteredRooms.length === 0 && (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                没有找到符合条件的教室
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
