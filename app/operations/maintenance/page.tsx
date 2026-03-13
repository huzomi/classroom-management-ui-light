"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Plus, Search, RefreshCw, Wrench, Settings, ChevronUp, ChevronDown, Info, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getWorkOrderPage, addWorkOrder, getWorkOrderProgress, delWorkOrder, submitWorkOrderProgress, type WorkOrderPageVO } from "@/lib/api/work-order"
import { getBuildingList, getFloorList, getRoomList } from "@/lib/api/building"

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

// 状态/故障类型字符串 -> 前端 key 映射（用于 Badge 样式）
const statusKeyMap: Record<string, string> = {
  未处理: "pending",
  延后处理: "delayed",
  已解决: "resolved",
  不需要处理: "no-action",
}
const faultTypeKeyMap: Record<string, string> = {
  设备故障: "equipment",
  网络故障: "network",
  电路故障: "circuit",
  其他故障: "other",
}
// 前端 key -> API 请求参数
const statusToApi: Record<string, number> = {
  pending: 1,
  delayed: 2,
  resolved: 3,
  "no-action": 4,
}
// 提交处理 status: 0-未处理；1-延后处理；2-已解决；3-不需要处理
const acceptActionToStatus: Record<string, number> = {
  accept: 2,
  delay: 1,
  "no-action": 3,
}
const faultTypeToApi: Record<string, number> = {
  equipment: 1,
  network: 2,
  circuit: 3,
  other: 4,
}

type TicketDisplay = {
  id: string
  title: string
  location: string
  faultType: string
  description: string
  reporter: string
  reportTime: string
  status: string
}

