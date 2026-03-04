"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Search, RefreshCw, Wrench, Settings, ChevronUp, ChevronDown, Info, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 刷卡日志数据
const cardLogsData = [
  { id: 1, cardNo: "2954237737", name: "李佳星", studentId: "2023073", college: "国际交流与合作处", classroom: "410", result: "刷卡成功", time: "2023/12/11 14:04:43" },
  { id: 2, cardNo: "322951548", name: "詹志兰", studentId: "1990007", college: "机械工程与自动化学院", classroom: "120", result: "刷卡成功", time: "2023/12/11 13:57:59" },
  { id: 3, cardNo: "709735754", name: "董文卓", studentId: "2110030212", college: "外国语学院", classroom: "319", result: "刷卡成功", time: "2023/12/11 13:54:40" },
  { id: 4, cardNo: "183680979", name: "韦炜", studentId: "2011013", college: "纺织科学与工程学院", classroom: "112", result: "刷卡成功", time: "2023/12/11 13:53:21" },
  { id: 5, cardNo: "193880691", name: "陶咏真", studentId: "2007039", college: "材料科学与工程学院", classroom: "218", result: "刷卡成功", time: "2023/12/11 13:52:25" },
]

export default function CardLogsPage() {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [searchClassroom, setSearchClassroom] = useState("")
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [pageSize, setPageSize] = useState(10)

  const handleReset = () => {
    setSearchKeyword("")
    setSearchClassroom("")
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedRows(cardLogsData.map((l) => l.id))
    else setSelectedRows([])
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) setSelectedRows([...selectedRows, id])
    else setSelectedRows(selectedRows.filter((rid) => rid !== id))
  }

  const totalItems = 9051

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {/* 筛选栏 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">卡号/姓名:</span>
            <Input
              placeholder="请输入卡号或姓名"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">刷卡教室:</span>
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

        {/* 数据表格 */}
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-3 text-center w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === cardLogsData.length && cardLogsData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4"
                  />
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    卡号
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">姓名</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">学工号</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">学院</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">刷卡教室</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">刷卡结果</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    刷卡时间
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {cardLogsData.map((log) => (
                <tr key={log.id} className="border-b border-border hover:bg-muted/20">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(log.id)}
                      onChange={(e) => handleSelectRow(log.id, e.target.checked)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="p-3 text-center text-sm font-mono">{log.cardNo}</td>
                  <td className="p-3 text-center text-sm">{log.name}</td>
                  <td className="p-3 text-center text-sm">{log.studentId}</td>
                  <td className="p-3 text-center text-sm max-w-[200px] truncate" title={log.college}>{log.college}</td>
                  <td className="p-3 text-center text-sm">{log.classroom}</td>
                  <td className="p-3 text-center text-sm text-green-600">{log.result}</td>
                  <td className="p-3 text-center text-sm">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-end gap-4">
          <span className="text-sm text-muted-foreground">共 {totalItems} 条数据</span>
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
