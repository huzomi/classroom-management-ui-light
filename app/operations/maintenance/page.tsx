"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 故障类型配置
const faultTypeConfig = {
  "equipment": { label: "设备故障", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  "network": { label: "网络故障", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  "circuit": { label: "电路故障", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  "other": { label: "其他故障", color: "bg-green-500/10 text-green-600 border-green-500/30" },
}

// 状态配置
const statusConfig = {
  "pending": { label: "未处理", color: "bg-red-500/10 text-red-600 border-red-500/30" },
  "delayed": { label: "延后处理", color: "bg-orange-500/10 text-orange-600 border-orange-500/30" },
  "resolved": { label: "已解决", color: "bg-green-500/10 text-green-600 border-green-500/30" },
  "no-action": { label: "不需要处理", color: "bg-gray-500/10 text-gray-600 border-gray-500/30" },
}

// 模拟工单数据
const tickets = [
  {
    id: "风扇问题",
    location: "教一楼 一楼 109",
    faultType: "equipment",
    description: "风扇问题",
    reporter: "admin",
    reportTime: "2026-03-03 11:18:11",
    status: "no-action",
  },
  {
    id: "1555",
    location: "教二楼 一楼 102",
    faultType: "equipment",
    description: "1255",
    reporter: "admin",
    reportTime: "2026-02-09 10:07:41",
    status: "resolved",
  },
  {
    id: "二楼224教室故障",
    location: "教二楼 一楼 102",
    faultType: "equipment",
    description: "电子屏设备出现了故障",
    reporter: "admin",
    reportTime: "2026-02-03 10:36:18",
    status: "delayed",
  },
  {
    id: "11",
    location: "教二楼 一楼 102",
    faultType: "circuit",
    description: "11",
    reporter: "admin",
    reportTime: "2026-02-03 10:33:46",
    status: "pending",
  },
  {
    id: "二楼214教室故障",
    location: "教二楼 一楼 102",
    faultType: "other",
    description: "教室前部照明灯损坏",
    reporter: "admin",
    reportTime: "2026-02-03 10:07:21",
    status: "resolved",
  },
]

export default function MaintenancePage() {
  const [selectedBuilding, setSelectedBuilding] = useState<string>("")
  const [selectedFloor, setSelectedFloor] = useState<string>("")
  const [selectedClassroom, setSelectedClassroom] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [selectedFaultType, setSelectedFaultType] = useState<string>("")

  const handleReset = () => {
    setSelectedBuilding("")
    setSelectedFloor("")
    setSelectedClassroom("")
    setSelectedStatus("")
    setSelectedFaultType("")
  }

  // 根据状态返回可用的操作
  const getActions = (status: string) => {
    switch (status) {
      case "pending":
        return ["详情", "接单", "撤销"]
      case "delayed":
        return ["详情", "处理"]
      case "resolved":
        return ["详情"]
      case "no-action":
        return ["详情"]
      default:
        return ["详情"]
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] p-6">
      {/* 筛选栏 */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-primary">位置</span>
          <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="选择楼栋" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="building1">教一楼</SelectItem>
              <SelectItem value="building2">教二楼</SelectItem>
              <SelectItem value="building3">教三楼</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedFloor} onValueChange={setSelectedFloor}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="选择楼层" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="floor1">一楼</SelectItem>
              <SelectItem value="floor2">二楼</SelectItem>
              <SelectItem value="floor3">三楼</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedClassroom} onValueChange={setSelectedClassroom}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="选择教室" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="101">101</SelectItem>
              <SelectItem value="102">102</SelectItem>
              <SelectItem value="109">109</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-primary">状态</span>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="故障状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">未处理</SelectItem>
              <SelectItem value="delayed">延后处理</SelectItem>
              <SelectItem value="resolved">已解决</SelectItem>
              <SelectItem value="no-action">不需要处理</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-primary">故障类型</span>
          <Select value={selectedFaultType} onValueChange={setSelectedFaultType}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equipment">设备故障</SelectItem>
              <SelectItem value="network">网络故障</SelectItem>
              <SelectItem value="circuit">电路故障</SelectItem>
              <SelectItem value="other">其他故障</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button>查询</Button>
        <Button variant="outline" onClick={handleReset}>重置</Button>

        <div className="ml-auto flex items-center gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            新增报修
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" />
            导出记录
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="flex-1 border border-border rounded-lg overflow-hidden">
        <div className="overflow-auto h-full">
          <table className="w-full">
            <thead className="bg-muted/30 sticky top-0">
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-primary">工单号</th>
                <th className="text-left p-4 text-sm font-medium text-primary">位置信息</th>
                <th className="text-left p-4 text-sm font-medium text-primary">故障类型</th>
                <th className="text-left p-4 text-sm font-medium text-primary">故障描述</th>
                <th className="text-left p-4 text-sm font-medium text-primary">报修人</th>
                <th className="text-left p-4 text-sm font-medium text-primary">报修时间</th>
                <th className="text-left p-4 text-sm font-medium text-primary">状态</th>
                <th className="text-left p-4 text-sm font-medium text-primary">操作</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, index) => {
                const faultType = faultTypeConfig[ticket.faultType as keyof typeof faultTypeConfig]
                const status = statusConfig[ticket.status as keyof typeof statusConfig]
                const actions = getActions(ticket.status)

                return (
                  <tr key={index} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="p-4 text-sm text-primary">{ticket.id}</td>
                    <td className="p-4 text-sm text-foreground">{ticket.location}</td>
                    <td className="p-4">
                      <Badge variant="outline" className={faultType.color}>
                        {faultType.label}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-foreground">{ticket.description}</td>
                    <td className="p-4 text-sm text-foreground">{ticket.reporter}</td>
                    <td className="p-4 text-sm text-foreground">{ticket.reportTime}</td>
                    <td className="p-4">
                      <Badge variant="outline" className={status.color}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            className="text-sm text-primary hover:underline"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-end gap-4 mt-4">
        <span className="text-sm text-muted-foreground">共{tickets.length}条</span>
        <div className="flex items-center gap-1">
          <Button variant="default" size="sm" className="h-8 w-8 p-0">
            1
          </Button>
        </div>
        <Select defaultValue="10">
          <SelectTrigger className="w-24 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10条/页</SelectItem>
            <SelectItem value="20">20条/页</SelectItem>
            <SelectItem value="50">50条/页</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
