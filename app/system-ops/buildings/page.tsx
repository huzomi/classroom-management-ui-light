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
  getBuildingPage,
  addBuilding,
  updateBuilding,
  deleteBuilding,
  type BuildingPageVO,
  type BuildingCommonEditDTO,
} from "@/lib/api/building"
import { getCampusTree } from "@/lib/api/campus"
import { toast } from "@/hooks/use-toast"

interface CampusOption {
  id: string
  name: string
}

export default function BuildingsPage() {
  const [searchName, setSearchName] = useState("")
  const [selectedCampus, setSelectedCampus] = useState<string>("__all__")
  const [records, setRecords] = useState<BuildingPageVO[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [campusOptions, setCampusOptions] = useState<CampusOption[]>([])
  const [deleteTarget, setDeleteTarget] = useState<BuildingPageVO | null>(null)
  const [deleteIds, setDeleteIds] = useState<string[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState<BuildingCommonEditDTO>({
    name: "",
    campusId: "",
    sort: 0,
    buildingCode: "",
  })
  const [formSubmitting, setFormSubmitting] = useState(false)

  const loadCampusOptions = useCallback(async () => {
    try {
      const tree = await getCampusTree()
      const list = (tree ?? []).map((c: { id: string; name: string }) => ({
        id: c.id,
        name: c.name,
      }))
      setCampusOptions(list)
    } catch (err) {
      console.error("加载校区列表失败:", err)
    }
  }, [])

  const loadList = useCallback(async () => {
    setLoading(true)
    try {
      const { records: r, total: t } = await getBuildingPage({
        page: currentPage,
        pageSize,
        name: searchName.trim() || undefined,
        campusId: selectedCampus && selectedCampus !== "__all__" ? selectedCampus : undefined,
      })
      setRecords(r)
      setTotal(t)
    } catch (err) {
      console.error("加载教学楼列表失败:", err)
      setRecords([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchName, selectedCampus])

  useEffect(() => {
    loadCampusOptions()
  }, [loadCampusOptions])

  useEffect(() => {
    loadList()
  }, [loadList])

  const handleSearch = () => {
    setCurrentPage(1)
    loadList()
  }

  const handleReset = () => {
    setSearchName("")
    setSelectedCampus("__all__")
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
      campusId: campusOptions[0]?.id ?? "",
      sort: 0,
      buildingCode: "",
    })
    setFormOpen(true)
  }

  const handleEdit = (row: BuildingPageVO) => {
    setFormData({
      id: row.id,
      name: row.name ?? "",
      campusId: row.campusId ?? "",
      sort: row.sort ?? 0,
      buildingCode: row.buildingCode ?? "",
      lon: row.lon,
      lat: row.lat,
    })
    setFormOpen(true)
  }

  const handleFormSubmit = async () => {
    if (!formData.name.trim()) {
      toast({ title: "请输入楼栋名称", variant: "destructive" })
      return
    }
    if (!formData.campusId) {
      toast({ title: "请选择所属校区", variant: "destructive" })
      return
    }
    setFormSubmitting(true)
    try {
      if (formData.id) {
        await updateBuilding(formData)
        toast({ title: "更新成功" })
      } else {
        await addBuilding(formData)
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

  const handleDeleteOne = (row: BuildingPageVO) => {
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
      await deleteBuilding(deleteIds)
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
            <span className="text-sm text-muted-foreground whitespace-nowrap">楼栋名称:</span>
            <Input
              placeholder="请输入楼栋名称"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">所属校区:</span>
            <Select value={selectedCampus} onValueChange={setSelectedCampus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="请选择所属校区" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部</SelectItem>
                {campusOptions.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
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
                  <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                    <div className="flex items-center justify-center gap-1">楼栋名称</div>
                  </th>
                  <th className="p-3 text-center text-sm font-medium text-muted-foreground">楼栋编号</th>
                  <th className="p-3 text-center text-sm font-medium text-muted-foreground">所属校区</th>
                  <th className="p-3 text-center text-sm font-medium text-muted-foreground">排序</th>
                  <th className="p-3 text-center text-sm font-medium text-muted-foreground">经度</th>
                  <th className="p-3 text-center text-sm font-medium text-muted-foreground">纬度</th>
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
                    <td className="p-3 text-center text-sm">{row.buildingCode ?? ""}</td>
                    <td className="p-3 text-center text-sm">{row.campusName ?? ""}</td>
                    <td className="p-3 text-center text-sm">{row.sort ?? ""}</td>
                    <td className="p-3 text-center text-sm">{row.lon ?? ""}</td>
                    <td className="p-3 text-center text-sm">{row.lat ?? ""}</td>
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
            <DialogTitle>{formData.id ? "编辑教学楼" : "新增教学楼"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>楼栋名称 *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="请输入楼栋名称"
              />
            </div>
            <div className="space-y-2">
              <Label>楼栋编号</Label>
              <Input
                value={formData.buildingCode ?? ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, buildingCode: e.target.value }))}
                placeholder="请输入楼栋编号"
              />
            </div>
            <div className="space-y-2">
              <Label>所属校区 *</Label>
              <Select
                value={formData.campusId}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, campusId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择所属校区" />
                </SelectTrigger>
                <SelectContent>
                  {campusOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
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
