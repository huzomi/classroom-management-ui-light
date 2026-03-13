"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  Wrench,
  Settings,
  Info,
  Trash2,
  Loader2,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MenuTable } from "@/components/system/menu-table"
import { MenuDrawer, toMenuItem } from "./components/menu-drawer"
import type { MenuItem } from "@/types/menu"
import { getMenuList, deleteMenu, type MenuPermissionVO } from "@/lib/api/menu"
import { toast } from "@/hooks/use-toast"

function filterByKeyword(items: MenuPermissionVO[], keyword: string): MenuPermissionVO[] {
  if (!keyword.trim()) return items
  const k = keyword.toLowerCase()
  return items.reduce<MenuPermissionVO[]>((acc, item) => {
    const matchedChildren = item.children ? filterByKeyword(item.children, keyword) : []
    const nameMatch = (item.name ?? "").toLowerCase().includes(k)
    if (nameMatch || matchedChildren.length > 0) {
      acc.push({
        ...item,
        children: matchedChildren.length > 0 ? matchedChildren : item.children,
      })
    }
    return acc
  }, [])
}

function toMenuItems(items: MenuPermissionVO[]): MenuItem[] {
  return items.map((vo) => toMenuItem(vo))
}

export default function MenuManagementPage() {
  const [searchName, setSearchName] = React.useState("")
  const [selectedType, setSelectedType] = React.useState<string>("__all__")
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [expandedIds, setExpandedIds] = React.useState<string[]>([])
  const [rawTree, setRawTree] = React.useState<MenuPermissionVO[]>([])
  const [menuData, setMenuData] = React.useState<MenuItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [editRecord, setEditRecord] = React.useState<MenuItem | null>(null)
  const [isUpdate, setIsUpdate] = React.useState(false)
  const [parentIdForAdd, setParentIdForAdd] = React.useState<string | undefined>(undefined)
  const [deleteTarget, setDeleteTarget] = React.useState<MenuItem | null>(null)
  const [deleteIds, setDeleteIds] = React.useState<string[]>([])

  const loadList = useCallback(async () => {
    setLoading(true)
    try {
      const tree = await getMenuList()
      setRawTree(tree ?? [])
      const filtered = filterByKeyword(tree ?? [], searchName)
      const byType =
        selectedType === "dir"
          ? filtered.filter((i) => i.menuType === "0")
          : selectedType === "menu"
            ? filtered.filter((i) => i.menuType === "1")
            : selectedType === "btn"
              ? filtered.filter((i) => i.menuType === "2")
              : filtered
      setMenuData(toMenuItems(byType))
    } catch (err) {
      console.error("加载菜单列表失败:", err)
      setRawTree([])
      setMenuData([])
    } finally {
      setLoading(false)
    }
  }, [searchName, selectedType])

  useEffect(() => {
    loadList()
  }, [loadList])

  const getAllIds = (items: MenuItem[]): string[] => {
    const ids: string[] = []
    for (const item of items) {
      ids.push(item.id)
      if (item.children) ids.push(...getAllIds(item.children))
    }
    return ids
  }

  const handleSearch = () => loadList()
  const handleReset = () => {
    setSearchName("")
    setSelectedType("__all__")
    setSelectedIds([])
  }

  const handleExpandAll = () => setExpandedIds(getAllIds(menuData))
  const handleCollapseAll = () => setExpandedIds([])
  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleAddMenu = () => {
    setEditRecord(null)
    setIsUpdate(false)
    setParentIdForAdd(undefined)
    setDrawerOpen(true)
  }

  const handleEdit = (item: MenuItem) => {
    setEditRecord(item)
    setIsUpdate(true)
    setParentIdForAdd(undefined)
    setDrawerOpen(true)
  }

  const handleAddChild = (item: MenuItem) => {
    setEditRecord(null)
    setIsUpdate(false)
    setParentIdForAdd(item.id)
    setDrawerOpen(true)
  }

  const handleDelete = (item: MenuItem) => {
    setDeleteTarget(item)
    setDeleteIds([item.id])
  }

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      toast({ title: "请先选择要删除的数据", variant: "destructive" })
      return
    }
    setDeleteTarget(null)
    setDeleteIds([...selectedIds])
  }

  const confirmDelete = async () => {
    try {
      await deleteMenu(deleteIds)
      toast({ title: "删除成功" })
      setDeleteTarget(null)
      setDeleteIds([])
      setSelectedIds([])
      loadList()
    } catch (err) {
      console.error("删除失败:", err)
      toast({ title: "删除失败", variant: "destructive" })
    }
  }

  const handleDrawerSuccess = () => {
    loadList()
  }

  const totalItems = getAllIds(menuData).length

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {/* 筛选栏 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">菜单名称:</span>
            <Input
              placeholder="请输入菜单名称"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-48"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">状态:</span>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部</SelectItem>
                <SelectItem value="dir">目录</SelectItem>
                <SelectItem value="menu">菜单</SelectItem>
                <SelectItem value="btn">按钮</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-1" />
            查询
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-1" />
            重置
          </Button>
        </div>

        {/* 工具栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={handleAddMenu}>
              <Plus className="h-4 w-4 mr-1" />
              新增
            </Button>
            <Button
              variant="outline"
              onClick={handleBatchDelete}
              disabled={selectedIds.length === 0}
              className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              批量删除
            </Button>
            <Button variant="secondary" onClick={handleExpandAll}>
              <ChevronDown className="h-4 w-4 mr-1" />
              展开全部
            </Button>
            <Button variant="secondary" onClick={handleCollapseAll}>
              <ChevronUp className="h-4 w-4 mr-1" />
              折叠全部
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => loadList()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Wrench className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 选中提示 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded">
          <Info className="h-4 w-4" />
          <span>{selectedIds.length > 0 ? `已选中 ${selectedIds.length} 条数据` : "未选中任何数据"}</span>
        </div>

        {/* 表格 */}
        <div className="border border-border rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : menuData.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">暂无数据</div>
          ) : (
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
          )}
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-end gap-4">
          <span className="text-sm text-muted-foreground">共 {totalItems} 条数据</span>
        </div>
      </div>

      <MenuDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        record={editRecord}
        isUpdate={isUpdate}
        parentId={parentIdForAdd}
        treeData={rawTree}
        onSuccess={handleDrawerSuccess}
      />

      <AlertDialog open={deleteIds.length > 0} onOpenChange={(open) => !open && (setDeleteTarget(null), setDeleteIds([]))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定删除吗？</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `将删除菜单「${deleteTarget.name}」，此操作不可恢复。`
                : `将删除选中的 ${deleteIds.length} 个菜单，此操作不可恢复。`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
