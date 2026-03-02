"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Settings } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ClassroomsPage() {
  const classrooms = [
    { id: 1, name: "101教室", building: "第一教学楼", floor: 1, capacity: 50, devices: 10, status: "active" },
    { id: 2, name: "102教室", building: "第一教学楼", floor: 1, capacity: 50, devices: 10, status: "active" },
    { id: 3, name: "103教室", building: "第一教学楼", floor: 1, capacity: 60, devices: 12, status: "maintenance" },
    { id: 4, name: "201教室", building: "第一教学楼", floor: 2, capacity: 80, devices: 15, status: "active" },
  ]

  const statusConfig = {
    active: { label: "正常", color: "bg-green-500/10 text-green-500" },
    maintenance: { label: "维护中", color: "bg-orange-500/10 text-orange-500" },
    offline: { label: "离线", color: "bg-gray-500/10 text-gray-500" },
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">教室管理</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          添加教室
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索教室..." className="pl-9" />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>教室名称</TableHead>
              <TableHead>所属楼栋</TableHead>
              <TableHead>楼层</TableHead>
              <TableHead>容量</TableHead>
              <TableHead>设备数</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classrooms.map((classroom) => {
              const status = statusConfig[classroom.status as keyof typeof statusConfig]
              return (
                <TableRow key={classroom.id}>
                  <TableCell className="font-medium">{classroom.name}</TableCell>
                  <TableCell>{classroom.building}</TableCell>
                  <TableCell>{classroom.floor}层</TableCell>
                  <TableCell>{classroom.capacity}人</TableCell>
                  <TableCell>{classroom.devices}台</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={status.color}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        编辑
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Settings className="h-4 w-4" />
                        配置
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
