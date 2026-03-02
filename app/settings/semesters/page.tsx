"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SemestersPage() {
  const semesters = [
    {
      id: 1,
      name: "2023-2024学年第二学期",
      startDate: "2024-02-26",
      endDate: "2024-07-14",
      weeks: 20,
      isCurrent: true,
    },
    {
      id: 2,
      name: "2023-2024学年第一学期",
      startDate: "2023-09-01",
      endDate: "2024-01-28",
      weeks: 20,
      isCurrent: false,
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">学期管理</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          添加学期
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>学期名称</TableHead>
              <TableHead>开始日期</TableHead>
              <TableHead>结束日期</TableHead>
              <TableHead>教学周数</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semesters.map((semester) => (
              <TableRow key={semester.id}>
                <TableCell className="font-medium">{semester.name}</TableCell>
                <TableCell>{semester.startDate}</TableCell>
                <TableCell>{semester.endDate}</TableCell>
                <TableCell>{semester.weeks}周</TableCell>
                <TableCell>
                  {semester.isCurrent ? (
                    <Badge className="bg-green-500">当前学期</Badge>
                  ) : (
                    <Badge variant="outline">已结束</Badge>
                  )}
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
