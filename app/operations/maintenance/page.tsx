"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MaintenancePage() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>("T2024001")

  const tickets = [
    {
      id: "T2024001",
      classroom: "101教室",
      building: "第一教学楼",
      floor: "1层",
      equipment: "投影仪",
      issue: "投影仪无法开机",
      status: "pending",
      priority: "high",
      reporter: "张老师",
      reportTime: "2024-01-15 09:30",
      assignee: "李工",
    },
    {
      id: "T2024002",
      classroom: "203教室",
      building: "第二教学楼",
      floor: "2层",
      equipment: "空调",
      issue: "空调制冷效果差",
      status: "in-progress",
      priority: "medium",
      reporter: "王老师",
      reportTime: "2024-01-15 10:15",
      assignee: "赵工",
    },
    {
      id: "T2024003",
      classroom: "305教室",
      building: "第三教学楼",
      floor: "3层",
      equipment: "电脑",
      issue: "电脑无法启动",
      status: "resolved",
      priority: "high",
      reporter: "刘老师",
      reportTime: "2024-01-14 14:20",
      assignee: "孙工",
      resolveTime: "2024-01-14 16:30",
    },
  ]

  const statusConfig = {
    pending: { label: "待处理", color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
    "in-progress": { label: "处理中", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    resolved: { label: "已解决", color: "bg-green-500/10 text-green-500 border-green-500/20" },
    closed: { label: "已关闭", color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
  }

  const priorityConfig = {
    high: { label: "高", color: "bg-red-500/10 text-red-500 border-red-500/20" },
    medium: { label: "中", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
    low: { label: "低", color: "bg-green-500/10 text-green-500 border-green-500/20" },
  }

  const selectedTicketData = tickets.find((t) => t.id === selectedTicket)

  return (
    <div className="flex h-[calc(100vh-3.5rem)] gap-4 p-6">
      <div className="flex w-96 flex-col gap-4 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">故障工单</h2>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            新建工单
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="搜索工单..." className="pl-9" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="pending">待处理</SelectItem>
              <SelectItem value="in-progress">处理中</SelectItem>
              <SelectItem value="resolved">已解决</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部优先级</SelectItem>
              <SelectItem value="high">高优先级</SelectItem>
              <SelectItem value="medium">中优先级</SelectItem>
              <SelectItem value="low">低优先级</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto">
          {tickets.map((ticket) => {
            const status = statusConfig[ticket.status as keyof typeof statusConfig]
            const priority = priorityConfig[ticket.priority as keyof typeof priorityConfig]

            return (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket.id)}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  selectedTicket === ticket.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-accent/50"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-foreground">{ticket.id}</span>
                  <Badge variant="outline" className={priority.color}>
                    {priority.label}
                  </Badge>
                </div>

                <div className="mb-2 text-sm text-foreground">{ticket.issue}</div>

                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{ticket.classroom}</span>
                  <span>•</span>
                  <span>{ticket.equipment}</span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={status.color}>
                    {status.label}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{ticket.reportTime.split(" ")[0]}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 rounded-lg border border-border bg-card">
        {selectedTicketData ? (
          <div className="flex h-full flex-col">
            <div className="border-b border-border p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <h1 className="text-2xl font-semibold">{selectedTicketData.id}</h1>
                    <Badge
                      variant="outline"
                      className={statusConfig[selectedTicketData.status as keyof typeof statusConfig].color}
                    >
                      {statusConfig[selectedTicketData.status as keyof typeof statusConfig].label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={priorityConfig[selectedTicketData.priority as keyof typeof priorityConfig].color}
                    >
                      {priorityConfig[selectedTicketData.priority as keyof typeof priorityConfig].label}
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground">{selectedTicketData.issue}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">转派</Button>
                  <Button>处理工单</Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 grid grid-cols-2 gap-6">
                <div>
                  <h3 className="mb-4 font-semibold">工单信息</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-muted-foreground">教室位置</dt>
                      <dd className="text-sm font-medium">
                        {selectedTicketData.building} - {selectedTicketData.floor} - {selectedTicketData.classroom}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">故障设备</dt>
                      <dd className="text-sm font-medium">{selectedTicketData.equipment}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">报修人</dt>
                      <dd className="text-sm font-medium">{selectedTicketData.reporter}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">报修时间</dt>
                      <dd className="text-sm font-medium">{selectedTicketData.reportTime}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="mb-4 font-semibold">处理信息</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-muted-foreground">处理人</dt>
                      <dd className="text-sm font-medium">{selectedTicketData.assignee || "未分配"}</dd>
                    </div>
                    {selectedTicketData.resolveTime && (
                      <div>
                        <dt className="text-sm text-muted-foreground">解决时间</dt>
                        <dd className="text-sm font-medium">{selectedTicketData.resolveTime}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              <div>
                <h3 className="mb-4 font-semibold">处理记录</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 rounded-lg border border-border bg-accent/50 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-medium">张老师</span>
                        <span className="text-sm text-muted-foreground">创建工单</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedTicketData.reportTime}</p>
                    </div>
                  </div>

                  {selectedTicketData.status === "in-progress" && (
                    <div className="flex gap-4 rounded-lg border border-border bg-accent/50 p-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                        <Clock className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-medium">{selectedTicketData.assignee}</span>
                          <span className="text-sm text-muted-foreground">开始处理</span>
                        </div>
                        <p className="text-sm text-muted-foreground">2024-01-15 10:30</p>
                      </div>
                    </div>
                  )}

                  {selectedTicketData.status === "resolved" && (
                    <div className="flex gap-4 rounded-lg border border-border bg-accent/50 p-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-medium">{selectedTicketData.assignee}</span>
                          <span className="text-sm text-muted-foreground">已解决</span>
                        </div>
                        <p className="mb-2 text-sm">已更换新投影仪，测试正常</p>
                        <p className="text-sm text-muted-foreground">{selectedTicketData.resolveTime}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">选择一个工单查看详情</div>
        )}
      </div>
    </div>
  )
}
