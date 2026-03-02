"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, Clock, Search, Wrench, MapPin, User, ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function MaintenancePage() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)

  const tickets = [
    {
      id: "FT-2024-001",
      room: "101教室",
      device: "投影仪",
      issue: "设备无法启动",
      priority: "urgent",
      status: "pending",
      time: "5分钟前",
      reporter: "张老师",
      description: "投影仪按下开机键后无任何反应，指示灯不亮",
    },
    {
      id: "FT-2024-002",
      room: "203教室",
      device: "台式机",
      issue: "系统运行缓慢",
      priority: "medium",
      status: "processing",
      time: "30分钟前",
      reporter: "李老师",
      handler: "王工",
      description: "电脑开机后运行卡顿，打开软件响应慢",
    },
    {
      id: "FT-2024-003",
      room: "305教室",
      device: "功放",
      issue: "声音有杂音",
      priority: "low",
      status: "completed",
      time: "2小时前",
      reporter: "刘老师",
      handler: "赵工",
      description: "播放音频时有明显电流声",
      solution: "更换了功放信号线，测试正常",
    },
  ]

  return (
    <div className="flex h-full">
      {/* Left Panel - Ticket List */}
      <div className="flex w-96 flex-col border-r border-white/10 bg-[#0a0a0a]">
        <div className="border-b border-white/10 p-4">
          <h2 className="text-lg font-semibold text-white">故障工单</h2>
          <p className="mt-1 text-sm text-gray-400">待处理: 12 | 处理中: 8</p>
        </div>

        <div className="border-b border-white/10 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input placeholder="搜索工单..." className="border-white/10 bg-white/5 pl-10 text-white" />
          </div>
          <div className="mt-3 flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="flex-1 border-white/10 bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待处理</SelectItem>
                <SelectItem value="processing">处理中</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket.id)}
              className={`cursor-pointer border-b border-white/10 p-4 transition-colors hover:bg-white/5 ${
                selectedTicket === ticket.id ? "bg-white/10" : ""
              }`}
            >
              <div className="flex items-start gap-3">
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
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm font-medium text-white">{ticket.id}</p>
                    <Badge
                      variant={
                        ticket.priority === "urgent"
                          ? "destructive"
                          : ticket.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {ticket.priority === "urgent" ? "紧急" : ticket.priority === "medium" ? "中" : "低"}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-white">{ticket.room}</p>
                  <p className="text-sm text-gray-400">
                    {ticket.device} - {ticket.issue}
                  </p>
                  <p className="flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    {ticket.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Ticket Details */}
      <div className="flex flex-1 flex-col">
        {selectedTicket ? (
          <>
            <div className="border-b border-white/10 bg-[#0a0a0a] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold text-white">{selectedTicket}</h1>
                    <Badge variant="default">待处理</Badge>
                    <Badge variant="destructive">紧急</Badge>
                  </div>
                  <p className="mt-2 text-gray-400">101教室 - 投影仪故障</p>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-blue-600 hover:bg-blue-700">接单处理</Button>
                  <Button variant="outline" className="border-white/10 bg-white/5">
                    转派工单
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                {/* Basic Info */}
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-sm font-medium text-white">基本信息</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">报修人</p>
                        <p className="flex items-center gap-2 text-sm text-white">
                          <User className="h-4 w-4" />
                          张老师
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">报修时间</p>
                        <p className="flex items-center gap-2 text-sm text-white">
                          <Clock className="h-4 w-4" />
                          2024-01-15 14:30:25
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">故障位置</p>
                        <p className="flex items-center gap-2 text-sm text-white">
                          <MapPin className="h-4 w-4" />
                          智慧主校区 - 第一教学楼 - 1层 - 101教室
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">故障设备</p>
                        <p className="flex items-center gap-2 text-sm text-white">
                          <Wrench className="h-4 w-4" />
                          投影仪 (型号: EPSON-EB-2250U)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Problem Description */}
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-sm font-medium text-white">故障描述</h3>
                    <p className="text-sm leading-relaxed text-gray-300">
                      投影仪按下开机键后无任何反应，指示灯不亮。昨天使用时还正常，今天上课前发现无法开机。检查了电源线连接正常，尝试重新插拔电源后依然无法启动。
                    </p>
                    <div className="mt-4">
                      <p className="mb-2 text-sm text-gray-400">现场照片</p>
                      <div className="flex gap-2">
                        <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                          <ImageIcon className="h-8 w-8 text-gray-500" />
                        </div>
                        <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                          <ImageIcon className="h-8 w-8 text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Processing Record */}
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-sm font-medium text-white">处理记录</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">处理方案</Label>
                        <Textarea
                          placeholder="描述问题原因和处理方案..."
                          className="min-h-[120px] border-white/10 bg-white/5 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">更换配件</Label>
                        <Input
                          placeholder="如有更换配件，请填写配件名称..."
                          className="border-white/10 bg-white/5 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">完成照片</Label>
                        <Button variant="outline" className="w-full border-white/10 bg-white/5">
                          <ImageIcon className="mr-2 h-4 w-4" />
                          上传照片
                        </Button>
                      </div>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        完成工单
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <Wrench className="mx-auto h-12 w-12 text-gray-600" />
              <p className="mt-4 text-gray-400">选择一个工单查看详情</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
