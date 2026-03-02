"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, School, Building, Layers } from "lucide-react"
import { cn } from "@/lib/utils"

interface TreeNode {
  id: string
  label: string
  type: "campus" | "building" | "floor" | "classroom"
  children?: TreeNode[]
}

const mockTreeData: TreeNode[] = [
  {
    id: "campus-1",
    label: "智慧主校区",
    type: "campus",
    children: [
      {
        id: "building-1",
        label: "第一教学楼",
        type: "building",
        children: [
          {
            id: "floor-1-1",
            label: "1层",
            type: "floor",
            children: [
              { id: "room-101", label: "101教室", type: "classroom" },
              { id: "room-102", label: "102教室", type: "classroom" },
              { id: "room-103", label: "103教室", type: "classroom" },
              { id: "room-104", label: "104教室", type: "classroom" },
            ],
          },
          {
            id: "floor-1-2",
            label: "2层",
            type: "floor",
            children: [
              { id: "room-201", label: "201教室", type: "classroom" },
              { id: "room-202", label: "202教室", type: "classroom" },
            ],
          },
          {
            id: "floor-1-3",
            label: "3层",
            type: "floor",
            children: [],
          },
        ],
      },
      {
        id: "building-2",
        label: "实验楼",
        type: "building",
        children: [
          {
            id: "floor-2-1",
            label: "1层",
            type: "floor",
            children: [],
          },
          {
            id: "floor-2-2",
            label: "2层",
            type: "floor",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "campus-2",
    label: "东校区",
    type: "campus",
    children: [
      {
        id: "building-3",
        label: "综合楼",
        type: "building",
        children: [
          {
            id: "floor-3-1",
            label: "1层",
            type: "floor",
            children: [],
          },
        ],
      },
    ],
  },
]

interface ClassroomTreeProps {
  selectedNode: string
  onSelectNode: (nodeId: string) => void
}

export function ClassroomTree({ selectedNode, onSelectNode }: ClassroomTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["campus-1", "building-1"]))

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const renderIcon = (type: string) => {
    switch (type) {
      case "campus":
        return <School className="h-4 w-4 text-red-500" />
      case "building":
        return <Building className="h-4 w-4 text-orange-500" />
      case "floor":
        return <Layers className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const renderTree = (nodes: TreeNode[], level = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedNodes.has(node.id)
      const hasChildren = node.children && node.children.length > 0
      const isSelected = selectedNode === node.id

      return (
        <div key={node.id}>
          <div
            className={cn(
              "flex items-center gap-2 py-2 px-3 rounded-md cursor-pointer hover:bg-accent transition-colors",
              isSelected && "bg-accent font-medium",
              level > 0 && "ml-4",
            )}
            onClick={() => {
              onSelectNode(node.id)
              if (hasChildren) toggleNode(node.id)
            }}
            style={{ paddingLeft: `${level * 12 + 12}px` }}
          >
            {hasChildren && (
              <button
                className="p-0 hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleNode(node.id)
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-4" />}
            {renderIcon(node.type)}
            <span className="text-sm">{node.label}</span>
          </div>
          {isExpanded && hasChildren && renderTree(node.children!, level + 1)}
        </div>
      )
    })
  }

  return <div className="flex-1 overflow-auto p-2">{renderTree(mockTreeData)}</div>
}
