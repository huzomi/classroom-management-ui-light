"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DictionaryPage() {
  const dictionaries = [
    { id: 1, type: "设备类型", code: "PROJECTOR", value: "投影仪", sort: 1 },
    { id: 2, type: "设备类型", code: "COMPUTER", value: "电脑", sort: 2 },
    { id: 3, type: "设备类型", code: "AIR_CONDITIONER", value: "空调", sort: 3 },
    { id: 4, type: "设备状态", code: "ONLINE", value: "在线", sort: 1 },
    { id: 5, type: "设备状态", code: "OFFLINE", value: "离线", sort: 2 },
    { id: 6, type: "设备状态", code: "FAULT", value: "故障", sort: 3 },
  ]

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">字典管理</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          添加字典项
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索字典..." className="pl-9" />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>字典类型</TableHead>
              <TableHead>字典编码</TableHead>
              <TableHead>字典值</TableHead>
              <TableHead>排序</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dictionaries.map((dict) => (
              <TableRow key={dict.id}>
                <TableCell>
                  <Badge variant="outline">{dict.type}</Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{dict.code}</TableCell>
                <TableCell className="font-medium">{dict.value}</TableCell>
                <TableCell>{dict.sort}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      编辑
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-destructive">
                      <Trash2 className="h-4 w-4" />
                      删除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
