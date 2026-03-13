"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  getConfigList,
  addConfig,
  updateConfig,
  deleteConfig,
  getConfigTypeList,
  type ConfigVO,
  type ConfigEditDTO,
} from "@/lib/api/config"
import { toast } from "@/hooks/use-toast"

export default function DictionaryPage() {
  const [searchName, setSearchName] = useState("")
  const [records, setRecords] = useState<ConfigVO[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [typeList, setTypeList] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<ConfigVO | null>(null)
  const [deleteIds, setDeleteIds] = useState<string[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState<ConfigEditDTO>({
    key: "",
    value: "",
    type: "",
    desc: "",
  })
  const [formSubmitting, setFormSubmitting] = useState(false)

  const loadTypeList = useCallback(async () => {
    try {
      const list = await getConfigTypeList()
      setTypeList(list ?? [])
    } catch (err) {
      console.error("加载配置类型失败:", err)
    }
  }, [])

  const loadList = useCallback(async () => {
    setLoading(true)
    try {
      const { records: r, total: t } = await getConfigList({
        page: currentPage,
        pageSize,
        name: searchName.trim() || undefined,
      })
      setRecords(r)
      setTotal(t)
    } catch (err) {
      console.error("加载字典列表失败:", err)
      setRecords([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchName])

  useEffect(() => {
    loadTypeList()
  }, [loadTypeList])

  useEffect(() => {
    loadList()
  }, [loadList])

  const handleSearch = () => {
    setCurrentPage(1)
    loadList()
  }

  const handleReset = () => {
    setSearchName("")
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
      key: "",
      value: "",
      type: "",
      desc: "",
    })
    setFormOpen(true)
  }

  const handleEdit = (row: ConfigVO) => {
    setFormData({
      id: row.id,
      key: row.key ?? "",
      value: row.value ?? "",
      type: row.type ?? "",
      desc: row.desc ?? "",
    })
    setFormOpen(true)
  }

  const handleFormSubmit = async () => {
    if (!formData.key.trim()) {
      toast({ title: "请输入配置键", variant: "destructive" })
      return
    }
    if (!formData.type.trim()) {
      toast({ title: "请输入或选择配置类型", variant: "destructive" })
      return
    }
    if (!formData.value.trim()) {
      toast({ title: "请输入配置值", variant: "destructive" })
      return
    }
    setFormSubmitting(true)
    try {
      if (formData.id) {
        await updateConfig(formData)
        toast({ title: "更新成功" })
      } else {
        await addConfig(formData)
        toast({ title: "新增成功" })
      }
      setFormOpen(false)
      loadList()
      loadTypeList()
    } catch (err) {
      console.error("提交失败:", err)
      toast({ title: formData.id ? "更新失败" : "新增失败", variant: "destructive" })
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDeleteOne = (row: ConfigVO) => {
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
      await deleteConfig(deleteIds)
      toast({ title: "删除成功" })
      setDeleteTarget(null)
      setDeleteIds([])
      setSelectedRows([])
      loadList()
      loadTypeList()
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
            <span className="text-sm text-muted-foreground whitespace-nowrap">关键词:</span>
            <Input
              placeholder="请输入配置键或描述"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-48"
            />
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
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">配置键</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">配置值</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">配置类型</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">描述</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">创建时间</th>
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
                    <td className="p-3 text-sm font-mono">{row.key}</td>
                    <td className="p-3 text-sm max-w-[200px] truncate" title={row.value}>
                      {row.value}
                    </td>
                    <td className="p-3 text-sm">{row.type}</td>
                    <td className="p-3 text-sm max-w-[180px] truncate text-muted-foreground" title={row.desc}>
                      {row.desc || "-"}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{row.createTime ?? "-"}</td>
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
            <DialogTitle>{formData.id ? "编辑配置" : "新增配置"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="config-key">配置键</Label>
              <Input
                id="config-key"
                placeholder="请输入配置键"
                value={formData.key}
                onChange={(e) => setFormData((d) => ({ ...d, key: e.target.value }))}
                disabled={!!formData.id}
              />
              {formData.id && (
                <p className="text-xs text-muted-foreground">编辑时配置键不可修改</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="config-type">配置类型</Label>
              {typeList.length > 0 ? (
                <>
                  <Input
                    id="config-type"
                    list="config-type-list"
                    placeholder="请选择或输入配置类型"
                    value={formData.type}
                    onChange={(e) => setFormData((d) => ({ ...d, type: e.target.value }))}
                  />
                  <datalist id="config-type-list">
                    {typeList.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </>
              ) : (
                <Input
                  id="config-type"
                  placeholder="请输入配置类型"
                  value={formData.type}
                  onChange={(e) => setFormData((d) => ({ ...d, type: e.target.value }))}
                />
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="config-value">配置值</Label>
              <Textarea
                id="config-value"
                placeholder="请输入配置值"
                value={formData.value}
                onChange={(e) => setFormData((d) => ({ ...d, value: e.target.value }))}
                rows={4}
                className="resize-none"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="config-desc">描述</Label>
              <Textarea
                id="config-desc"
                placeholder="请输入描述"
                value={formData.desc ?? ""}
                onChange={(e) => setFormData((d) => ({ ...d, desc: e.target.value }))}
                rows={2}
                className="resize-none"
              />
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
      <AlertDialog open={deleteIds.length > 0} onOpenChange={(open) => !open && (setDeleteTarget(null), setDeleteIds([]))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定删除吗？</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `将删除配置「${deleteTarget.key}」，此操作不可恢复。`
                : `将删除选中的 ${deleteIds.length} 条配置，此操作不可恢复。`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
