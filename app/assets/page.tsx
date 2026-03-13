"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search, Plus, Download, RefreshCw, Wrench, Settings,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Info, Trash2, X, Eye,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  getEquipmentPage,
  getEquipmentStatusCount,
  getEquipmentTypeList,
  getEquipmentDetail,
  addEquipment,
  updateEquipment,
  deleteEquipment,
  EQUIPMENT_STATUS_MAP,
  type EquipmentPageVO,
  type EquipmentTypeVO,
  type EquipmentStatusCountVO,
  type EquipmentDetailVO,
} from "@/lib/api/equipment"
import {
  getBuildingList,
  getFloorList,
  getRoomList,
  type BuildingListVO,
  type FloorListVO,
  type RoomListVO,
} from "@/lib/api/building"

// ── 编辑/新增表单 ──

interface EquipmentForm {
  id?: string
  name: string
  brand: string
  model: string
  type: string
  group: string
  buildingId: string
  floorId: string
  roomId: string
  purchasingDate: string
  serviceLifeHour: string
  status: string
}

const emptyForm: EquipmentForm = {
  name: "", brand: "", model: "", type: "", group: "",
  buildingId: "", floorId: "", roomId: "",
  purchasingDate: "", serviceLifeHour: "", status: "0",
}

type ScrapKey = "all" | "normal" | "abnormal" | "scrap"
const SCRAP_VALUES: Record<ScrapKey, number | undefined> = {
  all: undefined,
  normal: 2,
  abnormal: 3,
  scrap: 1,
}

