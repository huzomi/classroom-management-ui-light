"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, RefreshCw, Wrench, Settings, ChevronUp, ChevronDown, Info, Trash2 } from "lucide-react"

// 模拟数据
const dictionariesData = [
  { id: 1, type: "设备类型", code: "PROJECTOR", value: "投影仪", sort: 1, createdAt: "2026-02-06 14:03:38" },
  { id: 2, type: "设备类型", code: "COMPUTER", value: "电脑", sort: 2, createdAt: "2026-02-06 14:03:38" },
  { id: 3, type: "设备类型", code: "AIR_CONDITIONER", value: "空调", sort: 3, createdAt: "2026-02-06 14:03:38" },
  { id: 4, type: "设备状态", code: "ONLINE", value: "在线", sort: 1, createdAt: "2026-02-02 09:37:51" },
  { id: 5, type: "设备状态", code: "OFFLINE", value: "离线", sort: 2, createdAt: "2026-02-02 09:37:51" },
  { id: 6, type: "设备状态", code: "FAULT", value: "故障", sort: 3, createdAt: "2026-02-02 09:37:51" },
]

export default function DictionaryPage() {
  const [searchValue, setSearchValue] = useState("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(dictionariesData.map((d) => d.id))
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
    setSearchValue("")
    setSelectedType("")
  }

  const totalItems = dictionariesData.length

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {/* 筛选栏 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">字典值:</span>
            <Input
              placeholder="请输入字典值"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">字典类型:</span>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="请选择字典类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="device-type">设备类型</SelectItem>
                <SelectItem value="device-status">设备状态</SelectItem>
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
          <div className="flex items-center gap-2">
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              新增
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
                    checked={selectedRows.length === dictionariesData.length && dictionariesData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4"
                  />
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    字典类型
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    字典编码
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    字典值
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    排序
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
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
              {dictionariesData.map((dict) => (
                <tr key={dict.id} className="border-b border-border hover:bg-muted/20">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(dict.id)}
                      onChange={(e) => handleSelectRow(dict.id, e.target.checked)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="p-3 text-center text-sm">{dict.type}</td>
                  <td className="p-3 text-center text-sm font-mono">{dict.code}</td>
                  <td className="p-3 text-center text-sm">{dict.value}</td>
                  <td className="p-3 text-center text-sm">{dict.sort}</td>
                  <td className="p-3 text-center text-sm">{dict.createdAt}</td>
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
