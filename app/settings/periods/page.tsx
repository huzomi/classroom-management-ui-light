"use client"

import { Button } from "@/components/ui/button"
import { Plus, Edit } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PeriodsPage() {
  const periods = [
    { id: 1, name: "第一节", startTime: "08:00", endTime: "08:45" },
    { id: 2, name: "第二节", startTime: "08:55", endTime: "09:40" },
    { id: 3, name: "第三节", startTime: "10:00", endTime: "10:45" },
    { id: 4, name: "第四节", startTime: "10:55", endTime: "11:40" },
    { id: 5, name: "第五节", startTime: "14:00", endTime: "14:45" },
    { id: 6, name: "第六节", startTime: "14:55", endTime: "15:40" },
  ]

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">节次管理</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          添加节次
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>节次名称</TableHead>
              <TableHead>开始时间</TableHead>
              <TableHead>结束时间</TableHead>
              <TableHead>时长</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {periods.map((period) => (
              <TableRow key={period.id}>
                <TableCell className="font-medium">{period.name}</TableCell>
                <TableCell>{period.startTime}</TableCell>
                <TableCell>{period.endTime}</TableCell>
                <TableCell>45分钟</TableCell>
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
