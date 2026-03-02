"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Key } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function UsersPage() {
  const users = [
    { id: 1, username: "admin", name: "系统管理员", role: "admin", department: "信息中心", status: "active" },
    { id: 2, username: "zhangsan", name: "张三", role: "operator", department: "设备管理科", status: "active" },
    { id: 3, username: "lisi", name: "李四", role: "viewer", department: "教务处", status: "active" },
  ]

  const roleConfig = {
    admin: { label: "管理员", color: "bg-red-500/10 text-red-500" },
    operator: { label: "操作员", color: "bg-blue-500/10 text-blue-500" },
    viewer: { label: "查看者", color: "bg-gray-500/10 text-gray-500" },
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          添加用户
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索用户..." className="pl-9" />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户名</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>部门</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const role = roleConfig[user.role as keyof typeof roleConfig]
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-mono">{user.username}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={role.color}>
                      {role.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500">
                      正常
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        编辑
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Key className="h-4 w-4" />
                        重置密码
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
