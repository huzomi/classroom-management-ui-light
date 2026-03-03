"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Wrench, Settings } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// 刷卡日志数据
const cardLogs = [
  { id: 1, cardNo: "2954237737", name: "李佳星", studentId: "2023073", college: "国际交流与合作处(港澳台事务工作办公室)、国际教育学...", classroom: "410", result: "刷卡成功", time: "2023/12/11 14:04:43" },
  { id: 2, cardNo: "322951548", name: "詹志兰", studentId: "1990007", college: "机械工程与自动化学院", classroom: "120", result: "刷卡成功", time: "2023/12/11 13:57:59" },
  { id: 3, cardNo: "709735754", name: "董文卓", studentId: "2110030212", college: "外国语学院", classroom: "319", result: "刷卡成功", time: "2023/12/11 13:54:40" },
  { id: 4, cardNo: "183680979", name: "韦炜", studentId: "2011013", college: "纺织科学与工程学院", classroom: "112", result: "刷卡成功", time: "2023/12/11 13:53:21" },
  { id: 5, cardNo: "193880691", name: "陶咏真", studentId: "2007039", college: "材料科学与工程学院", classroom: "218", result: "刷卡成功", time: "2023/12/11 13:52:25" },
  { id: 6, cardNo: "2953982105", name: "陈苏", studentId: "2011087", college: "会计学院", classroom: "217", result: "刷卡成功", time: "2023/12/11 13:51:00" },
  { id: 7, cardNo: "193302067", name: "燕妮", studentId: "2010054", college: "经济学院", classroom: "110", result: "刷卡成功", time: "2023/12/11 13:46:54" },
  { id: 8, cardNo: "2567553182", name: "梁韶彤", studentId: "2313220315", college: "材料科学与工程学院", classroom: "101", result: "刷卡成功", time: "2023/12/11 13:40:14" },
  { id: 9, cardNo: "322951548", name: "詹志兰", studentId: "1990007", college: "机械工程与自动化学院", classroom: "102", result: "刷卡成功", time: "2023/12/11 13:31:44" },
  { id: 10, cardNo: "601654528", name: "武玉琴", studentId: "2011003", college: "机械工程与自动化学院", classroom: "408", result: "刷卡成功", time: "2023/12/11 13:25:34" },
]

export default function CardLogsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState("10")
  const [jumpPage, setJumpPage] = useState("")
  const totalRecords = 9051
  const totalPages = Math.ceil(totalRecords / parseInt(pageSize))

  const handleJumpPage = () => {
    const page = parseInt(jumpPage)
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      setJumpPage("")
    }
  }

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {/* 工具栏 */}
        <div className="flex items-center justify-between">
          <Button>
            <Download className="h-4 w-4 mr-1" />
            导出
          </Button>
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

        {/* 数据表格 */}
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">卡号</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">姓名</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">学工号</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">学院</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">刷卡教室</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">刷卡结果</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">刷卡时间</th>
              </tr>
            </thead>
            <tbody>
              {cardLogs.map((log) => (
                <tr key={log.id} className="border-b border-border hover:bg-muted/20">
                  <td className="p-3 text-center text-sm text-foreground">{log.cardNo}</td>
                  <td className="p-3 text-center text-sm text-primary">{log.name}</td>
                  <td className="p-3 text-center text-sm text-foreground">{log.studentId}</td>
                  <td className="p-3 text-center text-sm text-primary max-w-[200px] truncate" title={log.college}>{log.college}</td>
                  <td className="p-3 text-center text-sm text-primary">{log.classroom}</td>
                  <td className="p-3 text-center text-sm text-green-600">{log.result}</td>
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
            <Button
              variant="outline"
              size="sm"
              className={`h-8 w-8 p-0 ${currentPage === 1 ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 w-8 p-0 ${currentPage === 2 ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setCurrentPage(2)}
            >
              2
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 w-8 p-0 ${currentPage === 3 ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setCurrentPage(3)}
            >
              3
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 w-8 p-0 ${currentPage === 4 ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setCurrentPage(4)}
            >
              4
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 w-8 p-0 ${currentPage === 5 ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setCurrentPage(5)}
            >
              5
            </Button>
            <span className="text-muted-foreground px-2">...</span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(906)}
            >
              906
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            >
              {">"}
            </Button>
          </div>
          <Select value={pageSize} onValueChange={setPageSize}>
            <SelectTrigger className="w-[100px] h-8">
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
            onKeyDown={(e) => e.key === "Enter" && handleJumpPage()}
          />
          <span className="text-sm text-muted-foreground">页</span>
        </div>
      </div>
    </main>
  )
}
