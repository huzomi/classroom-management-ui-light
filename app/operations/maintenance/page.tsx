"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Plus, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

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

// 楼栋楼层教室联动数据
const buildingData = {
  "教一楼": {
    floors: {
      "一楼": ["101", "102", "103", "109"],
      "二楼": ["201", "202", "203"],
      "三楼": ["301", "302", "303"],
    }
  },
  "教二楼": {
    floors: {
      "一楼": ["101", "102", "103"],
      "二楼": ["201", "202", "203", "214", "224"],
    }
  },
  "教三楼": {
    floors: {
      "一楼": ["101", "102"],
      "二楼": ["201", "202"],
    }
  },
}

export default function MaintenancePage() {
  const [selectedBuilding, setSelectedBuilding] = useState<string>("")
  const [selectedFloor, setSelectedFloor] = useState<string>("")
  const [selectedClassroom, setSelectedClassroom] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [selectedFaultType, setSelectedFaultType] = useState<string>("")

  // 新增报修对话框状态
  const [dialogOpen, setDialogOpen] = useState(false)
  
  // 详情对话框状态
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<typeof tickets[0] | null>(null)

  // 接单对话框状态
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)
  const [acceptAction, setAcceptAction] = useState<"accept" | "delay" | "no-action">("accept")
  const [acceptNote, setAcceptNote] = useState("")

  // 延后处理对话框状态
  const [processDialogOpen, setProcessDialogOpen] = useState(false)
  const [processNote, setProcessNote] = useState("")
  const [formBuilding, setFormBuilding] = useState<string>("")
  const [formFloor, setFormFloor] = useState<string>("")
  const [formClassroom, setFormClassroom] = useState<string>("")
  const [formTitle, setFormTitle] = useState("")
  const [formFaultType, setFormFaultType] = useState<string>("")
  const [formDescription, setFormDescription] = useState("")

  // 获取可选楼层列表
  const getAvailableFloors = () => {
    if (!formBuilding) return []
    return Object.keys(buildingData[formBuilding as keyof typeof buildingData]?.floors || {})
  }

  // 获取可选教室列表
  const getAvailableClassrooms = () => {
    if (!formBuilding || !formFloor) return []
    return buildingData[formBuilding as keyof typeof buildingData]?.floors[formFloor as keyof typeof buildingData["教一楼"]["floors"]] || []
  }

  // 重置表单
  const resetForm = () => {
    setFormTitle("")
    setFormBuilding("")
    setFormFloor("")
    setFormClassroom("")
    setFormFaultType("")
    setFormDescription("")
  }

  // 楼栋变更时清空楼层和教室
  const handleBuildingChange = (value: string) => {
    setFormBuilding(value)
    setFormFloor("")
    setFormClassroom("")
  }

  // 楼层变更时清空教室
  const handleFloorChange = (value: string) => {
    setFormFloor(value)
    setFormClassroom("")
  }

  // 打开详情对话框
  const handleOpenDetail = (ticket: typeof tickets[0]) => {
    setSelectedTicket(ticket)
    setDetailDialogOpen(true)
  }

  // 打开接单对话框
  const handleOpenAccept = (ticket: typeof tickets[0]) => {
    setSelectedTicket(ticket)
    setAcceptAction("accept")
    setAcceptNote("")
    setAcceptDialogOpen(true)
  }

  // 打开延后处理对话框
  const handleOpenProcess = (ticket: typeof tickets[0]) => {
    setSelectedTicket(ticket)
    setProcessNote("")
    setProcessDialogOpen(true)
  }

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
          <Button onClick={() => setDialogOpen(true)}>
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
                            onClick={() => {
                              if (action === "详情") {
                                handleOpenDetail(ticket)
                              } else if (action === "接单") {
                                handleOpenAccept(ticket)
                              } else if (action === "处理") {
                                handleOpenProcess(ticket)
                              }
                            }}
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

      {/* 延后处理对话框 */}
      <Dialog open={processDialogOpen} onOpenChange={setProcessDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>工单详情与处理</DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-6 py-4">
              {/* 报修信息 */}
              <div>
                <h4 className="font-medium text-foreground mb-4">报修信息</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-16">工单号</span>
                      <span className="text-foreground">{selectedTicket.id}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-16">当前状态</span>
                      <Badge 
                        variant="outline" 
                        className={statusConfig[selectedTicket.status as keyof typeof statusConfig].color}
                      >
                        {statusConfig[selectedTicket.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-16">报修位置</span>
                      <span className="text-foreground">{selectedTicket.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-16">故障类型</span>
                      <span className="text-foreground">
                        {faultTypeConfig[selectedTicket.faultType as keyof typeof faultTypeConfig].label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground w-16">报修人</span>
                    <span className="text-foreground">{selectedTicket.reporter}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground w-16">报修时间</span>
                    <span className="text-foreground">{selectedTicket.reportTime}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground w-16">故障描述</span>
                    <span className="text-foreground">{selectedTicket.description}</span>
                  </div>
                </div>
              </div>

              {/* 处理进度 - 延后处理有两条记录 */}
              <div>
                <h4 className="font-medium text-foreground mb-4">处理进度</h4>
                <div className="relative pl-6">
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border"></div>
                  {/* 第一条记录 - 用户报修 */}
                  <div className="relative pb-4">
                    <div className="absolute left-[-20px] top-1 h-3.5 w-3.5 rounded-full bg-primary border-2 border-background"></div>
                    <div className="ml-2">
                      <p className="text-sm text-primary font-medium">{selectedTicket.reportTime}</p>
                      <p className="text-sm text-foreground mt-1">用户报修</p>
                      <p className="text-sm text-muted-foreground">{selectedTicket.reporter}提交了故障报修</p>
                    </div>
                  </div>
                  {/* 第二条记录 - 延后处理 */}
                  <div className="relative pb-4">
                    <div className="absolute left-[-20px] top-1 h-3.5 w-3.5 rounded-full bg-orange-500 border-2 border-background"></div>
                    <div className="ml-2">
                      <p className="text-sm text-orange-500 font-medium">2026-03-03 11:16:54</p>
                      <p className="text-sm text-foreground mt-1">待处理</p>
                      <p className="text-sm text-muted-foreground">{selectedTicket.reporter}提交工单[延后处理]:48484</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 处理反馈 - 只有处理完成选项 */}
              <div>
                <h4 className="font-medium text-foreground mb-4">处理反馈</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-16">处理动作</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="processAction"
                          checked={true}
                          readOnly
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm">处理完成</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground w-16 pt-2">处理备注</span>
                    <Textarea
                      placeholder="填写处理情况说明..."
                      className="flex-1 min-h-[100px]"
                      value={processNote}
                      onChange={(e) => setProcessNote(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 底部按钮 */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setProcessDialogOpen(false)}>
              关闭
            </Button>
            <Button onClick={() => {
              // 提交处理逻辑
              setProcessDialogOpen(false)
            }}>
              提交处理
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 接单对话框 */}
      <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>工单详情与处理</DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-6 py-4">
              {/* 报修信息 */}
              <div>
                <h4 className="font-medium text-foreground mb-4">报修信息</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-16">工单号</span>
                      <span className="text-foreground">{selectedTicket.id}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-16">当前状态</span>
                      <Badge 
                        variant="outline" 
                        className={statusConfig[selectedTicket.status as keyof typeof statusConfig].color}
                      >
                        {statusConfig[selectedTicket.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-16">报修位置</span>
                      <span className="text-foreground">{selectedTicket.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-16">故障类型</span>
                      <span className="text-foreground">
                        {faultTypeConfig[selectedTicket.faultType as keyof typeof faultTypeConfig].label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground w-16">报修人</span>
                    <span className="text-foreground">{selectedTicket.reporter}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground w-16">报修时间</span>
                    <span className="text-foreground">{selectedTicket.reportTime}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground w-16">故障描述</span>
                    <span className="text-foreground">{selectedTicket.description}</span>
                  </div>
                </div>
              </div>

              {/* 处理进度 */}
              <div>
                <h4 className="font-medium text-foreground mb-4">处理进度</h4>
                <div className="relative pl-6">
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border"></div>
                  <div className="relative pb-4">
                    <div className="absolute left-[-20px] top-1 h-3.5 w-3.5 rounded-full bg-primary border-2 border-background"></div>
                    <div className="ml-2">
                      <p className="text-sm text-primary font-medium">{selectedTicket.reportTime}</p>
                      <p className="text-sm text-foreground mt-1">用户报修</p>
                      <p className="text-sm text-muted-foreground">{selectedTicket.reporter}提交了故障报修</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 处理反馈 */}
              <div>
                <h4 className="font-medium text-foreground mb-4">处理反馈</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-16">处理动作</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="acceptAction"
                          checked={acceptAction === "accept"}
                          onChange={() => setAcceptAction("accept")}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm">接单处理</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="acceptAction"
                          checked={acceptAction === "delay"}
                          onChange={() => setAcceptAction("delay")}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm">延迟处理</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="acceptAction"
                          checked={acceptAction === "no-action"}
                          onChange={() => setAcceptAction("no-action")}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm">不需要处理</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground w-16 pt-2">处理备注</span>
                    <Textarea
                      placeholder="填写处理情况说明..."
                      className="flex-1 min-h-[100px]"
                      value={acceptNote}
                      onChange={(e) => setAcceptNote(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 底部按钮 */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setAcceptDialogOpen(false)}>
              关闭
            </Button>
            <Button onClick={() => {
              // 提交处理逻辑
              setAcceptDialogOpen(false)
            }}>
              提交处理
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 详情对话框 - 未处理状态 */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>工单详情与处理</DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-6 py-4">
              {/* 报修信息 */}
              <div>
                <h4 className="font-medium text-foreground mb-4">报修信息</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-16">工单号</span>
                      <span className="text-foreground">{selectedTicket.id}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-16">当前状态</span>
                      <Badge 
                        variant="outline" 
                        className={statusConfig[selectedTicket.status as keyof typeof statusConfig].color}
                      >
                        {statusConfig[selectedTicket.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-16">报修位置</span>
                      <span className="text-foreground">{selectedTicket.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground w-16">故障类型</span>
                      <span className="text-foreground">
                        {faultTypeConfig[selectedTicket.faultType as keyof typeof faultTypeConfig].label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground w-16">报修人</span>
                    <span className="text-foreground">{selectedTicket.reporter}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground w-16">报修时间</span>
                    <span className="text-foreground">{selectedTicket.reportTime}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground w-16">故障描述</span>
                    <span className="text-foreground">{selectedTicket.description}</span>
                  </div>
                </div>
              </div>

{/* 处理进度 */}
              <div>
                <h4 className="font-medium text-foreground mb-4">处理进度</h4>
                <div className="relative pl-6">
                  {/* 时间线 */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border"></div>
                  
                  {/* 报修记录 */}
                  <div className="relative pb-4">
                    <div className="absolute left-[-20px] top-1 h-3.5 w-3.5 rounded-full bg-primary border-2 border-background"></div>
                    <div className="ml-2">
                      <p className="text-sm text-primary font-medium">{selectedTicket.reportTime}</p>
                      <p className="text-sm text-foreground mt-1">用户报修</p>
                      <p className="text-sm text-muted-foreground">{selectedTicket.reporter}提交了故障报修</p>
                    </div>
                  </div>

                  {/* 已解决或不需要处理状态 - 显示处理完成记录 */}
                  {(selectedTicket.status === "resolved" || selectedTicket.status === "no-action") && (
                    <div className="relative pb-4">
                      <div className="absolute left-[-20px] top-1 h-3.5 w-3.5 rounded-full bg-orange-500 border-2 border-background"></div>
                      <div className="ml-2">
                        <p className="text-sm text-orange-500 font-medium">2026-03-03 11:16:13</p>
                        <p className="text-sm text-foreground mt-1">处理完成</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedTicket.reporter}提交工单：
                          {selectedTicket.status === "resolved" ? "已解决123456" : "不需要处理"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 底部按钮 */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              关闭
            </Button>
          </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 底部按��� */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              关闭
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 新增报修对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>新增报修</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* 工单标题 */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label className="text-right">
                <span className="text-red-500 mr-1">*</span>
                工单标题:
              </Label>
              <Input
                placeholder="请��入工单标题"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            {/* 选择楼栋 */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label className="text-right">
                <span className="text-red-500 mr-1">*</span>
                选择楼栋:
              </Label>
              <Select value={formBuilding} onValueChange={handleBuildingChange}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择楼栋" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(buildingData).map((building) => (
                    <SelectItem key={building} value={building}>
                      {building}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 选择楼层 */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label className="text-right">
                <span className="text-red-500 mr-1">*</span>
                选择楼层:
              </Label>
              <Select 
                value={formFloor} 
                onValueChange={handleFloorChange}
                disabled={!formBuilding}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formBuilding ? "请选择楼层" : "请先选择楼栋"} />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableFloors().map((floor) => (
                    <SelectItem key={floor} value={floor}>
                      {floor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 选择教室 */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label className="text-right">
                <span className="text-red-500 mr-1">*</span>
                选择教室:
              </Label>
              <Select 
                value={formClassroom} 
                onValueChange={setFormClassroom}
                disabled={!formFloor}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formFloor ? "请选择教室" : "请先选择楼层"} />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableClassrooms().map((classroom) => (
                    <SelectItem key={classroom} value={classroom}>
                      {classroom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 故障类型 */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-4">
              <Label className="text-right">
                <span className="text-red-500 mr-1">*</span>
                故障类型:
              </Label>
              <Select value={formFaultType} onValueChange={setFormFaultType}>
                <SelectTrigger>
                  <SelectValue placeholder="选择故障类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipment">设备故障</SelectItem>
                  <SelectItem value="network">网络故障</SelectItem>
                  <SelectItem value="circuit">电路故障</SelectItem>
                  <SelectItem value="other">其他故障</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 故障描述 */}
            <div className="grid grid-cols-[100px_1fr] items-start gap-4">
              <Label className="text-right pt-2">
                <span className="text-red-500 mr-1">*</span>
                故障描述:
              </Label>
              <Textarea
                placeholder="请描述故障情况"
                className="min-h-[100px]"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                resetForm()
                setDialogOpen(false)
              }}
            >
              取消
            </Button>
            <Button onClick={() => {
              // 这里可以添加表单验证和提交逻辑
              resetForm()
              setDialogOpen(false)
            }}>
              确定
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