export default function MaintenancePage() {
  const [selectedBuilding, setSelectedBuilding] = useState<string>("")
  const [selectedFloor, setSelectedFloor] = useState<string>("")
  const [selectedClassroom, setSelectedClassroom] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [selectedFaultType, setSelectedFaultType] = useState<string>("")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [tickets, setTickets] = useState<TicketDisplay[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // 新增报修对话框状态
  const [dialogOpen, setDialogOpen] = useState(false)
  
  // 详情对话框状态
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<TicketDisplay | null>(null)
  const [progressList, setProgressList] = useState<{ createTime: string; title: string; content: string }[]>([])
  const [progressLoading, setProgressLoading] = useState(false)

  // 接单对话框状态
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)

  const fetchTickets = (pageOverride?: number) => {
    setLoading(true)
    const p = pageOverride ?? page
    getWorkOrderPage({
      page: p,
      pageSize,
      status: selectedStatus ? statusToApi[selectedStatus] : undefined,
      faultType: selectedFaultType ? faultTypeToApi[selectedFaultType] : undefined,
    })
      .then((res) => {
        const list: TicketDisplay[] = (res?.records ?? []).map((r: WorkOrderPageVO) => ({
          id: r.id,
          title: r.title,
          location: r.address,
          faultType: faultTypeKeyMap[r.faultType] ?? r.faultType,
          description: r.description,
          reporter: r.createUser,
          reportTime: r.createTime?.slice(0, 19) ?? "",
          status: statusKeyMap[r.status] ?? r.status,
        }))
        setTickets(list)
        setTotal(res?.total ?? 0)
      })
      .catch((err) => {
        console.error("加载工单失败:", err)
        setTickets([])
        setTotal(0)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTickets()
  }, [page, pageSize, selectedStatus, selectedFaultType])
  const [acceptAction, setAcceptAction] = useState<"accept" | "delay" | "no-action">("accept")
  const [acceptNote, setAcceptNote] = useState("")
  const [submitLoading, setSubmitLoading] = useState(false)

  // 延后处理对话框状态
  const [processDialogOpen, setProcessDialogOpen] = useState(false)
  const [processNote, setProcessNote] = useState("")
  const [formBuilding, setFormBuilding] = useState<string>("")
  const [formFloor, setFormFloor] = useState<string>("")
  const [formClassroom, setFormClassroom] = useState<string>("")
  const [formTitle, setFormTitle] = useState("")
  const [formFaultType, setFormFaultType] = useState<string>("")
  const [formDescription, setFormDescription] = useState("")
  const [buildingList, setBuildingList] = useState<{ id: string; name: string }[]>([])
  const [floorList, setFloorList] = useState<{ id: string; name: string }[]>([])
  const [roomList, setRoomList] = useState<{ id: string; name: string }[]>([])
  const [formLoading, setFormLoading] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)

  // 对话框打开时加载楼栋列表
  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (open) {
      setFormLoading(true)
      getBuildingList()
        .then((list) => setBuildingList(list ?? []))
        .catch((err) => {
          console.error("加载楼栋失败:", err)
          setBuildingList([])
        })
        .finally(() => setFormLoading(false))
      setFormBuilding("")
      setFormFloor("")
      setFormClassroom("")
      setFloorList([])
      setRoomList([])
    } else {
      resetForm()
    }
  }

  // 楼栋变更：加载楼层
  const handleBuildingChange = (buildingId: string) => {
    setFormBuilding(buildingId)
    setFormFloor("")
    setFormClassroom("")
    setRoomList([])
    if (!buildingId) {
      setFloorList([])
      return
    }
    setFormLoading(true)
    getFloorList(buildingId)
      .then((list) => setFloorList(list ?? []))
      .catch((err) => {
        console.error("加载楼层失败:", err)
        setFloorList([])
      })
      .finally(() => setFormLoading(false))
  }

  // 楼层变更：加载教室
  const handleFloorChange = (floorId: string) => {
    setFormFloor(floorId)
    setFormClassroom("")
    if (!floorId || !formBuilding) {
      setRoomList([])
      return
    }
    setFormLoading(true)
    getRoomList(formBuilding, floorId)
      .then((list) => setRoomList(list ?? []))
      .catch((err) => {
        console.error("加载教室失败:", err)
        setRoomList([])
      })
      .finally(() => setFormLoading(false))
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

  // 打开详情对话框
  const handleOpenDetail = (ticket: TicketDisplay) => {
    setSelectedTicket(ticket)
    setDetailDialogOpen(true)
  }

  // 详情/接单/延后处理对话框打开时加载处理进度
  useEffect(() => {
    if ((detailDialogOpen || acceptDialogOpen || processDialogOpen) && selectedTicket?.id) {
      setProgressLoading(true)
      getWorkOrderProgress(selectedTicket.id)
        .then((list) => setProgressList(list ?? []))
        .catch((err) => {
          console.error("加载处理进度失败:", err)
          setProgressList([])
        })
        .finally(() => setProgressLoading(false))
    } else {
      setProgressList([])
    }
  }, [detailDialogOpen, acceptDialogOpen, processDialogOpen, selectedTicket?.id])

  // 打开接单对话框
  const handleOpenAccept = (ticket: TicketDisplay) => {
    setSelectedTicket(ticket)
    setAcceptAction("accept")
    setAcceptNote("")
    setAcceptDialogOpen(true)
  }

  // 打开延后处理对话框
  const handleOpenProcess = (ticket: TicketDisplay) => {
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
    setPage(1)
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedRows(tickets.map((t) => t.id))
    else setSelectedRows([])
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) setSelectedRows([...selectedRows, id])
    else setSelectedRows(selectedRows.filter((rid) => rid !== id))
  }

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {/* 筛选栏 */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">楼栋:</span>
            <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="请选择楼栋" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="building1">教一楼</SelectItem>
                <SelectItem value="building2">教二楼</SelectItem>
                <SelectItem value="building3">教三楼</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">楼层:</span>
            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="请选择楼层" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="floor1">一楼</SelectItem>
                <SelectItem value="floor2">二楼</SelectItem>
                <SelectItem value="floor3">三楼</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">教室:</span>
            <Select value={selectedClassroom} onValueChange={setSelectedClassroom}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="请选择教室" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="101">101</SelectItem>
                <SelectItem value="102">102</SelectItem>
                <SelectItem value="109">109</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">状态:</span>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="请选择状态" />
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
            <span className="text-sm text-muted-foreground whitespace-nowrap">故障类型:</span>
            <Select value={selectedFaultType} onValueChange={setSelectedFaultType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="请选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equipment">设备故障</SelectItem>
                <SelectItem value="network">网络故障</SelectItem>
                <SelectItem value="circuit">电路故障</SelectItem>
                <SelectItem value="other">其他故障</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => {
              setPage(1)
              fetchTickets(1)
            }}
          >
            <Search className="h-4 w-4 mr-1" />
            查询
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-1" />
            重置
          </Button>
        </div>

        {/* 工具栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={() => handleDialogOpenChange(true)}>
              <Plus className="h-4 w-4 mr-1" />
              新增
            </Button>
            {selectedRows.length > 0 && (
              <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-1" />
                批量删除
              </Button>
            )}
            <Button variant="outline">
              <Download className="h-4 w-4 mr-1" />
              导出
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Wrench className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 选中提示 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded">
          <Info className="h-4 w-4" />
          <span>{selectedRows.length > 0 ? `已选中 ${selectedRows.length} 条数据` : "未选中任何数据"}</span>
        </div>

        {/* 表格 */}
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-3 text-center w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === tickets.length && tickets.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4"
                  />
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    工单号
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">位置信息</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">故障类型</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">故障描述</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">报修人</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    报修时间
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">状态</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-sm text-muted-foreground">
                    加载中...
                  </td>
                </tr>
              ) : (
                tickets.map((ticket, index) => {
                const faultType = faultTypeConfig[ticket.faultType as keyof typeof faultTypeConfig] ?? {
                  label: ticket.faultType,
                  color: "bg-muted text-muted-foreground border-border",
                }
                const status = statusConfig[ticket.status as keyof typeof statusConfig] ?? {
                  label: ticket.status,
                  color: "bg-muted text-muted-foreground border-border",
                }
                const actions = getActions(ticket.status)

                return (
                  <tr key={index} className="border-b border-border hover:bg-muted/20">
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(ticket.id)}
                        onChange={(e) => handleSelectRow(ticket.id, e.target.checked)}
                        className="h-4 w-4"
                      />
                    </td>
                    <td className="p-3 text-center text-sm text-primary">{ticket.title || ticket.id}</td>
                    <td className="p-3 text-center text-sm text-foreground">{ticket.location}</td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className={faultType.color}>
                        {faultType.label}
                      </Badge>
                    </td>
                    <td className="p-3 text-center text-sm text-foreground">{ticket.description}</td>
                    <td className="p-3 text-center text-sm text-foreground">{ticket.reporter}</td>
                    <td className="p-3 text-center text-sm text-foreground">{ticket.reportTime}</td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className={status.color}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
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
                              } else if (action === "撤销") {
                                if (confirm(`确定要撤销工单「${ticket.title}」吗？`)) {
                                  delWorkOrder(ticket.id)
                                    .then(() => fetchTickets(1))
                                    .catch((err) => console.error("撤销失败:", err))
                                }
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
              })
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-end gap-4">
          <span className="text-sm text-muted-foreground">共 {total} 条数据</span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              上一页
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              第 {page} / {Math.ceil(total / pageSize) || 1} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              disabled={page >= Math.ceil(total / pageSize)}
              onClick={() => setPage((p) => p + 1)}
            >
              下一页
            </Button>
          </div>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v))
              setPage(1)
            }}
          >
            <SelectTrigger className="w-24 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 条/页</SelectItem>
              <SelectItem value="20">20 条/页</SelectItem>
              <SelectItem value="50">50 条/页</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 延后处理对话框 */}
      <Dialog open={processDialogOpen} onOpenChange={setProcessDialogOpen}>
<DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>工单详情与处理</DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-8 py-6">
              {/* 报修信息 */}
              <div>
                <h4 className="font-medium text-foreground mb-4">报修信息</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">工单号</span>
                    <span className="text-foreground text-sm break-words">{selectedTicket.id}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">当前状态</span>
                    <Badge
                      variant="outline"
                      className={statusConfig[selectedTicket.status as keyof typeof statusConfig].color}
                    >
                      {statusConfig[selectedTicket.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">报修位置</span>
                    <span className="text-foreground text-sm break-words">{selectedTicket.location}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">故障类型</span>
                    <span className="text-foreground text-sm">
                      {faultTypeConfig[selectedTicket.faultType as keyof typeof faultTypeConfig]?.label ?? selectedTicket.faultType}
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">报修人</span>
                    <span className="text-foreground text-sm">{selectedTicket.reporter}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">报修时间</span>
                    <span className="text-foreground text-sm">{selectedTicket.reportTime}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-start">
                    <span className="text-muted-foreground text-sm pt-0.5">故障描述</span>
                    <span className="text-foreground text-sm break-words leading-relaxed">{selectedTicket.description || "-"}</span>
                  </div>
                </div>
              </div>

              {/* 处理进度 */}
              <div>
                <h4 className="font-medium text-foreground mb-4">处理进度</h4>
                {progressLoading ? (
                  <p className="text-sm text-muted-foreground py-4">加载中...</p>
                ) : progressList.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">暂无处理记录</p>
                ) : (
                  <div className="relative pl-6 space-y-6">
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border"></div>
                    {progressList.map((item, idx) => (
                      <div key={idx} className="relative pb-2">
                        <div
                          className={`absolute left-[-20px] top-1 h-3.5 w-3.5 rounded-full border-2 border-background ${
                            idx === 0 ? "bg-primary" : "bg-orange-500"
                          }`}
                        />
                        <div className="ml-4 space-y-1">
                          <p
                            className={`text-sm font-medium ${
                              idx === 0 ? "text-primary" : "text-orange-500"
                            }`}
                          >
                            {item.createTime?.slice(0, 19)}
                          </p>
                          <p className="text-sm text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 处理反馈 - 只有处理完成选项 */}
              <div>
                <h4 className="font-medium text-foreground mb-4">处理反馈</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 items-center">
                    <span className="text-muted-foreground text-sm">处理动作</span>
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
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 items-start">
                    <span className="text-muted-foreground text-sm pt-2">处理备注</span>
                    <Textarea
                      placeholder="填写处理情况说明..."
                      className="min-h-[100px]"
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
            <Button
              disabled={submitLoading || !selectedTicket}
              onClick={async () => {
                if (!selectedTicket) return
                setSubmitLoading(true)
                try {
                  await submitWorkOrderProgress({
                    workId: selectedTicket.id,
                    status: 2,
                    handleDetail: processNote || undefined,
                  })
                  setProcessDialogOpen(false)
                  fetchTickets(1)
                } catch (err) {
                  console.error("提交处理失败:", err)
                } finally {
                  setSubmitLoading(false)
                }
              }}
            >
              {submitLoading ? "提交中..." : "提交处理"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 接单对话框 */}
      <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>工单详情与处理</DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-8 py-6">
              {/* 报修信息 */}
              <div>
                <h4 className="font-medium text-foreground mb-4">报修信息</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">工单号</span>
                    <span className="text-foreground text-sm break-words">{selectedTicket.id}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">当前状态</span>
                    <Badge 
                      variant="outline" 
                      className={statusConfig[selectedTicket.status as keyof typeof statusConfig].color}
                    >
                      {statusConfig[selectedTicket.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">报修位置</span>
                    <span className="text-foreground text-sm break-words">{selectedTicket.location}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">故障类型</span>
                    <span className="text-foreground text-sm">
                      {faultTypeConfig[selectedTicket.faultType as keyof typeof faultTypeConfig]?.label ?? selectedTicket.faultType}
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">报修人</span>
                    <span className="text-foreground text-sm">{selectedTicket.reporter}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">报修时间</span>
                    <span className="text-foreground text-sm">{selectedTicket.reportTime}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-start">
                    <span className="text-muted-foreground text-sm pt-0.5">故障描述</span>
                    <span className="text-foreground text-sm break-words leading-relaxed">{selectedTicket.description || "-"}</span>
                  </div>
                </div>
              </div>

              {/* 处理进度 */}
              <div>
                <h4 className="font-medium text-foreground mb-4">处理进度</h4>
                {progressLoading ? (
                  <p className="text-sm text-muted-foreground py-4">加载中...</p>
                ) : progressList.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">暂无处理记录</p>
                ) : (
                  <div className="relative pl-6 space-y-6">
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border"></div>
                    {progressList.map((item, idx) => (
                      <div key={idx} className="relative pb-2">
                        <div
                          className={`absolute left-[-20px] top-1 h-3.5 w-3.5 rounded-full border-2 border-background ${
                            idx === 0 ? "bg-primary" : "bg-orange-500"
                          }`}
                        />
                        <div className="ml-4 space-y-1">
                          <p
                            className={`text-sm font-medium ${
                              idx === 0 ? "text-primary" : "text-orange-500"
                            }`}
                          >
                            {item.createTime?.slice(0, 19)}
                          </p>
                          <p className="text-sm text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 处理反馈 */}
              <div>
                <h4 className="font-medium text-foreground mb-4">处理反馈</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 items-center">
                    <span className="text-muted-foreground text-sm">处理动作</span>
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
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 items-start">
                    <span className="text-muted-foreground text-sm pt-2">处理备注</span>
                    <Textarea
                      placeholder="填写处理情况说明..."
                      className="min-h-[100px]"
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
            <Button
              disabled={submitLoading || !selectedTicket}
              onClick={async () => {
                if (!selectedTicket) return
                setSubmitLoading(true)
                try {
                  await submitWorkOrderProgress({
                    workId: selectedTicket.id,
                    status: acceptActionToStatus[acceptAction] ?? 2,
                    handleDetail: acceptNote || undefined,
                  })
                  setAcceptDialogOpen(false)
                  fetchTickets(1)
                } catch (err) {
                  console.error("提交处理失败:", err)
                } finally {
                  setSubmitLoading(false)
                }
              }}
            >
              {submitLoading ? "提交中..." : "提交处理"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 详情对话框 - 未处理状态 */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>工单详情与处理</DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-8 py-6">
              {/* 报修信息 */}
              <div>
                <h4 className="font-medium text-foreground mb-4">报修信息</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">工单号</span>
                    <span className="text-foreground text-sm break-words">{selectedTicket.id}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">当前状态</span>
                    <Badge 
                      variant="outline" 
                      className={statusConfig[selectedTicket.status as keyof typeof statusConfig].color}
                    >
                      {statusConfig[selectedTicket.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">报修位置</span>
                    <span className="text-foreground text-sm break-words">{selectedTicket.location}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">故障类型</span>
                    <span className="text-foreground text-sm">
                      {faultTypeConfig[selectedTicket.faultType as keyof typeof faultTypeConfig]?.label ?? selectedTicket.faultType}
                    </span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">报修人</span>
                    <span className="text-foreground text-sm">{selectedTicket.reporter}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-center">
                    <span className="text-muted-foreground text-sm">报修时间</span>
                    <span className="text-foreground text-sm">{selectedTicket.reportTime}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-x-6 gap-y-1 items-start">
                    <span className="text-muted-foreground text-sm pt-0.5">故障描述</span>
                    <span className="text-foreground text-sm break-words leading-relaxed">{selectedTicket.description || "-"}</span>
                  </div>
                </div>
              </div>

              {/* 处理进度 */}
              <div>
                <h4 className="font-medium text-foreground mb-4">处理进度</h4>
                {progressLoading ? (
                  <p className="text-sm text-muted-foreground py-4">加载中...</p>
                ) : progressList.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">暂无处理记录</p>
                ) : (
                  <div className="relative pl-6 space-y-6">
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border"></div>
                    {progressList.map((item, idx) => (
                      <div key={idx} className="relative pb-2">
                        <div
                          className={`absolute left-[-20px] top-1 h-3.5 w-3.5 rounded-full border-2 border-background ${
                            idx === 0 ? "bg-primary" : "bg-orange-500"
                          }`}
                        />
                        <div className="ml-4 space-y-1">
                          <p
                            className={`text-sm font-medium ${
                              idx === 0 ? "text-primary" : "text-orange-500"
                            }`}
                          >
                            {item.createTime?.slice(0, 19)}
                          </p>
                          <p className="text-sm text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 底部按钮 */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              关闭
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 新增报修对话框 */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
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
              <Select
                value={formBuilding}
                onValueChange={handleBuildingChange}
                disabled={formLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formLoading ? "加载中..." : "请选择楼栋"} />
                </SelectTrigger>
                <SelectContent>
                  {buildingList.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
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
                disabled={!formBuilding || formLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formBuilding ? "请选择楼层" : "请先选择楼栋"} />
                </SelectTrigger>
                <SelectContent>
                  {floorList.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
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
                disabled={!formFloor || formLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formFloor ? "请选择教室" : "请先选择楼层"} />
                </SelectTrigger>
                <SelectContent>
                  {roomList.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
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
            <Button variant="outline" onClick={() => handleDialogOpenChange(false)}>
              取消
            </Button>
            <Button
              disabled={formSubmitting || !formTitle || !formBuilding || !formFloor || !formClassroom || !formFaultType}
              onClick={async () => {
                if (!formTitle || !formBuilding || !formFloor || !formClassroom || !formFaultType) return
                setFormSubmitting(true)
                try {
                  await addWorkOrder({
                    buildingId: formBuilding,
                    floorId: formFloor,
                    roomId: formClassroom,
                    title: formTitle,
                    faultType: faultTypeToApi[formFaultType] ?? 1,
                    description: formDescription || undefined,
                    status: 0,
                  })
                  handleDialogOpenChange(false)
                  fetchTickets(1)
                } catch (err) {
                  console.error("新增报修失败:", err)
                } finally {
                  setFormSubmitting(false)
                }
              }}
            >
              {formSubmitting ? "提交中..." : "确定"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
