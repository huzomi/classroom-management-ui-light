"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw, Wrench, Settings, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { getIccardPage, type IccardPageVO } from "@/lib/api/iccard"
import { Loader2 } from "lucide-react"

export default function CardSystemPage() {
  const [searchName, setSearchName] = useState("")
  const [searchCardNo, setSearchCardNo] = useState("")
  const [records, setRecords] = useState<IccardPageVO[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const loadList = useCallback(async () => {
    setLoading(true)
    try {
      const { records: r, total: t } = await getIccardPage({
        page: currentPage,
        size: pageSize,
        name: searchName.trim() || undefined,
        cardNo: searchCardNo.trim() || undefined,
      })
      setRecords(r)
      setTotal(t)
    } catch (err) {
      console.error("加载一卡通列表失败:", err)
      setRecords([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, searchName, searchCardNo])

  useEffect(() => {
    loadList()
  }, [loadList])

  const handleSearch = () => {
    setCurrentPage(1)
    loadList()
  }

  const handleReset = () => {
    setSearchName("")
    setSearchCardNo("")
    setCurrentPage(1)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(records.map((r) => r.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id])
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id))
    }
  }

  const totalPages = Math.ceil(total / pageSize) || 1

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {/* 筛选栏 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">姓名:</span>
            <Input
              placeholder="请输入姓名"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">卡号:</span>
            <Input
              placeholder="请输入卡号"
              value={searchCardNo}
              onChange={(e) => setSearchCardNo(e.target.value)}
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
          <div className="flex items-center gap-2" />
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
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">卡号</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">姓名</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">状态</th>
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
                    <td className="p-3 text-sm font-mono">{row.cardNo}</td>
                    <td className="p-3 text-sm">{row.name}</td>
                    <td className="p-3">
                      <span
                        className={cn(
                          "text-sm",
                          row.status === "启用" && "text-green-600",
                          row.status === "停用" && "text-muted-foreground",
                          row.status === "挂失" && "text-red-600",
                        )}
                      >
                        {row.status}
                      </span>
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
    </main>
  )
}