export default function AssetsPage() {
  // ── 列表 ──
  const [assets, setAssets] = useState<EquipmentPageVO[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  // ── 筛选 ──
  const [searchName, setSearchName] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [queryName, setQueryName] = useState("")
  const [queryType, setQueryType] = useState("")
  const [queryStatus, setQueryStatus] = useState("")

  // ── 卡片筛选 ──
  const [activeCard, setActiveCard] = useState<ScrapKey>("all")

  // ── 统计 ──
  const [statusCount, setStatusCount] = useState<EquipmentStatusCountVO | null>(null)

  // ── 设备分类 ──
  const [typeList, setTypeList] = useState<EquipmentTypeVO[]>([])

  // ── 编辑弹窗 ──
  const [formOpen, setFormOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form, setForm] = useState<EquipmentForm>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  // ── 详情弹窗 ──
  const [detailOpen, setDetailOpen] = useState(false)
  const [detail, setDetail] = useState<EquipmentDetailVO | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // ── 删除确认弹窗 ──
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteIds, setDeleteIds] = useState<string[]>([])
  const [deleting, setDeleting] = useState(false)

  // ── 楼栋/楼层/教室级联 ──
  const [buildings, setBuildings] = useState<BuildingListVO[]>([])
  const [floors, setFloors] = useState<FloorListVO[]>([])
  const [rooms, setRooms] = useState<RoomListVO[]>([])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // ── 初始化 ──
  useEffect(() => {
    getEquipmentTypeList().then(setTypeList).catch(() => {})
    getBuildingList().then(setBuildings).catch(() => {})
    getEquipmentStatusCount().then(setStatusCount).catch(() => {})
  }, [])

  // ── 列表请求 ──
  const fetchList = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getEquipmentPage({
        page: currentPage,
        pageSize,
        name: queryName || undefined,
        type: queryType ? Number(queryType) : undefined,
        status: queryStatus !== "" ? Number(queryStatus) : undefined,
        scrap: SCRAP_VALUES[activeCard],
      })
      setAssets(res.records ?? [])
      setTotal(res.total ?? 0)
    } catch (err) {
      console.error("获取资产列表失败", err)
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, queryName, queryType, queryStatus, activeCard])

  useEffect(() => { fetchList() }, [fetchList])

  const refreshAll = () => {
    fetchList()
    getEquipmentStatusCount().then(setStatusCount).catch(() => {})
  }

  // ── 卡片点击 ──
  const handleCardClick = (key: ScrapKey) => {
    setActiveCard(key)
    setCurrentPage(1)
  }

  // ── 筛选操作 ──
  const handleSearch = () => {
    setQueryName(searchName)
    setQueryType(filterType)
    setQueryStatus(filterStatus)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSearchName(""); setFilterType(""); setFilterStatus("")
    setQueryName(""); setQueryType(""); setQueryStatus("")
    setActiveCard("all")
    setCurrentPage(1)
  }

  // ── 选择 ──
  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? assets.map((a) => a.id) : [])
  }
  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows(checked ? [...selectedRows, id] : selectedRows.filter((r) => r !== id))
  }

  // ── 删除 ──
  const openDeleteConfirm = (ids: string[]) => {
    setDeleteIds(ids)
    setDeleteOpen(true)
  }
  const confirmDelete = async () => {
    if (!deleteIds.length) return
    setDeleting(true)
    try {
      await deleteEquipment(deleteIds)
      setSelectedRows((prev) => prev.filter((r) => !deleteIds.includes(r)))
      setDeleteOpen(false)
      refreshAll()
    } catch (err) {
      console.error("删除失败", err)
    } finally {
      setDeleting(false)
    }
  }

  // ── 详情 ──
  const openDetail = async (id: string) => {
    setDetailOpen(true)
    setDetailLoading(true)
    try {
      setDetail(await getEquipmentDetail(id))
    } catch (err) {
      console.error("获取详情失败", err)
    } finally {
      setDetailLoading(false)
    }
  }

  // ── 新增弹窗 ──
  const openAddDialog = () => {
    setIsEdit(false)
    setForm(emptyForm)
    setFloors([]); setRooms([])
    setFormOpen(true)
  }

  // ── 编辑弹窗 ──
  const openEditDialog = async (asset: EquipmentPageVO) => {
    setIsEdit(true)
    setForm({
      id: asset.id,
      name: asset.name ?? "",
      brand: asset.brand ?? "",
      model: asset.model ?? "",
      type: asset.type != null ? String(asset.type) : "",
      group: asset.group != null ? String(asset.group) : "",
      buildingId: asset.buildingId ?? "",
      floorId: asset.floorId ?? "",
      roomId: asset.roomId ?? "",
      purchasingDate: asset.purchasingDate ?? "",
      serviceLifeHour: asset.serviceLifeHour != null ? String(asset.serviceLifeHour) : "",
      status: asset.status != null ? String(asset.status) : "0",
    })

    if (asset.buildingId) {
      try {
        const fl = await getFloorList(asset.buildingId)
        setFloors(fl)
        if (asset.floorId) {
          const rm = await getRoomList(asset.buildingId, asset.floorId)
          setRooms(rm)
        }
      } catch { /* ignore */ }
    }

    setFormOpen(true)
  }

  // ── 级联变化 ──
  const handleBuildingChange = async (val: string) => {
    setForm((f) => ({ ...f, buildingId: val, floorId: "", roomId: "" }))
    setRooms([])
    if (val) {
      try { setFloors(await getFloorList(val)) } catch { setFloors([]) }
    } else {
      setFloors([])
    }
  }

  const handleFloorChange = async (val: string) => {
    setForm((f) => ({ ...f, floorId: val, roomId: "" }))
    if (val && form.buildingId) {
      try { setRooms(await getRoomList(form.buildingId, val)) } catch { setRooms([]) }
    } else {
      setRooms([])
    }
  }

  // ── 提交 ──
  const handleSubmit = async () => {
    if (!form.name.trim() || !form.brand.trim() || !form.model.trim() || !form.type || !form.group || !form.buildingId || !form.roomId || !form.purchasingDate || !form.serviceLifeHour) return
    setSubmitting(true)
    try {
      const payload = {
        name: form.name,
        brand: form.brand,
        model: form.model,
        group: Number(form.group),
        type: Number(form.type),
        serviceLifeHour: Number(form.serviceLifeHour),
        purchasingDate: form.purchasingDate.includes(" ") ? form.purchasingDate : `${form.purchasingDate} 00:00:00`,
        buildingId: form.buildingId,
        floorId: form.floorId,
        roomId: form.roomId,
      }
      if (isEdit && form.id) {
        await updateEquipment({ ...payload, id: form.id, status: Number(form.status) })
      } else {
        await addEquipment(payload)
      }
      setFormOpen(false)
      refreshAll()
    } catch (err) {
      console.error("保存失败", err)
    } finally {
      setSubmitting(false)
    }
  }

  // ── 辅助 ──
  const getStatusInfo = (s: number) =>
    EQUIPMENT_STATUS_MAP[s] ?? { label: `未知(${s})`, className: "text-muted-foreground" }

  const getPageNumbers = () => {
    const pages: (number | "...")[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push("...")
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  // ── 渲染 ──
  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="space-y-4">
        {/* ── 统计卡片（可点击筛选） ── */}
        <div className="grid grid-cols-4 gap-4">
          {([
            { key: "all" as ScrapKey, label: "设备总数", value: statusCount?.totalCount, color: "" },
            { key: "normal" as ScrapKey, label: "正常运行", value: statusCount?.normalCount, color: "text-green-600" },
            { key: "abnormal" as ScrapKey, label: "异常/维修", value: statusCount?.abnormalCount, color: "text-amber-600" },
            { key: "scrap" as ScrapKey, label: "即将报废", value: statusCount?.scrapCount, color: "text-destructive" },
          ]).map((card) => (
            <Card
              key={card.key}
              className={cn(
                "p-4 cursor-pointer transition-colors hover:bg-muted/50",
                activeCard === card.key && "ring-2 ring-primary",
              )}
              onClick={() => handleCardClick(card.key)}
            >
              <div className="text-sm text-muted-foreground mb-1">{card.label}</div>
              <div className={cn("text-2xl font-semibold", card.color)}>{card.value ?? "-"}</div>
            </Card>
          ))}
        </div>

        {/* ── 筛选栏 ── */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">设备名称:</span>
            <Input
              placeholder="请输入设备名称"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">设备类型:</span>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="请选择类型" />
              </SelectTrigger>
              <SelectContent>
                {typeList.map((t) => (
                  <SelectItem key={t.type} value={String(t.type)}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">状态:</span>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="请选择状态" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EQUIPMENT_STATUS_MAP).map(([val, { label }]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-1" />
            查询
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-1" />
            重置
          </Button>
        </div>

        {/* ── 工具栏 ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-1" />
              新增
            </Button>
            {selectedRows.length > 0 && (
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => openDeleteConfirm(selectedRows)}
              >
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
            <Button variant="ghost" size="icon" onClick={refreshAll}>
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

        {/* ── 选中提示 ── */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded">
          <Info className="h-4 w-4" />
          <span>{selectedRows.length > 0 ? `已选中 ${selectedRows.length} 条数据` : "未选中任何数据"}</span>
        </div>

        {/* ── 数据表格 ── */}
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-3 text-center w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === assets.length && assets.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4"
                  />
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground w-[60px]">序号</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    设备名称
                    <div className="flex flex-col">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">品牌</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">型号</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">寿命(小时)</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">使用时长(小时)</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">设备类型</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">设备状态</th>
                <th className="p-3 text-center text-sm font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j} className="p-3"><Skeleton className="h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : assets.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-sm text-muted-foreground">暂无数据</td>
                </tr>
              ) : (
                assets.map((asset, idx) => {
                  const si = getStatusInfo(asset.status)
                  return (
                    <tr key={asset.id} className="border-b border-border hover:bg-muted/20">
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(asset.id)}
                          onChange={(e) => handleSelectRow(asset.id, e.target.checked)}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="p-3 text-center text-sm text-muted-foreground">{(currentPage - 1) * pageSize + idx + 1}</td>
                      <td className="p-3 text-center text-sm font-medium">{asset.name || "-"}</td>
                      <td className="p-3 text-center text-sm">{asset.brand || "-"}</td>
                      <td className="p-3 text-center text-sm text-muted-foreground">{asset.model || "-"}</td>
                      <td className="p-3 text-center text-sm">{asset.serviceLifeHour ?? "-"}</td>
                      <td className="p-3 text-center text-sm">{asset.workingTime ?? "-"}</td>
                      <td className="p-3 text-center">
                        <Badge variant="outline">{asset.typeName || "-"}</Badge>
                      </td>
                      <td className="p-3 text-center">
                        <span className={cn("text-sm", si.className)}>{si.label}</span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="text-sm text-primary hover:underline" onClick={() => openEditDialog(asset)}>编辑</button>
                          <button className="text-sm text-primary hover:underline" onClick={() => openDetail(asset.id)}>详情</button>
                          <button className="text-sm text-destructive hover:underline" onClick={() => openDeleteConfirm([asset.id])}>删除</button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── 分页 ── */}
        <div className="flex items-center justify-end gap-4">
          <span className="text-sm text-muted-foreground">共 {total} 条数据</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {getPageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`dot-${i}`} className="px-1 text-muted-foreground">...</span>
              ) : (
                <Button key={p} variant={p === currentPage ? "default" : "outline"} size="sm" className="h-8 w-8 p-0" onClick={() => setCurrentPage(p)}>
                  {p}
                </Button>
              ),
            )}
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1) }}>
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

      {/* ══════════ 新增 / 编辑弹窗 ══════════ */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEdit ? "编辑设备" : "新增设备"}</DialogTitle>
            <DialogDescription className="sr-only">{isEdit ? "编辑设备信息" : "填写设备信息"}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* 设备名称 */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <Label className="text-right text-sm"><span className="text-destructive mr-0.5">*</span>设备名称</Label>
              <div className="relative">
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="请输入设备名称" className="pr-8" />
                {form.name && <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setForm({ ...form, name: "" })}><X className="h-4 w-4" /></button>}
              </div>
            </div>

            {/* 品牌 */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <Label className="text-right text-sm"><span className="text-destructive mr-0.5">*</span>品牌</Label>
              <div className="relative">
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="请输入品牌" className="pr-8" />
                {form.brand && <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setForm({ ...form, brand: "" })}><X className="h-4 w-4" /></button>}
              </div>
            </div>

            {/* 型号 */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <Label className="text-right text-sm"><span className="text-destructive mr-0.5">*</span>型号</Label>
              <div className="relative">
                <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="请输入型号" className="pr-8" />
                {form.model && <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setForm({ ...form, model: "" })}><X className="h-4 w-4" /></button>}
              </div>
            </div>

            {/* 设备类型 */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <Label className="text-right text-sm"><span className="text-destructive mr-0.5">*</span>设备类型</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue placeholder="请选择设备类型" /></SelectTrigger>
                <SelectContent>
                  {typeList.map((t) => (
                    <SelectItem key={t.type} value={String(t.type)}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 设备组序号 */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <Label className="text-right text-sm"><span className="text-destructive mr-0.5">*</span>设备组序号</Label>
              <Input type="number" min={1} value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} placeholder="请输入设备组序号" />
            </div>

            {/* 选择楼栋 */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <Label className="text-right text-sm"><span className="text-destructive mr-0.5">*</span>选择楼栋</Label>
              <Select value={form.buildingId} onValueChange={handleBuildingChange}>
                <SelectTrigger><SelectValue placeholder="请选择楼栋" /></SelectTrigger>
                <SelectContent>
                  {buildings.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 选择楼层 */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <Label className="text-right text-sm"><span className="text-destructive mr-0.5">*</span>选择楼层</Label>
              <Select value={form.floorId} onValueChange={handleFloorChange} disabled={!form.buildingId}>
                <SelectTrigger><SelectValue placeholder="请选择楼层" /></SelectTrigger>
                <SelectContent>
                  {floors.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 选择教室 */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <Label className="text-right text-sm"><span className="text-destructive mr-0.5">*</span>选择教室</Label>
              <Select value={form.roomId} onValueChange={(v) => setForm({ ...form, roomId: v })} disabled={!form.floorId}>
                <SelectTrigger><SelectValue placeholder="请选择教室" /></SelectTrigger>
                <SelectContent>
                  {rooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 购买时间 */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <Label className="text-right text-sm"><span className="text-destructive mr-0.5">*</span>购买时间</Label>
              <Input type="datetime-local" value={form.purchasingDate} onChange={(e) => setForm({ ...form, purchasingDate: e.target.value })} />
            </div>

            {/* 寿命(小时) */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <Label className="text-right text-sm"><span className="text-destructive mr-0.5">*</span>寿命(小时)</Label>
              <Input type="number" min={1} value={form.serviceLifeHour} onChange={(e) => setForm({ ...form, serviceLifeHour: e.target.value })} placeholder="请输入寿命小时数" />
            </div>

            {/* 设备状态（仅编辑时显示） */}
            {isEdit && (
              <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                <Label className="text-right text-sm"><span className="text-destructive mr-0.5">*</span>设备状态</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue placeholder="请选择状态" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(EQUIPMENT_STATUS_MAP).map(([val, { label }]) => (
                      <SelectItem key={val} value={val}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>取消</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "提交中…" : "确认"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════ 详情弹窗 ══════════ */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>设备详情</DialogTitle>
            <DialogDescription className="sr-only">查看设备详细信息</DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="grid gap-3 py-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
          ) : detail ? (
            <div className="grid gap-3 py-2 text-sm">
              {([
                ["设备名称", detail.name],
                ["品牌", detail.brand],
                ["型号", detail.model],
                ["设备组序号", detail.group],
                ["位置", detail.address],
                ["购买时间", detail.purchasingDate],
                ["寿命(小时)", detail.serviceLifeHour],
                ["已工作(小时)", detail.workingTime],
                ["设备状态", detail.status],
              ] as [string, string | number][]).map(([label, value]) => (
                <div key={label} className="grid grid-cols-[100px_1fr] gap-2">
                  <span className="text-muted-foreground text-right">{label}：</span>
                  <span className="text-foreground">{value ?? "-"}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">加载失败</div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════ 删除确认弹窗 ══════════ */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除选中的 {deleteIds.length} 条设备记录吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "删除中…" : "确认删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
