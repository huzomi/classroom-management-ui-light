"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Download, Search, RefreshCw, ChevronUp, ChevronDown, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { getBaseUrl } from "@/lib/api/client"
import {
  getOperationLogPage,
  ACTION_TYPE_MAP,
  type OperationLogDO,
} from "@/lib/api/operation-log"

export default function OperationLogsPage() {
  const [actionType, setActionType] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [logs, setLogs] = useState<OperationLogDO[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getOperationLogPage({
        page: currentPage,
        pageSize,
        actionType: actionType ? Number(actionType) : undefined,
      })
      setLogs(res.records ?? [])
      setTotal(res.total ?? 0)
    } catch (err) {
      console.error("获取操作日志失败", err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, actionType])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handleReset = () => {
    setActionType("")
    setCurrentPage(1)
  }

  const getActionTypeLabel = (type: number) => ACTION_TYPE_MAP[type] ?? `未知(${type})`

  const formatTime = (t: string | null | undefined) => {
    if (!t) return "-"
    return t.replace("T", " ").slice(0, 19)
  }

  const getPageNumbers = () => {
    const pages: (number | "...")[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push("...")
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {/* 筛选栏 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">操作类型:</span>
            <Select value={actionType} onValueChange={setActionType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="请选择操作类型" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ACTION_TYPE_MAP).map(([val, label]) => (
                  <SelectItem key={val} value={val}>
                    {label}
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
            <Button onClick={() => {
              const token = localStorage.getItem("token") ?? ""
              window.open(`${getBaseUrl()}/operationLog/exportXls?token=${token}`)
            }}>
              <Download className="h-4 w-4 mr-1" />
              导出
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={fetchLogs}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 表格 */}
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    教室
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">操作类型</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">操作内容</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">IP地址</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">客户端类型</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    操作时间
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="p-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                    暂无数据
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-border hover:bg-muted/20">
                    <td className="p-3 text-center text-sm text-foreground">{log.roomName || "-"}</td>
                    <td className="p-3 text-center text-sm text-foreground">{getActionTypeLabel(log.actionType)}</td>
                    <td className="p-3 text-center text-sm text-primary">{log.content || "-"}</td>
                    <td className="p-3 text-center text-sm text-foreground">{log.ip || "-"}</td>
                    <td className="p-3 text-center text-sm text-foreground">{log.clientType || "-"}</td>
                    <td className="p-3 text-center text-sm text-foreground">{formatTime(log.createTime)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`dot-${i}`} className="px-1 text-muted-foreground">...</span>
              ) : (
                <Button
                  key={p}
                  variant={p === currentPage ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </Button>
              )
            )}
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
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v))
              setCurrentPage(1)
            }}
          >
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
