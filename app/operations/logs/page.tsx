"use client"

import { useState } from "react"
// 操作日志页面
import { Button } from "@/components/ui/button"
import { Download, Search, RefreshCw, Wrench, Settings, ChevronUp, ChevronDown, Info, Trash2 } from "lucide-react"
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
  const [searchClassroom, setSearchClassroom] = useState("")
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  const totalRecords = 1667

  const handleReset = () => {
    setOperationType("")
    setSearchClassroom("")
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedRows(logsData.map((l) => l.id))
    else setSelectedRows([])
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) setSelectedRows([...selectedRows, id])
    else setSelectedRows(selectedRows.filter((rid) => rid !== id))
  }

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {/* 筛选栏 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">操作类型:</span>
            <Select value={operationType} onValueChange={setOperationType}>
              <SelectTrigger className="w-48">
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
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">教室:</span>
            <Input
              placeholder="请输入教室"
              value={searchClassroom}
              onChange={(e) => setSearchClassroom(e.target.value)}
              className="w-48"
            />
          </div>
          <Button>
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
            <Button>
              <Download className="h-4 w-4 mr-1" />
              导出
            </Button>
            {selectedRows.length > 0 && (
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-1" />
                批量删除
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
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

        {/* 表格 */}
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-3 text-center w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === logsData.length && logsData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4"
                  />
                </th>
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
              {logsData.map((log) => (
                <tr key={log.id} className="border-b border-border hover:bg-muted/20">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(log.id)}
                      onChange={(e) => handleSelectRow(log.id, e.target.checked)}
                      className="h-4 w-4"
                    />
                  </td>
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
        <div className="flex items-center justify-end gap-4">
          <span className="text-sm text-muted-foreground">共 {totalRecords} 条数据</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-primary text-primary-foreground">
              1
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
