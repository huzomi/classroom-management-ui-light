"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
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
  getLessonPage,
  addLesson,
  updateLesson,
  deleteLesson,
  type LessonPageVO,
  type LessonEditDTO,
} from "@/lib/api/lesson"
import { toast } from "@/hooks/use-toast"

/** 格式化时间为 HH:mm 或 HH:mm:ss 显示 */
function formatTime(v?: string) {
  if (!v) return "-"
  return v.length > 5 ? v : `${v}:00`
}

export default function PeriodsPage() {
  const [records, setRecords] = useState<LessonPageVO[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<LessonPageVO | null>(null)
  const [deleteIds, setDeleteIds] = useState<string[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState<LessonEditDTO>({
    startTime: "",
    endTime: "",
    startOffset: 0,
    endOffset: 0,
  })
  const [formSubmitting, setFormSubmitting] = useState(false)

  const loadList = useCallback(async () => {
    setLoading(true)
    try {
      const { records: r, total: t } = await getLessonPage({
        page: currentPage,
        pageSize,
      })
      setRecords(r)
      setTotal(t)
    } catch (err) {
      console.error("加载节次列表失败:", err)
      setRecords([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize])

  useEffect(() => {
    loadList()
  }, [loadList])

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
      startTime: "",
      endTime: "",
      startOffset: 0,
      endOffset: 0,
    })
    setFormOpen(true)
  }

  const handleEdit = (row: LessonPageVO) => {
    const st = row.startTime ?? ""
    const et = row.endTime ?? ""
    setFormData({
      id: row.id,
      startTime: st.length > 5 ? st.slice(0, 5) : st,
      endTime: et.length > 5 ? et.slice(0, 5) : et,
      startOffset: row.startOffset ?? 0,
      endOffset: row.endOffset ?? 0,
    })
    setFormOpen(true)
  }

  const handleFormSubmit = async () => {
    if (!formData.startTime) {
      toast({ title: "请选择开始时间", variant: "destructive" })
      return
    }
    if (!formData.endTime) {
      toast({ title: "请选择结束时间", variant: "destructive" })
      return
    }
    setFormSubmitting(true)
    try {
      if (formData.id) {
        await updateLesson(formData)
        toast({ title: "更新成功" })
      } else {
        await addLesson(formData)
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

  const handleDeleteOne = (row: LessonPageVO) => {
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
      await deleteLesson(deleteIds)
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
              className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
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
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">开始时间</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">结束时间</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">开始偏移(分钟)</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">结束偏移(分钟)</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">时长(分钟)</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">实际开始</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">实际结束</th>
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
                    <td className="p-3 text-sm font-mono">{formatTime(row.startTime)}</td>
                    <td className="p-3 text-sm font-mono">{formatTime(row.endTime)}</td>
                    <td className="p-3 text-sm">{row.startOffset ?? 0}</td>
                    <td className="p-3 text-sm">{row.endOffset ?? 0}</td>
                    <td className="p-3 text-sm">{row.timing ?? "-"}</td>
                    <td className="p-3 text-sm font-mono text-muted-foreground">{formatTime(row.realStartTime)}</td>
                    <td className="p-3 text-sm font-mono text-muted-foreground">{formatTime(row.realEndTime)}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                          onClick={() => handleEdit(row)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                          编辑
                        </button>
                        <button
                          className="text-sm text-destructive hover:underline flex items-center gap-1"
                          onClick={() => handleDeleteOne(row)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          删除
                        </button>
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
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
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
            <DialogTitle>{formData.id ? "编辑节次" : "新增节次"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lesson-start">开始时间 *</Label>
                <Input
                  id="lesson-start"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData((d) => ({ ...d, startTime: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lesson-end">结束时间 *</Label>
                <Input
                  id="lesson-end"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData((d) => ({ ...d, endTime: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lesson-start-offset">开始偏移(分钟)</Label>
                <Input
                  id="lesson-start-offset"
                  type="number"
                  min={0}
                  value={formData.startOffset ?? 0}
                  onChange={(e) => setFormData((d) => ({ ...d, startOffset: parseInt(e.target.value, 10) || 0 }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lesson-end-offset">结束偏移(分钟)</Label>
                <Input
                  id="lesson-end-offset"
                  type="number"
                  min={0}
                  value={formData.endOffset ?? 0}
                  onChange={(e) => setFormData((d) => ({ ...d, endOffset: parseInt(e.target.value, 10) || 0 }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              取消
            </Button>
            <Button onClick={handleFormSubmit} disabled={formSubmitting}>
              {formSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  提交中...
                </>
              ) : (
                "确定"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <AlertDialog
        open={deleteIds.length > 0}
        onOpenChange={(open) => !open && (setDeleteTarget(null), setDeleteIds([]))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定删除吗？</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `将删除节次「${formatTime(deleteTarget.startTime)} - ${formatTime(deleteTarget.endTime)}」，此操作不可恢复。`
                : `将删除选中的 ${deleteIds.length} 个节次，此操作不可恢复。`}
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
