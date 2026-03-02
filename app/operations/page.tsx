"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, Clock, Filter, Plus, Search, Wrench, User, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function OperationsPage() {
  const [filterStatus, setFilterStatus] = useState("all")

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0a] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">运维管理</h1>
            <p className="mt-1 text-sm text-gray-400">故障报修与工单处理</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                新建工单
              </Button>
            </DialogTrigger>
            <DialogContent className="border-white/10 bg-[#0f0f0f]">
              <DialogHeader>
                <DialogTitle className="text-white">新建报修工单</DialogTitle>
                <DialogDescription>填写故障信息，提交报修申请</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">教室位置</Label>
                  <Select>
                    <SelectTrigger className="border-white/10 bg-white/5">
                      <SelectValue placeholder="选择教室" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="101">101教室</SelectItem>
                      <SelectItem value="102">102教室</SelectItem>
                      <SelectItem value="103">103教室</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">故障设备</Label>
                  <Select>
                    <SelectTrigger className="border-white/10 bg-white/5">
                      <SelectValue placeholder="选择设备" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="projector">投影仪</SelectItem>
                      <SelectItem value="computer">台式机</SelectItem>
                      <SelectItem value="amplifier">功放</SelectItem>
                      <SelectItem value="lights">灯光</SelectItem>
                      <SelectItem value="ac">空调</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">故障描述</Label>
                  <Textarea placeholder="请描述故障现象..." className="border-white/10 bg-white/5 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">优先级</Label>
                  <Select>
                    <SelectTrigger className="border-white/10 bg-white/5">
                      <SelectValue placeholder="选择优先级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">低</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="high">高</SelectItem>
                      <SelectItem value="urgent">紧急</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="border-white/10 bg-white/5">
                  取消
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">提交工单</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="bg-white/5">
            <TabsTrigger value="tickets">工单列表</TabsTrigger>
            <TabsTrigger value="statistics">统计分析</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-6">
            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">待处理</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-400">12</div>
                  <p className="mt-1 text-xs text-gray-500">紧急: 3</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">处理中</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">8</div>
                  <p className="mt-1 text-xs text-gray-500">平均用时: 2.5h</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">已完成</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-400">156</div>
                  <p className="mt-1 text-xs text-gray-500">本月完成</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">平均响应</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">18</div>
                  <p className="mt-1 text-xs text-gray-500">分钟</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="border-white/10 bg-white/5">
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        placeholder="搜索工单编号、教室、设备..."
                        className="border-white/10 bg-white/5 pl-10 text-white"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px] border-white/10 bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="pending">待处理</SelectItem>
                      <SelectItem value="processing">处理中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="border-white/10 bg-white/5">
                    <Filter className="mr-2 h-4 w-4" />
                    更多筛选
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tickets List */}
            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-0">
                <div className="divide-y divide-white/10">
                  {[
                    {
                      id: "WO-2024-001",
                      room: "101教室",
                      device: "投影仪",
                      issue: "无法开机",
                      priority: "urgent",
                      status: "pending",
                      time: "10分钟前",
                      reporter: "张老师",
                    },
                    {
                      id: "WO-2024-002",
                      room: "203教室",
                      device: "台式机",
                      issue: "系统蓝屏",
                      priority: "high",
                      status: "processing",
                      time: "1小时前",
                      reporter: "李老师",
                      handler: "王工",
                    },
                    {
                      id: "WO-2024-003",
                      room: "305教室",
                      device: "功放",
                      issue: "声音异常",
                      priority: "medium",
                      status: "processing",
                      time: "2小时前",
                      reporter: "刘老师",
                      handler: "赵工",
                    },
                    {
                      id: "WO-2024-004",
                      room: "102教室",
                      device: "灯光",
                      issue: "无法调光",
                      priority: "low",
                      status: "completed",
                      time: "3小时前",
                      reporter: "陈老师",
                      handler: "钱工",
                    },
                    {
                      id: "WO-2024-005",
                      room: "201教室",
                      device: "空调",
                      issue: "制冷效果差",
                      priority: "medium",
                      status: "completed",
                      time: "5小时前",
                      reporter: "周老师",
                      handler: "孙工",
                    },
                  ].map((ticket) => (
                    <div key={ticket.id} className="p-4 transition-colors hover:bg-white/5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`mt-1 flex h-10 w-10 items-center justify-center rounded-lg ${
                              ticket.status === "pending"
                                ? "bg-amber-500/10"
                                : ticket.status === "processing"
                                  ? "bg-blue-500/10"
                                  : "bg-emerald-500/10"
                            }`}
                          >
                            {ticket.status === "completed" ? (
                              <CheckCircle className="h-5 w-5 text-emerald-400" />
                            ) : ticket.priority === "urgent" ? (
                              <AlertTriangle className="h-5 w-5 text-red-400" />
                            ) : (
                              <Wrench className="h-5 w-5 text-blue-400" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-sm font-medium text-white">{ticket.id}</p>
                              <Badge
                                variant={
                                  ticket.status === "pending"
                                    ? "secondary"
                                    : ticket.status === "processing"
                                      ? "default"
                                      : "outline"
                                }
                                className="text-xs"
                              >
                                {ticket.status === "pending"
                                  ? "待处理"
                                  : ticket.status === "processing"
                                    ? "处理中"
                                    : "已完成"}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  ticket.priority === "urgent"
                                    ? "border-red-500/50 text-red-400"
                                    : ticket.priority === "high"
                                      ? "border-orange-500/50 text-orange-400"
                                      : ticket.priority === "medium"
                                        ? "border-yellow-500/50 text-yellow-400"
                                        : "border-gray-500/50 text-gray-400"
                                }`}
                              >
                                {ticket.priority === "urgent"
                                  ? "紧急"
                                  : ticket.priority === "high"
                                    ? "高"
                                    : ticket.priority === "medium"
                                      ? "中"
                                      : "低"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {ticket.room}
                              </span>
                              <span className="flex items-center gap-1">
                                <Wrench className="h-3 w-3" />
                                {ticket.device}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {ticket.reporter}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300">{ticket.issue}</p>
                            {ticket.handler && <p className="text-xs text-gray-500">处理人: {ticket.handler}</p>}
                            <p className="flex items-center text-xs text-gray-500">
                              <Clock className="mr-1 h-3 w-3" />
                              {ticket.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {ticket.status === "pending" && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              接单处理
                            </Button>
                          )}
                          {ticket.status === "processing" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 bg-transparent"
                            >
                              完成工单
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            查看详情
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-white">故障设备统计</CardTitle>
                  <CardDescription>各类设备故障频次</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { device: "投影仪", count: 45, percent: 35 },
                      { device: "台式机", count: 32, percent: 25 },
                      { device: "功放", count: 28, percent: 22 },
                      { device: "灯光", count: 15, percent: 12 },
                      { device: "空调", count: 8, percent: 6 },
                    ].map((item) => (
                      <div key={item.device} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">{item.device}</span>
                          <span className="text-gray-400">{item.count}次</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                          <div className="h-full bg-blue-500" style={{ width: `${item.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-white">响应时效统计</CardTitle>
                  <CardDescription>不同优先级的平均响应时间</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { priority: "紧急", time: "5分钟", color: "bg-red-500" },
                      { priority: "高", time: "15分钟", color: "bg-orange-500" },
                      { priority: "中", time: "30分钟", color: "bg-yellow-500" },
                      { priority: "低", time: "2小时", color: "bg-gray-500" },
                    ].map((item) => (
                      <div key={item.priority} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${item.color}`} />
                          <span className="text-sm text-gray-300">{item.priority}</span>
                        </div>
                        <span className="text-sm font-medium text-white">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
