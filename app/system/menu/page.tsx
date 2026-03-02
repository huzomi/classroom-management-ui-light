"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Search,
  RotateCcw,
  RefreshCw,
  Columns3,
  Settings2,
  Maximize2,
  Info,
} from "lucide-react"
import { MenuTable } from "@/components/system/menu-table"
import type { MenuItem } from "@/types/menu"

// 模拟菜单数据
const mockMenuData: MenuItem[] = [
  {
    id: "1",
    name: "主页",
    type: "一级菜单",
    icon: "home",
    component: "layouts/default/index",
    path: "/dashboard",
    sort: 1,
  },
  {
    id: "2",
    name: "低代码开发",
    type: "一级菜单",
    icon: "cloud",
    component: "layouts/default/index",
    path: "/online",
    sort: 2,
  },
  {
    id: "3",
    name: "数据可视化",
    type: "一级菜单",
    icon: "bar-chart",
    component: "layouts/default/index",
    path: "/dataVisual",
    sort: 3,
  },
  {
    id: "4",
    name: "AI大模型",
    type: "一级菜单",
    icon: "brain",
    component: "layouts/default/index",
    path: "/airag",
    sort: 3,
  },
  {
    id: "5",
    name: "教室管理",
    type: "一级菜单",
    icon: "monitor",
    component: "layouts/default/index",
    path: "/room",
    sort: 10,
    children: [
      {
        id: "5-1",
        name: "教学监控",
        type: "子菜单",
        icon: "eye",
        component: "edu/teaching-supervision/index",
        path: "/teaching-supervision",
        sort: 11,
        parentId: "5",
      },
    ],
  },
  {
    id: "6",
    name: "教学联动",
    type: "一级菜单",
    icon: "grid",
    component: "layouts/default/index",
    path: "/teaching-coordination",
    sort: 12,
  },
  {
    id: "7",
    name: "系统运维",
    type: "一级菜单",
    icon: "wrench",
    component: "layouts/default/index",
    path: "/operations",
    sort: 13,
    children: [
      {
        id: "7-1",
        name: "资产管理",
        type: "子菜单",
        icon: "briefcase",
        component: "edu/asset/index",
        path: "/asset",
        sort: 14,
        parentId: "7",
      },
    ],
  },
  {
    id: "8",
    name: "数据统计",
    type: "子菜单",
    icon: "pie-chart",
    component: "layouts/default/index",
    path: "/statistics",
    sort: 15,
  },
  {
    id: "9",
    name: "系统管理",
    type: "一级菜单",
    icon: "settings",
    component: "layouts/RouteView",
    path: "/isystem",
    sort: 40,
  },
  {
    id: "10",
    name: "我的租户",
    type: "一级菜单",
    icon: "user",
    component: "layouts/RouteView",
    path: "/mytenant",
    sort: 42,
  },
  {
    id: "11",
    name: "系统监控",
    type: "一级菜单",
    icon: "activity",
    component: "layouts/RouteView",
    path: "/monitor",
    sort: 50,
  },
  {
    id: "12",
    name: "消息中心",
    type: "一级菜单",
    icon: "message",
    component: "layouts/default/index",
    path: "/message",
    sort: 70,
  },
]

export default function MenuManagementPage() {
  const [searchName, setSearchName] = React.useState("")
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [expandedIds, setExpandedIds] = React.useState<string[]>([])
  const [menuData, setMenuData] = React.useState<MenuItem[]>(mockMenuData)

  // 获取所有菜单项的 ID
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

  // 搜索
  const handleSearch = () => {
    if (!searchName.trim()) {
      setMenuData(mockMenuData)
      return
    }
    const filterData = (items: MenuItem[]): MenuItem[] => {
      return items.reduce<MenuItem[]>((acc, item) => {
        const matchedChildren = item.children ? filterData(item.children) : []
        if (
          item.name.toLowerCase().includes(searchName.toLowerCase()) ||
          matchedChildren.length > 0
        ) {
          acc.push({
            ...item,
            children: matchedChildren.length > 0 ? matchedChildren : item.children,
          })
        }
        return acc
      }, [])
    }
    setMenuData(filterData(mockMenuData))
  }

  // 重置
  const handleReset = () => {
    setSearchName("")
    setMenuData(mockMenuData)
    setSelectedIds([])
  }

  // 展开全部
  const handleExpandAll = () => {
    setExpandedIds(getAllIds(menuData))
  }

  // 折叠全部
  const handleCollapseAll = () => {
    setExpandedIds([])
  }

  // 切换展开状态
  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  // 编辑
  const handleEdit = (item: MenuItem) => {
    console.log("编辑菜单:", item)
    // TODO: 打开编辑弹窗
  }

  // 删除
  const handleDelete = (item: MenuItem) => {
    console.log("删除菜单:", item)
    // TODO: 确认删除
  }

  // 添加子菜单
  const handleAddChild = (item: MenuItem) => {
    console.log("添加子菜单:", item)
    // TODO: 打开添加子菜单弹窗
  }

  // 新增菜单
  const handleAddMenu = () => {
    console.log("新增菜单")
    // TODO: 打开新增菜单弹窗
  }

  // 刷新
  const handleRefresh = () => {
    setMenuData(mockMenuData)
    setSelectedIds([])
    setExpandedIds([])
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* 搜索区域 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-sm text-foreground">菜单名称：</span>
          <Input
            placeholder="请输入菜单名称"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-64"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>
          <Search className="size-4" />
          查询
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="size-4" />
          重置
        </Button>
      </div>

      {/* 操作按钮区域 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={handleAddMenu}>
            <Plus className="size-4" />
            新增菜单
          </Button>
          <Button variant="secondary" onClick={handleExpandAll}>
            <ChevronDown className="size-4" />
            展开全部
          </Button>
          <Button variant="secondary" onClick={handleCollapseAll}>
            <ChevronUp className="size-4" />
            折叠全部
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleRefresh}>
                <RefreshCw className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>刷新</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Columns3 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>密度</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>列设置</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Maximize2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>全屏</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* 选中提示 */}
      <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm">
        <Info className="size-4 text-primary" />
        <span className="text-muted-foreground">
          {selectedIds.length > 0
            ? `已选中 ${selectedIds.length} 条数据`
            : "未选中任何数据"}
        </span>
      </div>

      {/* 表格 */}
      <div className="rounded-md border border-border bg-card">
        <MenuTable
          data={menuData}
          selectedIds={selectedIds}
          expandedIds={expandedIds}
          onSelect={setSelectedIds}
          onToggleExpand={handleToggleExpand}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddChild={handleAddChild}
        />
      </div>
    </div>
  )
}
