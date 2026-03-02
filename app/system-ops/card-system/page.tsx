"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, CreditCard } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function CardSystemPage() {
  const cards = [
    { id: 1, cardNo: "1001", teacher: "张老师", department: "计算机学院", status: "active", bindTime: "2024-01-10" },
    { id: 2, cardNo: "1002", teacher: "李老师", department: "信息工程学院", status: "active", bindTime: "2024-01-12" },
    { id: 3, cardNo: "1003", teacher: "王老师", department: "数学学院", status: "disabled", bindTime: "2024-01-15" },
  ]

  const statusConfig = {
    active: { label: "正常", color: "bg-green-500/10 text-green-500" },
    disabled: { label: "停用", color: "bg-gray-500/10 text-gray-500" },
    lost: { label: "挂失", color: "bg-red-500/10 text-red-500" },
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">一卡通管理</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          绑定卡片
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索卡号或教师..." className="pl-9" />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>卡号</TableHead>
              <TableHead>教师姓名</TableHead>
              <TableHead>所属学院</TableHead>
              <TableHead>绑定时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.map((card) => {
              const status = statusConfig[card.status as keyof typeof statusConfig]
              return (
                <TableRow key={card.id}>
                  <TableCell className="font-mono">{card.cardNo}</TableCell>
                  <TableCell className="font-medium">{card.teacher}</TableCell>
                  <TableCell>{card.department}</TableCell>
                  <TableCell>{card.bindTime}</TableCell>
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
                      <Button variant="ghost" size="sm" className="gap-2 text-destructive">
                        <CreditCard className="h-4 w-4" />
                        解绑
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
