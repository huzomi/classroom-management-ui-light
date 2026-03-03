"use client"

import { useState } from "react"
// 操作日志页面
import { Button } from "@/components/ui/button"
import { Download, Search, RotateCw, Wrench, Settings } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// 模拟日志数据
const logsData = [
  { id: 1, classroom: "102", operationType: "手动控制", content: "控制状态回报102教室.null:大屏.1", ip: "192.168.10.204", clientType: "", time: "2026-03-03 09:24:36" },
  { id: 2, classroom: "102", operationType: "手动控制", content: "控制状态回报102教室.null:幕布.1", ip: "192.168.10.204", clientType: "", time: "2026-03-03 09:24:36" },
  { id: 3, classroom: "102", operationType: "手动控制", content: "控制状态回报102教室.null:灯光.1", ip: "192.168.10.204", clientType: "", time: "2026-03-03 09:24:36" },
  { id: 4, classroom: "102", operationType: "手动控制", content: "控制状态回报102教室.上课/下课.1", ip: "192.168.10.204", clientType: "", time: "2026-03-03 09:24:35" },
  { id: 5, classroom: "103", operationType: "手动控制", content: "", ip: "192.168.10.41", clientType: "", time: "2026-03-03 09:24:35" },
  { id: 6, classroom: "103", operationType: "手动控制", content: "", ip: "192.168.10.41", clientType: "", time: "2026-03-03 09:24:35" },
  { id: 7, classroom: "103", operationType: "手动控制", content: "控制状态回报103教室.上课/下课.2", ip: "192.168.10.41", clientType: "", time: "2026-03-03 09:24:35" },
  { id: 8, classroom: "102", operationType: "手动控制", content: "控制状态回报102教室.null:投影.0", ip: "192.168.10.204", clientType: "", time: "2026-03-03 09:24:35" },
  { id: 9, classroom: "103", operationType: "手动控制", content: "", ip: "192.168.10.41", clientType: "", time: "2026-03-03 09:24:35" },
  { id: 10, classroom: "103", operationType: "手动控制", content: "", ip: "192.168.10.41", clientType: "", time: "2026-03-03 09:24:35" },
]

export default function OperationLogsPage() {
  const [operationType, setOperationType] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [jumpPage, setJumpPage] = useState("")
  
  const totalRecords = 1667
  const totalPages = Math.ceil(totalRecords / pageSize)

  const handleReset = () => {
    setOperationType("")
  }

  const handleJump = () => {
    const page = parseInt(jumpPage)
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setJumpPage("")
    }
  }

  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1, 2, 3, 4, 5)
      pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex-1 overflow-auto bg-background p-6">
      <div className="space-y-4">
        {/* 筛选栏 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">操作类型:</span>
            <Select value={operationType} onValueChange={setOperationType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="请选择操作类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">手动控制</SelectItem>
                <SelectItem value="auto">自动控制</SelectItem>
                <SelectItem value="schedule">定时任务</SelectItem>
                <SelectItem value="system">系统操作</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <Search className="h-4 w-4 mr-1" />
            查询
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCw className="h-4 w-4 mr-1" />
            重置
          </Button>
        </div>

        {/* 工具栏 */}
        <div className="flex items-center justify-between">
          <Button variant="default">
            <Download className="h-4 w-4 mr-1" />
            导出
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Wrench className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 表格 */}
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">教室</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">操作类型</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">操作内容</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">IP地址</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">客户端类型</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">操作时间</th>
              </tr>
            </thead>
            <tbody>
              {logsData.map((log) => (
                <tr key={log.id} className="border-b border-border hover:bg-muted/20">
                  <td className="p-3 text-center text-sm text-foreground">{log.classroom}</td>
                  <td className="p-3 text-center text-sm text-foreground">{log.operationType}</td>
                  <td className="p-3 text-center text-sm text-primary">{log.content}</td>
                  <td className="p-3 text-center text-sm text-foreground">{log.ip}</td>
                  <td className="p-3 text-center text-sm text-foreground">{log.clientType}</td>
                  <td className="p-3 text-center text-sm text-foreground">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-muted-foreground">共 {totalRecords} 条数据</span>
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                className={`min-w-[32px] h-8 px-2 text-sm rounded border ${
                  page === currentPage
                    ? "bg-primary text-primary-foreground border-primary"
                    : typeof page === "number"
                    ? "border-border hover:bg-accent"
                    : "border-transparent cursor-default"
                }`}
                disabled={typeof page !== "number"}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              className="min-w-[32px] h-8 px-2 text-sm rounded border border-border hover:bg-accent"
            >
              {">"}
            </button>
          </div>
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 条/页</SelectItem>
              <SelectItem value="20">20 条/页</SelectItem>
              <SelectItem value="50">50 条/页</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">跳至</span>
          <Input
            className="w-16 h-8"
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJump()}
          />
          <span className="text-sm text-muted-foreground">页</span>
        </div>
      </div>
    </div>
  )
}
