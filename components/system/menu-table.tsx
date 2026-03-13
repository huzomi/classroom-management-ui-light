"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Minus,
  ChevronDown,
  Home,
  Cloud,
  BarChart3,
  Brain,
  Monitor,
  Eye,
  Grid3X3,
  Wrench,
  Briefcase,
  PieChart,
  Settings,
  User,
  Activity,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MenuItem } from "@/types/menu"

// 图标映射
const iconMap: Record<string, React.ElementType> = {
  home: Home,
  cloud: Cloud,
  "bar-chart": BarChart3,
  brain: Brain,
  monitor: Monitor,
  eye: Eye,
  grid: Grid3X3,
  wrench: Wrench,
  briefcase: Briefcase,
  "pie-chart": PieChart,
  settings: Settings,
  user: User,
  activity: Activity,
  message: MessageCircle,
}

interface MenuTableProps {
  data: MenuItem[]
  selectedIds: string[]
  expandedIds: string[]
  onSelect: (ids: string[]) => void
  onToggleExpand: (id: string) => void
  onEdit: (item: MenuItem) => void
  onDelete: (item: MenuItem) => void
  onAddChild: (item: MenuItem) => void
}

export function MenuTable({
  data,
  selectedIds,
  expandedIds,
  onSelect,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddChild,
}: MenuTableProps) {
  // 获取所有可见的菜单项（包括展开的子菜单）
  const getVisibleItems = (
    items: MenuItem[],
    level: number = 0
  ): { item: MenuItem; level: number }[] => {
    const result: { item: MenuItem; level: number }[] = []
    for (const item of items) {
      result.push({ item, level })
      if (item.children && expandedIds.includes(item.id)) {
        result.push(...getVisibleItems(item.children, level + 1))
      }
    }
    return result
  }

  // 获取所有菜单项的 ID（用于全选）
  const getAllIds = (items: MenuItem[]): string[] => {
    const ids: string[] = []
    for (const item of items) {
      ids.push(item.id)
      if (item.children) {
        ids.push(...getAllIds(item.children))
      }
    }
    return ids
  }

  const allIds = getAllIds(data)
  const visibleItems = getVisibleItems(data)
  const isAllSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id))
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelect([])
    } else {
      onSelect(allIds)
    }
  }

  const handleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter((i) => i !== id))
    } else {
      onSelect([...selectedIds, id])
    }
  }

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null
    // 支持 ant-design:xxx 格式，取最后一段匹配
    const key = iconName.includes(":") ? iconName.split(":").pop()?.replace(/-outlined$/, "") ?? iconName : iconName
    const IconComponent = iconMap[key] ?? iconMap[iconName]
    if (!IconComponent) return <span className="size-4 inline-block text-muted-foreground/50">◆</span>
    return <IconComponent className="size-4 text-muted-foreground" />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-12">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              aria-label="全选"
              className={cn(isSomeSelected && "opacity-50")}
            />
          </TableHead>
          <TableHead className="min-w-[180px]">菜单名称</TableHead>
          <TableHead className="w-[70px] text-center">图标</TableHead>
          <TableHead className="min-w-[140px]">权限标识</TableHead>
          <TableHead className="min-w-[160px]">组件</TableHead>
          <TableHead className="min-w-[120px]">路径</TableHead>
          <TableHead className="w-[60px] text-center">排序</TableHead>
          <TableHead className="w-[70px] text-center">状态</TableHead>
          <TableHead className="w-[120px] text-center">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visibleItems.map(({ item, level }) => {
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedIds.includes(item.id)
          const isSelected = selectedIds.includes(item.id)

          return (
            <TableRow key={item.id} data-state={isSelected ? "selected" : undefined}>
              <TableCell>
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleSelectItem(item.id)}
                  aria-label={`选择 ${item.name}`}
                />
              </TableCell>
              <TableCell>
                <div
                  className="flex items-center gap-1"
                  style={{ paddingLeft: `${level * 24}px` }}
                >
                  {hasChildren ? (
                    <button
                      onClick={() => onToggleExpand(item.id)}
                      className="flex size-5 items-center justify-center rounded hover:bg-muted"
                    >
                      {isExpanded ? (
                        <Minus className="size-3 text-muted-foreground" />
                      ) : (
                        <Plus className="size-3 text-muted-foreground" />
                      )}
                    </button>
                  ) : (
                    <span className="size-5" />
                  )}
                  <span className="text-foreground">{item.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {renderIcon(item.icon)}
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground font-mono text-sm">{item.permission ?? "-"}</span>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground text-sm">{item.component ?? "-"}</span>
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground text-sm font-mono">{item.path ?? "-"}</span>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-muted-foreground">{item.sort}</span>
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={cn(
                    "text-sm",
                    (item.status === "1" || !item.status) && "text-green-600",
                    item.status === "0" && "text-destructive",
                  )}
                >
                  {item.status === "0" ? "无效" : "有效"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-primary"
                    onClick={() => onEdit(item)}
                  >
                    编辑
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-primary"
                      >
                        更多
                        <ChevronDown className="size-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onAddChild(item)}>
                        添加子菜单
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDelete(item)}
                      >
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
