"use client"

import { Search, Plus, Shield, UserCheck, UserX } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UsersPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0a] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">用户管理</h1>
            <p className="mt-1 text-sm text-gray-400">系统用户与权限管理</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            添加用户
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">总用户数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">48</div>
                <p className="mt-1 text-xs text-gray-500">系统账户</p>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">管理员</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">5</div>
                <p className="mt-1 text-xs text-gray-500">完全权限</p>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">在线用户</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-400">12</div>
                <p className="mt-1 text-xs text-gray-500">当前活跃</p>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">禁用账户</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-400">3</div>
                <p className="mt-1 text-xs text-gray-500">已停用</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-white/10 bg-white/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input placeholder="搜索用户名、邮箱..." className="border-white/10 bg-white/5 pl-10 text-white" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px] border-white/10 bg-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部角色</SelectItem>
                    <SelectItem value="admin">管理员</SelectItem>
                    <SelectItem value="operator">运维人员</SelectItem>
                    <SelectItem value="viewer">查看者</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="active">
                  <SelectTrigger className="w-[150px] border-white/10 bg-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="active">正常</SelectItem>
                    <SelectItem value="disabled">禁用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* User List */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">用户列表</CardTitle>
              <CardDescription>所有系统用户账户</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: "管理员",
                    email: "admin@university.edu",
                    role: "admin",
                    status: "active",
                    lastLogin: "5分钟前",
                    dept: "信息中心",
                  },
                  {
                    name: "张伟",
                    email: "zhangwei@university.edu",
                    role: "admin",
                    status: "active",
                    lastLogin: "1小时前",
                    dept: "信息中心",
                  },
                  {
                    name: "李芳",
                    email: "lifang@university.edu",
                    role: "operator",
                    status: "active",
                    lastLogin: "2小时前",
                    dept: "后勤处",
                  },
                  {
                    name: "王强",
                    email: "wangqiang@university.edu",
                    role: "operator",
                    status: "active",
                    lastLogin: "3小时前",
                    dept: "后勤处",
                  },
                  {
                    name: "刘敏",
                    email: "liumin@university.edu",
                    role: "viewer",
                    status: "disabled",
                    lastLogin: "7天前",
                    dept: "教务处",
                  },
                ].map((user, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border border-white/10">
                        <AvatarFallback
                          className={`${
                            user.role === "admin"
                              ? "bg-blue-500/10 text-blue-400"
                              : user.role === "operator"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-gray-500/10 text-gray-400"
                          }`}
                        >
                          {user.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{user.name}</p>
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : user.role === "operator" ? "secondary" : "outline"
                            }
                            className="text-xs"
                          >
                            {user.role === "admin" ? "管理员" : user.role === "operator" ? "运维人员" : "查看者"}
                          </Badge>
                          <Badge variant={user.status === "active" ? "outline" : "destructive"} className="text-xs">
                            {user.status === "active" ? "正常" : "禁用"}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">{user.email}</p>
                        <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                          <span>{user.dept}</span>
                          <span>最后登录: {user.lastLogin}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Shield className="mr-2 h-4 w-4" />
                        权限
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        编辑
                      </Button>
                      {user.status === "active" ? (
                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                          <UserX className="mr-2 h-4 w-4" />
                          禁用
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300">
                          <UserCheck className="mr-2 h-4 w-4" />
                          启用
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Role Permissions */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">角色权限</CardTitle>
              <CardDescription>不同角色的系统权限配置</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    role: "管理员",
                    color: "bg-blue-500",
                    permissions: "完全权限：系统配置、用户管理、设备控制、数据查看",
                  },
                  {
                    role: "运维人员",
                    color: "bg-emerald-500",
                    permissions: "设备控制、工单处理、数据查看、报修管理",
                  },
                  {
                    role: "查看者",
                    color: "bg-gray-500",
                    permissions: "仅数据查看：教室状态、设备信息、统计报表",
                  },
                ].map((item) => (
                  <div
                    key={item.role}
                    className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <div className={`h-3 w-3 rounded-full ${item.color} mt-1`} />
                    <div className="flex-1">
                      <p className="font-medium text-white">{item.role}</p>
                      <p className="mt-1 text-sm text-gray-400">{item.permissions}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      配置
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
