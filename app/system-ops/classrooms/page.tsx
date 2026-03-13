"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, RefreshCw, Wrench, Settings, ChevronUp, ChevronDown, Info } from "lucide-react"
import { cn } from "@/lib/utils"

// 模拟数据
const classroomsData = [
  { id: 1, name: "101教室", building: "第一教学楼", floor: 1, capacity: 50, devices: 10, sort: 1, status: "正常", createdAt: "2026-02-06 14:03:38" },
  { id: 2, name: "102教室", building: "第一教学楼", floor: 1, capacity: 50, devices: 10, sort: 2, status: "正常", createdAt: "2026-02-06 14:03:38" },
  { id: 3, name: "103教室", building: "第一教学楼", floor: 1, capacity: 60, devices: 12, sort: 3, status: "维护中", createdAt: "2026-02-06 14:03:38" },
  { id: 4, name: "201教室", building: "第一教学楼", floor: 2, capacity: 80, devices: 15, sort: 1, status: "正常", createdAt: "2026-02-02 09:37:51" },
  { id: 5, name: "202教室", building: "第二教学楼", floor: 1, capacity: 70, devices: 12, sort: 2, status: "离线", createdAt: "2026-02-02 09:37:51" },
]

export default function ClassroomsPage() {
  const [searchName, setSearchName] = useState("")
  const [selectedBuilding, setSelectedBuilding] = useState<string>("")
  const [selectedFloor, setSelectedFloor] = useState<string>("")
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(classroomsData.map((c) => c.id))
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
    setSearchName("")
    setSelectedBuilding("")
    setSelectedFloor("")
  }

  const totalItems = classroomsData.length

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {/* 筛选栏 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">教室名称:</span>
            <Input
              placeholder="请输入教室名称"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">所属楼栋:</span>
            <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="请选择楼栋" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="building-1">第一教学楼</SelectItem>
                <SelectItem value="building-2">第二教学楼</SelectItem>
                <SelectItem value="building-3">实验楼</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">所属楼层:</span>
            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="请选择楼层" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1层</SelectItem>
                <SelectItem value="2">2层</SelectItem>
                <SelectItem value="3">3层</SelectItem>
                <SelectItem value="4">4层</SelectItem>
                <SelectItem value="5">5层</SelectItem>
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
                    checked={selectedRows.length === classroomsData.length && classroomsData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4"
                  />
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    教室名称
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    所属楼栋
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    楼层
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    容量
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    设备数
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
              {classroomsData.map((classroom) => (
                <tr key={classroom.id} className="border-b border-border hover:bg-muted/20">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(classroom.id)}
                      onChange={(e) => handleSelectRow(classroom.id, e.target.checked)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="p-3 text-center text-sm">{classroom.name}</td>
                  <td className="p-3 text-center text-sm">{classroom.building}</td>
                  <td className="p-3 text-center text-sm">{classroom.floor}层</td>
                  <td className="p-3 text-center text-sm">{classroom.capacity}人</td>
                  <td className="p-3 text-center text-sm">{classroom.devices}台</td>
                  <td className="p-3 text-center text-sm">{classroom.sort}</td>
                  <td className="p-3 text-center">
                    <span
                      className={cn(
                        "text-sm",
                        classroom.status === "正常" && "text-green-600",
                        classroom.status === "维护中" && "text-amber-600",
                        classroom.status === "离线" && "text-muted-foreground",
                      )}
                    >
                      {classroom.status}
                    </span>
                  </td>
                  <td className="p-3 text-center text-sm">{classroom.createdAt}</td>
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
