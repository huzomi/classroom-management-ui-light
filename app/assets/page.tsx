"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Download, Filter, Edit, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockAssets = [
  {
    id: "1",
    building: "第一教学楼",
    classroom: "101",
    deviceName: "投影机",
    model: "EPSON EB-C2150XB",
    serialNumber: "EP2024001",
    type: "显示设备",
    lifespan: "5年",
    purchaseDate: "2022-03-15",
    status: "正常",
  },
  {
    id: "2",
    building: "第一教学楼",
    classroom: "101",
    deviceName: "中控主机",
    model: "CREATOR CR-MX800",
    serialNumber: "CR2024001",
    type: "控制设备",
    lifespan: "8年",
    purchaseDate: "2022-03-15",
    status: "正常",
  },
  {
    id: "3",
    building: "第一教学楼",
    classroom: "102",
    deviceName: "一体机",
    model: "鸿合 HV-I889",
    serialNumber: "HH2024001",
    type: "显示设备",
    lifespan: "5年",
    purchaseDate: "2023-06-20",
    status: "正常",
  },
  {
    id: "4",
    building: "第一教学楼",
    classroom: "103",
    deviceName: "功放",
    model: "TOA A-2240",
    serialNumber: "TOA2024001",
    type: "音频设备",
    lifespan: "10年",
    purchaseDate: "2021-09-10",
    status: "维修中",
  },
]

export default function AssetsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [buildingFilter, setBuildingFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredAssets = mockAssets.filter((asset) => {
    const matchesSearch =
      asset.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.classroom.includes(searchQuery) ||
      asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBuilding = buildingFilter === "all" || asset.building === buildingFilter
    const matchesType = typeFilter === "all" || asset.type === typeFilter
    return matchesSearch && matchesBuilding && matchesType
  })

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索设备名称、教室、序列号"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={buildingFilter} onValueChange={setBuildingFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="选择楼栋" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部楼栋</SelectItem>
                <SelectItem value="第一教学楼">第一教学楼</SelectItem>
                <SelectItem value="第二教学楼">第二教学楼</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="设备类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="显示设备">显示设备</SelectItem>
                <SelectItem value="控制设备">控制设备</SelectItem>
                <SelectItem value="音频设备">音频设备</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              高级筛选
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              导出
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              添加设备
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6 border-b border-border">
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">设备总数</div>
            <div className="text-2xl font-semibold">2,456</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">正常设备</div>
            <div className="text-2xl font-semibold text-success">2,398</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">维修中</div>
            <div className="text-2xl font-semibold text-warning">42</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">已报废</div>
            <div className="text-2xl font-semibold text-muted-foreground">16</div>
          </Card>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>楼栋</TableHead>
                <TableHead>教室</TableHead>
                <TableHead>设备名称</TableHead>
                <TableHead>设备型号</TableHead>
                <TableHead>设备序号</TableHead>
                <TableHead>设备类型</TableHead>
                <TableHead>寿命周期</TableHead>
                <TableHead>购买时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.building}</TableCell>
                  <TableCell>{asset.classroom}</TableCell>
                  <TableCell className="font-medium">{asset.deviceName}</TableCell>
                  <TableCell className="text-muted-foreground">{asset.model}</TableCell>
                  <TableCell className="font-mono text-sm">{asset.serialNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{asset.type}</Badge>
                  </TableCell>
                  <TableCell>{asset.lifespan}</TableCell>
                  <TableCell className="text-muted-foreground">{asset.purchaseDate}</TableCell>
                  <TableCell>
                    <Badge variant={asset.status === "正常" ? "default" : "secondary"}>{asset.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
