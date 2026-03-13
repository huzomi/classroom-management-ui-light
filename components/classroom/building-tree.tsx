"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Building,
  ChevronRight,
  Layers,
  School,
  MapPin,
  Loader2,
} from "lucide-react"
import { getCampusTree } from "@/lib/api/campus"
import type { CampusBuildingFloorTreeVO } from "@/lib/api/campus"

export interface TreeNode {
  id: string
  name: string
  type: "campus" | "building" | "floor" | "room"
  children?: TreeNode[]
  roomCount?: number
  roomId?: string
}

function convertApiTree(data: CampusBuildingFloorTreeVO[]): TreeNode[] {
  return data.map((campus) => ({
    id: campus.id,
    name: campus.name,
    type: "campus" as const,
    children: campus.buildings?.map((building) => ({
      id: building.id,
      name: building.name,
      type: "building" as const,
      roomCount: building.floors?.reduce(
        (sum, f) => sum + (f.rooms?.length ?? 0),
        0
      ),
      children: building.floors?.map((floor) => ({
        id: floor.id,
        name: floor.name,
        type: "floor" as const,
        roomCount: floor.rooms?.length ?? 0,
        children: floor.rooms?.map((room) => ({
          id: `room-${room.id}`,
          name: room.name,
          type: "room" as const,
          roomId: room.id,
        })),
      })),
    })),
  }))
}

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
  selectedRoomIds?: string[]
  onRoomSelectionChange?: (ids: string[]) => void
  title?: string
  subtitle?: string
  roomStatusMap?: Record<string, string>
  /** 树加载完成回调（用于监控页获取 allRoomIds） */
  onTreeLoaded?: (tree: TreeNode[]) => void
}

export function BuildingTree({
  selectedNode = null,
  onSelectNode,
  onRoomClick,
  selectedRoomIds,
  onRoomSelectionChange,
  title = "空间架构",
  subtitle,
  roomStatusMap,
  onTreeLoaded,
}: BuildingTreeProps) {
  const router = useRouter()
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedNodes, setExpandedNodes] = useState<string[]>([])

  useEffect(() => {
    setLoading(true)
    getCampusTree()
      .then((data) => {
        const tree = convertApiTree(data ?? [])
        setTreeData(tree)
        if (tree.length > 0) {
          setExpandedNodes([tree[0].id])
        }
        onTreeLoaded?.(tree)
      })
      .catch((err) => {
        console.error("加载空间架构失败:", err)
        setTreeData([])
      })
      .finally(() => setLoading(false))
  }, [onTreeLoaded])

  const allRoomIds = getAllRoomIds(treeData)
  const displaySubtitle = subtitle ?? `${allRoomIds.length} 教室`

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
    // 教室节点：多选模式（监控页快速定位）或单选跳转
    if (node.type === "room" && node.roomId) {
      if (onRoomSelectionChange && selectedRoomIds) {
        const next = selectedRoomIds.includes(node.roomId)
          ? selectedRoomIds.filter((id) => id !== node.roomId)
          : [...selectedRoomIds, node.roomId]
        onRoomSelectionChange(next)
        return
      }
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
          {isRoom && !roomStatus && !selectedRoomIds && (
            <ChevronRight className="ml-auto h-3 w-3 text-muted-foreground" />
          )}
          {isRoom && selectedRoomIds && (
            <span
              className={cn(
                "ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px]",
                isRoomSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/50 text-transparent"
              )}
            >
              {isRoomSelected ? "✓" : ""}
            </span>
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

  const isMonitoringMode = Boolean(onRoomSelectionChange && selectedRoomIds)

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="mb-3 flex items-center justify-between px-2">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">{displaySubtitle}</span>
      </div>
      {isMonitoringMode && (
        <div className="mb-2 px-2">
          <button
            type="button"
            onClick={() => {
              const all = allRoomIds
              const next =
                selectedRoomIds!.length === all.length ? [] : [...all]
              onRoomSelectionChange!(next)
            }}
            className="text-xs text-primary hover:underline"
          >
            {selectedRoomIds!.length === allRoomIds.length ? "取消全选" : "选择全部"}
          </button>
        </div>
      )}
      <div className="space-y-0.5">
        {treeData.map((node) => renderNode(node))}
      </div>
    </div>
  )
}
