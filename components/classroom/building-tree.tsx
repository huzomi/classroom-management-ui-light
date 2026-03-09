"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Building,
  ChevronRight,
  Layers,
  School,
  MapPin,
} from "lucide-react"

export interface TreeNode {
  id: string
  name: string
  type: "campus" | "building" | "floor" | "room"
  children?: TreeNode[]
  roomCount?: number
  roomId?: string // 用于教室节点关联实际教室ID
}

export const treeData: TreeNode[] = [
  {
    id: "campus-1",
    name: "主校区",
    type: "campus",
    children: [
      {
        id: "building-a",
        name: "教学楼A",
        type: "building",
        roomCount: 48,
        children: [
          {
            id: "floor-a1",
            name: "1楼",
            type: "floor",
            roomCount: 12,
            children: [
              { id: "room-a101", name: "A101", type: "room", roomId: "a101" },
              { id: "room-a102", name: "A102", type: "room", roomId: "a102" },
              { id: "room-a103", name: "A103", type: "room", roomId: "a103" },
            ],
          },
          {
            id: "floor-a2",
            name: "2楼",
            type: "floor",
            roomCount: 12,
            children: [
              { id: "room-a201", name: "A201", type: "room", roomId: "a201" },
              { id: "room-a202", name: "A202", type: "room", roomId: "a202" },
              { id: "room-a203", name: "A203", type: "room", roomId: "a203" },
            ],
          },
          {
            id: "floor-a3",
            name: "3楼",
            type: "floor",
            roomCount: 12,
          },
          {
            id: "floor-a4",
            name: "4楼",
            type: "floor",
            roomCount: 12,
          },
        ],
      },
      {
        id: "building-b",
        name: "教学楼B",
        type: "building",
        roomCount: 36,
        children: [
          {
            id: "floor-b1",
            name: "1楼",
            type: "floor",
            roomCount: 12,
            children: [
              { id: "room-b101", name: "B101", type: "room", roomId: "b101" },
              { id: "room-b102", name: "B102", type: "room", roomId: "b102" },
            ],
          },
          { id: "floor-b2", name: "2楼", type: "floor", roomCount: 12 },
          { id: "floor-b3", name: "3楼", type: "floor", roomCount: 12 },
        ],
      },
      {
        id: "building-exp",
        name: "实验楼",
        type: "building",
        roomCount: 24,
      },
      {
        id: "building-lib",
        name: "图书馆",
        type: "building",
        roomCount: 16,
      },
    ],
  },
  {
    id: "campus-2",
    name: "南校区",
    type: "campus",
    children: [
      {
        id: "building-c",
        name: "教学楼C",
        type: "building",
        roomCount: 32,
      },
      {
        id: "building-d",
        name: "教学楼D",
        type: "building",
        roomCount: 28,
      },
    ],
  },
]

/** 从树数据中收集所有教室 roomId */
export function getAllRoomIds(nodes: TreeNode[]): string[] {
  const ids: string[] = []
  const walk = (list: TreeNode[]) => {
    for (const node of list) {
      if (node.type === "room" && node.roomId) ids.push(node.roomId)
      if (node.children?.length) walk(node.children)
    }
  }
  walk(nodes)
  return ids
}

interface BuildingTreeProps {
  selectedNode?: string | null
  onSelectNode?: (node: TreeNode) => void
  onRoomClick?: (roomId: string) => void
  /** 多选模式下已选中的教室 ID 列表（用于监控页快速定位） */
  selectedRoomIds?: string[]
  /** 自定义标题，默认「空间架构」 */
  title?: string
  /** 自定义副标题，默认「386 教室」 */
  subtitle?: string
  /** 教室状态映射，用于在树节点显示状态徽章（如监控页的「上课」「故障」） */
  roomStatusMap?: Record<string, string>
}

export function BuildingTree({
  selectedNode = null,
  onSelectNode,
  onRoomClick,
  selectedRoomIds,
  title = "空间架构",
  subtitle = "386 教室",
  roomStatusMap,
}: BuildingTreeProps) {
  const router = useRouter()
  const [expandedNodes, setExpandedNodes] = useState<string[]>([
    "campus-1",
    "building-a",
  ])

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    )
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "campus":
        return School
      case "building":
        return Building
      case "floor":
        return Layers
      case "room":
        return MapPin
      default:
        return Building
    }
  }

  const handleNodeClick = (node: TreeNode) => {
    // 教室节点：若有 onRoomClick 则调用（监控页多选），否则跳转驾驶舱
    if (node.type === "room" && node.roomId) {
      if (onRoomClick) {
        onRoomClick(node.roomId)
        return
      }
      router.push(`/classroom-management/${node.roomId}`)
      return
    }

    // 若有子节点，展开/收起
    const hasChildren = node.children && node.children.length > 0
    if (hasChildren) {
      toggleNode(node.id)
    }

    onSelectNode?.(node)
  }

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const Icon = getIcon(node.type)
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedNodes.includes(node.id)
    const isSelected = selectedNode === node.id
    const isRoom = node.type === "room"
    const isRoomSelected = isRoom && node.roomId && selectedRoomIds?.includes(node.roomId)
    const roomStatus = isRoom && node.roomId ? roomStatusMap?.[node.roomId] : undefined

    return (
      <div key={node.id}>
        <button
          onClick={() => handleNodeClick(node)}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
            isSelected || isRoomSelected
              ? "bg-primary/10 text-primary"
              : "text-foreground hover:bg-secondary",
            isRoom && "hover:bg-primary/10 hover:text-primary"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {hasChildren ? (
            <ChevronRight
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                isExpanded && "rotate-90"
              )}
            />
          ) : (
            <span className="w-4" />
          )}
          <Icon className={cn(
            "h-4 w-4 shrink-0",
            isRoom ? "text-primary" : "text-muted-foreground"
          )} />
          <span className="truncate">{node.name}</span>
          {node.roomCount && !isRoom && (
            <span className="ml-auto shrink-0 text-xs text-muted-foreground">
              {node.roomCount}
            </span>
          )}
          {roomStatus === "in-class" && (
            <span className="ml-auto shrink-0 rounded px-1.5 py-0.5 text-xs bg-primary/20 text-primary">
              上课
            </span>
          )}
          {roomStatus === "fault" && (
            <span className="ml-auto shrink-0 rounded px-1.5 py-0.5 text-xs bg-destructive/20 text-destructive">
              故障
            </span>
          )}
          {isRoom && !roomStatus && (
            <ChevronRight className="ml-auto h-3 w-3 text-muted-foreground" />
          )}
        </button>
        {hasChildren && isExpanded && (
          <div>
            {node.children?.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="mb-3 flex items-center justify-between px-2">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
      <div className="space-y-0.5">
        {treeData.map((node) => renderNode(node))}
      </div>
    </div>
  )
}
