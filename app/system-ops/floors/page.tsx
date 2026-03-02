"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function FloorsPage() {
  const floors = [
    { id: 1, building: "第一教学楼", floor: 1, classrooms: 24, devices: 240 },
    { id: 2, building: "第一教学楼", floor: 2, classrooms: 24, devices: 240 },
    { id: 3, building: "第一教学楼", floor: 3, classrooms: 24, devices: 240 },
    { id: 4, building: "第二教学楼", floor: 1, classrooms: 25, devices: 250 },
    { id: 5, building: "第二教学楼", floor: 2, classrooms: 25, devices: 250 },
  ]

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">楼层管理</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          添加楼层
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索楼层..." className="pl-9" />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>教学楼</TableHead>
              <TableHead>楼层</TableHead>
              <TableHead>教室数量</TableHead>
              <TableHead>设备数量</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {floors.map((floor) => (
              <TableRow key={floor.id}>
                <TableCell className="font-medium">{floor.building}</TableCell>
                <TableCell>{floor.floor}层</TableCell>
                <TableCell>{floor.classrooms}</TableCell>
                <TableCell>{floor.devices}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">
                    正常
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    编辑
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
