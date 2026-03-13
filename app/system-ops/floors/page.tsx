"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  RefreshCw,
  Wrench,
  Settings,
  ChevronLeft,
  ChevronRight,
  Info,
  Edit,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  getFloorPage,
  addFloor,
  updateFloor,
  deleteFloor,
  type FloorPageVO,
  type FloorCommonEditDTO,
} from "@/lib/api/floor"
import { getBuildingPage, type BuildingPageVO } from "@/lib/api/building"
import { toast } from "@/hooks/use-toast"

export default function FloorsPage() {
  const [searchName, setSearchName] = useState("")
  const [selectedBuilding, setSelectedBuilding] = useState<string>("__all__")
  const [records, setRecords] = useState<FloorPageVO[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [buildingOptions, setBuildingOptions] = useState<BuildingPageVO[]>([])
  const [deleteTarget, setDeleteTarget] = useState<FloorPageVO | null>(null)
  const [deleteIds, setDeleteIds] = useState<string[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState<FloorCommonEditDTO>({
    name: "",
    buildingId: "",
    sort: 0,
    floorCode: "",
  })
  const [formSubmitting, setFormSubmitting] = useState(false)

  const loadBuildingOptions = useCallback(async () => {
    try {
      const { records: r } = await getBuildingPage({ page: 1, pageSize: 2000 })
      setBuildingOptions(r)
    } catch (err) {
      console.error("加载教学楼列表失败:", err)
    }
  }, [])

  const loadList = useCallback(async () => {
    setLoading(true)
    try {
      const { records: r, total: t } = await getFloorPage({
        page: currentPage,
        pageSize,
        name: searchName.trim() || undefined,
        buildingId: selectedBuilding && selectedBuilding !== "__all__" ? selectedBuilding : undefined,
      })
      setRecords(r)
      setTotal(t)
    } catch (err) {
      console.error("加载楼层列表失败:", err)
      setRecords([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchName, selectedBuilding])

  useEffect(() => {
    loadBuildingOptions()
  }, [loadBuildingOptions])

  useEffect(() => {
    loadList()
  }, [loadList])

  const handleSearch = () => {
    setCurrentPage(1)
    loadList()
  }

  const handleReset = () => {
    setSearchName("")
    setSelectedBuilding("__all__")
    setCurrentPage(1)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(records.map((r) => r.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id])
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id))
    }
  }

  const handleAdd = () => {
    setFormData({
      name: "",
      buildingId: buildingOptions[0]?.id ?? "",
      sort: 0,
      floorCode: "",
    })
    setFormOpen(true)
  }

  const handleEdit = (row: FloorPageVO) => {
    setFormData({
      id: row.id,
      name: row.name ?? "",
      buildingId: row.buildingId ?? "",
      sort: row.sort ?? 0,
      floorCode: row.floorCode ?? "",
    })
    setFormOpen(true)
  }

  const handleFormSubmit = async () => {
    if (!formData.name.trim()) {
      toast({ title: "请输入楼层名称", variant: "destructive" })
      return
    }
    if (!formData.buildingId) {
      toast({ title: "请选择所属教学楼", variant: "destructive" })
      return
    }
    setFormSubmitting(true)
    try {
      if (formData.id) {
        await updateFloor(formData)
        toast({ title: "更新成功" })
      } else {
        await addFloor(formData)
        toast({ title: "新增成功" })
      }
      setFormOpen(false)
      loadList()
    } catch (err) {
      console.error("提交失败:", err)
      toast({ title: formData.id ? "更新失败" : "新增失败", variant: "destructive" })
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDeleteOne = (row: FloorPageVO) => {
    setDeleteTarget(row)
    setDeleteIds([row.id])
  }

  const handleDeleteBatch = () => {
    if (selectedRows.length === 0) {
      toast({ title: "请先选择要删除的数据", variant: "destructive" })
      return
    }
    setDeleteTarget(null)
    setDeleteIds([...selectedRows])
  }

  const confirmDelete = async () => {
    try {
      await deleteFloor(deleteIds)
      toast({ title: "删除成功" })
      setDeleteTarget(null)
      setDeleteIds([])
      setSelectedRows([])
      loadList()
    } catch (err) {
      console.error("删除失败:", err)
      toast({ title: "删除失败", variant: "destructive" })
    }
  }

  const totalPages = Math.ceil(total / pageSize) || 1

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {/* 筛选栏 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">楼层名称:</span>
            <Input
              placeholder="请输入楼层名称"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">所属教学楼:</span>
            <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="请选择教学楼" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部</SelectItem>
                {buildingOptions.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
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
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-1" />
              新增
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteBatch}
              disabled={selectedRows.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              批量删除
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
          <span>{selectedRows.length > 0 ? `已选中 ${selectedRows.length} 条数据` : "未选中任何数据"}</span>
        </div>

        {/* 数据表格 */}
        <div className="border border-border rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : records.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">暂无数据</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="p-3 text-center w-12">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === records.length && records.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </th>
                  <th className="p-3 text-center text-sm font-medium text-muted-foreground">楼层名称</th>
                  <th className="p-3 text-center text-sm font-medium text-muted-foreground">楼层编号</th>
                  <th className="p-3 text-center text-sm font-medium text-muted-foreground">所属教学楼</th>
                  <th className="p-3 text-center text-sm font-medium text-muted-foreground">所属校区</th>
                  <th className="p-3 text-center text-sm font-medium text-muted-foreground">排序</th>
                  <th className="p-3 text-center text-sm font-medium text-muted-foreground">创建时间</th>
                  <th className="p-3 text-center text-sm font-medium text-muted-foreground">操作</th>
                </tr>
              </thead>
              <tbody>
                {records.map((row) => (
                  <tr key={row.id} className="border-b border-border hover:bg-muted/20">
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                        className="h-4 w-4"
                      />
                    </td>
                    <td className="p-3 text-center text-sm">{row.name ?? ""}</td>
                    <td className="p-3 text-center text-sm">{row.floorCode ?? ""}</td>
                    <td className="p-3 text-center text-sm">{row.buildingName ?? ""}</td>
                    <td className="p-3 text-center text-sm">{row.campusName ?? ""}</td>
                    <td className="p-3 text-center text-sm">{row.sort ?? ""}</td>
                    <td className="p-3 text-center text-sm">{row.createTime ?? ""}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8" onClick={() => handleEdit(row)}>
                          <Edit className="h-4 w-4 mr-1" />
                          编辑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteOne(row)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          删除
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-end gap-4">
          <span className="text-sm text-muted-foreground">共 {total} 条数据</span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1) }}>
            <SelectTrigger className="w-24 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 条/页</SelectItem>
              <SelectItem value="20">20 条/页</SelectItem>
              <SelectItem value="50">50 条/页</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 新增/编辑弹窗 */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{formData.id ? "编辑楼层" : "新增楼层"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>楼层名称 *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="例如：1楼"
              />
            </div>
            <div className="space-y-2">
              <Label>楼层编号</Label>
              <Input
                value={formData.floorCode ?? ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, floorCode: e.target.value }))}
                placeholder="例如：F1"
              />
            </div>
            <div className="space-y-2">
              <Label>所属教学楼 *</Label>
              <Select
                value={formData.buildingId}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, buildingId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择所属教学楼" />
                </SelectTrigger>
                <SelectContent>
                  {buildingOptions.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>排序</Label>
              <Input
                type="number"
                value={formData.sort ?? 0}
                onChange={(e) => setFormData((prev) => ({ ...prev, sort: parseInt(e.target.value, 10) || 0 }))}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              取消
            </Button>
            <Button onClick={handleFormSubmit} disabled={formSubmitting}>
              {formSubmitting ? "提交中..." : "确定"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <AlertDialog
        open={deleteTarget !== null || deleteIds.length > 0}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
            setDeleteIds([])
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定删除吗？</AlertDialogTitle>
            <AlertDialogDescription>
              删除后无法恢复，请谨慎操作。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
