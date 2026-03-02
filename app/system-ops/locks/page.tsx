"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Lock, Unlock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function LocksPage() {
  const locks = [
    { id: 1, classroom: "101教室", building: "第一教学楼", lockId: "L001", status: "locked", battery: 85 },
    { id: 2, classroom: "102教室", building: "第一教学楼", lockId: "L002", status: "unlocked", battery: 92 },
    { id: 3, classroom: "201教室", building: "第二教学楼", lockId: "L003", status: "locked", battery: 45 },
  ]

  const statusConfig = {
    locked: { label: "已锁", color: "bg-red-500/10 text-red-500", icon: Lock },
    unlocked: { label: "已开", color: "bg-green-500/10 text-green-500", icon: Unlock },
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">门锁管理</h1>
        <Button>查看开锁日志</Button>
      </div>

      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索门锁..." className="pl-9" />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>教室</TableHead>
              <TableHead>教学楼</TableHead>
              <TableHead>门锁编号</TableHead>
              <TableHead>电池电量</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locks.map((lock) => {
              const status = statusConfig[lock.status as keyof typeof statusConfig]
              const Icon = status.icon
              return (
                <TableRow key={lock.id}>
                  <TableCell className="font-medium">{lock.classroom}</TableCell>
                  <TableCell>{lock.building}</TableCell>
                  <TableCell className="font-mono">{lock.lockId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-accent">
                        <div
                          className={`h-full rounded-full ${lock.battery < 50 ? "bg-orange-500" : "bg-green-500"}`}
                          style={{ width: `${lock.battery}%` }}
                        />
                      </div>
                      <span className="text-sm">{lock.battery}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`gap-1 ${status.color}`}>
                      <Icon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      {lock.status === "locked" ? "远程开锁" : "远程上锁"}
                    </Button>
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
