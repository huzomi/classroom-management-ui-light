"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Download, RefreshCw, Wrench, Settings, ChevronUp, ChevronDown, Info, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const mockAssets = [
  { id: "1", building: "第一教学楼", classroom: "101", deviceName: "投影机", model: "EPSON EB-C2150XB", serialNumber: "EP2024001", type: "显示设备", lifespan: "5年", purchaseDate: "2022-03-15", status: "正常", createdAt: "2026-02-06 14:03:38" },
  { id: "2", building: "第一教学楼", classroom: "101", deviceName: "中控主机", model: "CREATOR CR-MX800", serialNumber: "CR2024001", type: "控制设备", lifespan: "8年", purchaseDate: "2022-03-15", status: "正常", createdAt: "2026-02-06 14:03:38" },
  { id: "3", building: "第一教学楼", classroom: "102", deviceName: "一体机", model: "鸿合 HV-I889", serialNumber: "HH2024001", type: "显示设备", lifespan: "5年", purchaseDate: "2023-06-20", status: "正常", createdAt: "2026-02-06 14:03:38" },
  { id: "4", building: "第一教学楼", classroom: "103", deviceName: "功放", model: "TOA A-2240", serialNumber: "TOA2024001", type: "音频设备", lifespan: "10年", purchaseDate: "2021-09-10", status: "维修中", createdAt: "2026-02-02 09:37:51" },
]

export default function AssetsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [buildingFilter, setBuildingFilter] = useState<string>("")
  const [typeFilter, setTypeFilter] = useState<string>("")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [pageSize, setPageSize] = useState(10)

  const handleReset = () => {
    setSearchQuery("")
    setBuildingFilter("")
    setTypeFilter("")
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedRows(mockAssets.map((a) => a.id))
    else setSelectedRows([])
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) setSelectedRows([...selectedRows, id])
    else setSelectedRows(selectedRows.filter((rid) => rid !== id))
  }

  const totalItems = mockAssets.length

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">设备总数</div>
            <div className="text-2xl font-semibold">2,456</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">正常设备</div>
            <div className="text-2xl font-semibold text-green-600">2,398</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">维修中</div>
            <div className="text-2xl font-semibold text-amber-600">42</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">已报废</div>
            <div className="text-2xl font-semibold text-muted-foreground">16</div>
          </Card>
        </div>

        {/* 筛选栏 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">设备/教室/序列号:</span>
            <Input
              placeholder="请输入设备名称、教室或序列号"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">所属楼栋:</span>
            <Select value={buildingFilter} onValueChange={setBuildingFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="请选择楼栋" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="building-1">第一教学楼</SelectItem>
                <SelectItem value="building-2">第二教学楼</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">设备类型:</span>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="请选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="display">显示设备</SelectItem>
                <SelectItem value="control">控制设备</SelectItem>
                <SelectItem value="audio">音频设备</SelectItem>
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
            <Button variant="outline">
              <Download className="h-4 w-4 mr-1" />
              导出
            </Button>
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
                    checked={selectedRows.length === mockAssets.length && mockAssets.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4"
                  />
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">楼栋</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">教室</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    设备名称
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">设备型号</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">设备序号</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">设备类型</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">寿命周期</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">购买时间</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">状态</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              {mockAssets.map((asset) => (
                <tr key={asset.id} className="border-b border-border hover:bg-muted/20">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(asset.id)}
                      onChange={(e) => handleSelectRow(asset.id, e.target.checked)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="p-3 text-center text-sm">{asset.building}</td>
                  <td className="p-3 text-center text-sm">{asset.classroom}</td>
                  <td className="p-3 text-center text-sm font-medium">{asset.deviceName}</td>
                  <td className="p-3 text-center text-sm text-muted-foreground">{asset.model}</td>
                  <td className="p-3 text-center text-sm font-mono">{asset.serialNumber}</td>
                  <td className="p-3 text-center">
                    <Badge variant="outline">{asset.type}</Badge>
                  </td>
                  <td className="p-3 text-center text-sm">{asset.lifespan}</td>
                  <td className="p-3 text-center text-sm">{asset.purchaseDate}</td>
                  <td className="p-3 text-center">
                    <span
                      className={cn(
                        "text-sm",
                        asset.status === "正常" && "text-green-600",
                        asset.status === "维修中" && "text-amber-600",
                      )}
                    >
                      {asset.status}
                    </span>
                  </td>
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
