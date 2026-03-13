"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, RefreshCw, Wrench, Settings, ChevronUp, ChevronDown, Info } from "lucide-react"
import { cn } from "@/lib/utils"

// 模拟数据
const cardsData = [
  { id: 1, cardNo: "1001", teacher: "张老师", department: "计算机学院", status: "正常", bindTime: "2024-01-10", createdAt: "2026-02-06 14:03:38" },
  { id: 2, cardNo: "1002", teacher: "李老师", department: "信息工程学院", status: "正常", bindTime: "2024-01-12", createdAt: "2026-02-06 14:03:38" },
  { id: 3, cardNo: "1003", teacher: "王老师", department: "数学学院", status: "停用", bindTime: "2024-01-15", createdAt: "2026-02-02 09:37:51" },
  { id: 4, cardNo: "1004", teacher: "刘老师", department: "物理学院", status: "挂失", bindTime: "2024-01-18", createdAt: "2026-02-02 09:37:51" },
]

export default function CardSystemPage() {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(cardsData.map((c) => c.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id])
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    }
  }

  const handleReset = () => {
    setSearchKeyword("")
    setSelectedStatus("")
  }

  const totalItems = cardsData.length

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {/* 筛选栏 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">卡号/教师:</span>
            <Input
              placeholder="请输入卡号或教师姓名"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">状态:</span>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="请选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">正常</SelectItem>
                <SelectItem value="disabled">停用</SelectItem>
                <SelectItem value="lost">挂失</SelectItem>
              </SelectContent>
            </Select>
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
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            新增
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
                    checked={selectedRows.length === cardsData.length && cardsData.length > 0}
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
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    教师姓名
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    所属学院
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    绑定时间
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">状态</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    创建时间
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              {cardsData.map((card) => (
                <tr key={card.id} className="border-b border-border hover:bg-muted/20">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(card.id)}
                      onChange={(e) => handleSelectRow(card.id, e.target.checked)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="p-3 text-center text-sm font-mono">{card.cardNo}</td>
                  <td className="p-3 text-center text-sm">{card.teacher}</td>
                  <td className="p-3 text-center text-sm">{card.department}</td>
                  <td className="p-3 text-center text-sm">{card.bindTime}</td>
                  <td className="p-3 text-center">
                    <span
                      className={cn(
                        "text-sm",
                        card.status === "正常" && "text-green-600",
                        card.status === "停用" && "text-muted-foreground",
                        card.status === "挂失" && "text-red-600",
                      )}
                    >
                      {card.status}
                    </span>
                  </td>
                  <td className="p-3 text-center text-sm">{card.createdAt}</td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-sm text-primary hover:underline">编辑</button>
                      <button className="text-sm text-primary hover:underline">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-end gap-4">
          <span className="text-sm text-muted-foreground">共 {totalItems} 条数据</span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-primary text-primary-foreground"
            >
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
