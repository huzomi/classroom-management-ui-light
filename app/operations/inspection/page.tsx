"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Home,
  AlertCircle,
  Calendar,
  Clock,
  Download,
  ChevronUp,
  ChevronDown,
  Info,
  CheckCircle2,
  XCircle,
  MapPin,
  MonitorSmartphone,
  Image as ImageIcon,
  X,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { getPatrolCalendar, getPatrolRecord, getPatrolDetail, patrolCheck, type PatrolDetailPageVO, type PatrolDetailVO } from "@/lib/api/patrol"
import { toast } from "@/hooks/use-toast"

function formatDateTime(s: string | null | undefined): string {
  if (!s) return "-"
  return s.length > 19 ? s.slice(0, 19) : s
}

export default function InspectionPage() {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1)
  const [selectedDate, setSelectedDate] = useState(today.getDate())
  const [selectedRecordDate, setSelectedRecordDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  )
  const [inspectionMode, setInspectionMode] = useState("after-class")
  const [pageSize, setPageSize] = useState(10)
  const [calendarData, setCalendarData] = useState<
    Record<string, { count: number; status: "normal" | "abnormal" | "none" }>
  >({})
  const [calendarLoading, setCalendarLoading] = useState(false)
  const [records, setRecords] = useState<PatrolDetailPageVO[]>([])
  const [recordPage, setRecordPage] = useState(1)
  const [recordTotal, setRecordTotal] = useState(0)
  const [recordLoading, setRecordLoading] = useState(false)
  const [recordSummary, setRecordSummary] = useState<{
    latestPatrolTime: string | null
    totalRoomCount: number
    abnormalCount: number
  }>({ latestPatrolTime: null, totalRoomCount: 0, abnormalCount: 0 })

  // 详情弹窗
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailData, setDetailData] = useState<PatrolDetailVO | null>(null)

  // AI 快照大图预览
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")

  const [checking, setChecking] = useState(false)

  const handlePatrolCheck = async () => {
    setChecking(true)
    try {
      await patrolCheck()
      toast({ title: "巡检指令已发送" })
      // 刷新记录列表
      setRecordPage(1)
    } catch {
      toast({ title: "巡检指令发送失败", description: "请稍后重试", variant: "destructive" })
    } finally {
      setChecking(false)
    }
  }

  const handleViewDetail = async (patrolId: string) => {
    setDetailOpen(true)
    setDetailLoading(true)
    setDetailData(null)
    try {
      const data = await getPatrolDetail(patrolId)
      setDetailData(data)
    } catch (err) {
      console.error("获取巡检详情失败:", err)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleViewSnapshot = (imgUrl: string | undefined) => {
    if (!imgUrl) return
    setPreviewUrl(imgUrl)
    setPreviewOpen(true)
  }

  useEffect(() => {
    setCalendarLoading(true)
    // 接口返回「往前一个月」：传 4 月 1 日得 3 月数据，故传下月 1 日
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear
    const queryDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01 00:00:00`
    getPatrolCalendar(queryDate)
      .then((list) => {
        const map: Record<string, { count: number; status: "normal" | "abnormal" | "none" }> = {}
        for (const item of list ?? []) {
          const dateKey = item.date.startsWith("20") ? item.date.slice(0, 10) : item.date
          const status: "normal" | "abnormal" | "none" =
            item.status === 1 ? "normal" : item.status === 2 ? "abnormal" : "none"
          map[dateKey] = { count: item.patrolCount ?? 0, status }
        }
        setCalendarData(map)
      })
      .catch((err) => {
        console.error("加载巡检日历失败:", err)
        setCalendarData({})
      })
      .finally(() => setCalendarLoading(false))
  }, [currentYear, currentMonth])

  useEffect(() => {
    setRecordLoading(true)
    getPatrolRecord({
      page: recordPage,
      pageSize,
      createTime: selectedRecordDate,
    })
      .then((res) => {
        setRecords(res?.pageData?.records ?? [])
        setRecordTotal(res?.pageData?.total ?? 0)
        setRecordSummary({
          latestPatrolTime: res?.latestPatrolTime ?? null,
          totalRoomCount: res?.totalRoomCount ?? 0,
          abnormalCount: res?.abnormalCount ?? 0,
        })
      })
      .catch((err) => {
        console.error("加载巡检记录失败:", err)
        setRecords([])
        setRecordTotal(0)
      })
      .finally(() => setRecordLoading(false))
  }, [selectedRecordDate, recordPage, pageSize])

  // 生成日历数据
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth - 1, 1)
    const lastDay = new Date(currentYear, currentMonth, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay()
    
    const days: { day: number; isCurrentMonth: boolean; status?: "normal" | "abnormal" | "none"; count?: number }[] = []
    
    // 上个月的天数
    const prevMonthLastDay = new Date(currentYear, currentMonth - 1, 0).getDate()
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, isCurrentMonth: false })
    }
    
    // 当前月的天数
    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(i).padStart(2, "0")}`
      const dayStatus = calendarData[dateKey]
      
      let status: "normal" | "abnormal" | "none" = "none"
      let count = 0
      
      if (dayStatus) {
        status = dayStatus.status
        count = dayStatus.count
      }
      
      days.push({ day: i, isCurrentMonth: true, status, count })
    }
    
    // 下个月的天数
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false })
    }
    
    return days
  }

  const calendarDays = useMemo(() => generateCalendarDays(), [currentYear, currentMonth, calendarData])
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"]

  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const goToToday = () => {
    const d = new Date()
    setCurrentYear(d.getFullYear())
    setCurrentMonth(d.getMonth() + 1)
    setSelectedDate(d.getDate())
    setSelectedRecordDate(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    )
    setRecordPage(1)
  }

  return (
    <main className="flex flex-col flex-1 min-h-0 overflow-auto p-6 bg-background">
      <div className="mx-auto w-full max-w-[1800px] flex flex-col flex-1 min-h-0 gap-6">
        {/* 顶部统计卡片 */}
        <div className="grid grid-cols-4 gap-4 flex-shrink-0">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">教室总数(间)</p>
                <p className="text-3xl font-bold text-foreground">{recordSummary.totalRoomCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">发现异常(处)</p>
                <p className="text-3xl font-bold text-foreground">{recordSummary.abnormalCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">今日巡检次数</p>
                <p className="text-3xl font-bold text-foreground">
                  {currentYear === today.getFullYear() && currentMonth === today.getMonth() + 1
                    ? calendarData[
                        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
                      ]?.count ?? 0
                    : 0}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">下次自动巡检</p>
                <p className="text-xl font-bold text-foreground font-mono">00:00:00</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主体内容：日历 + 记录表格，比例约 1:3 */}
        <div className="grid grid-cols-[minmax(260px,1fr)_minmax(0,3fr)] gap-6 flex-1 min-h-[calc(100vh-14rem)]">
          {/* 左侧日历 ~25% */}
          <Card className="flex flex-col min-h-0 overflow-hidden">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                巡检日历
                {calendarLoading && (
                  <span className="text-xs text-muted-foreground font-normal">加载中...</span>
                )}
              </h3>
              
              {/* 月份导航 */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-foreground">{currentYear}年{currentMonth}月</span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={goToPrevMonth} className="h-7 px-2">
                    上个月
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToToday} className="h-7 px-2">
                    今天
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToNextMonth} className="h-7 px-2">
                    下个月
                  </Button>
                </div>
              </div>

              {/* 星期标题 */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-xs text-muted-foreground py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* 日历网格 */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!item.isCurrentMonth) return
                      setSelectedDate(item.day)
                      setSelectedRecordDate(
                        `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(item.day).padStart(2, "0")}`
                      )
                      setRecordPage(1)
                    }}
                    className={`
                      aspect-square flex flex-col items-center justify-center text-sm rounded-md transition-colors relative
                      ${!item.isCurrentMonth ? "text-muted-foreground/50" : "text-foreground"}
                      ${item.isCurrentMonth && selectedDate === item.day ? "bg-primary text-primary-foreground" : ""}
                      ${item.isCurrentMonth && selectedDate !== item.day ? "hover:bg-accent" : ""}
                    `}
                  >
                    <span>{item.day}</span>
                    {item.isCurrentMonth && item.status && item.status !== "none" && (
                      <>
                        <div 
                          className={`absolute top-1 right-1 h-1.5 w-1.5 rounded-full ${
                            item.status === "normal" ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        {item.count && item.count > 0 && (
                          <span className={`text-[10px] leading-none ${
                            selectedDate === item.day ? "text-primary-foreground/80" : "text-muted-foreground"
                          }`}>
                            {item.count}次
                          </span>
                        )}
                      </>
                    )}
                  </button>
                ))}
              </div>

              {/* 图例 */}
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-muted-foreground">正常</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-xs text-muted-foreground">有异常</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  <span className="text-xs text-muted-foreground">未巡检</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 右侧巡检记录 ~75% */}
          <Card className="flex flex-col min-h-0 overflow-hidden">
            <CardContent className="p-4 flex flex-col flex-1 min-h-0 space-y-4">
              {/* 筛选栏 + 操作按钮 */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">巡检日期:</span>
                    <input
                      type="date"
                      value={selectedRecordDate}
                      onChange={(e) => {
                    const v = e.target.value
                    setSelectedRecordDate(v)
                    if (v) {
                      const [y, m] = v.split("-").map(Number)
                      setCurrentYear(y)
                      setCurrentMonth(m)
                      setSelectedDate(parseInt(v.slice(8, 10), 10) || 1)
                    }
                    setRecordPage(1)
                  }}
                      className="border border-border rounded-md px-3 py-1.5 text-sm bg-background w-40"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">模式:</span>
                    <Select value={inspectionMode} onValueChange={setInspectionMode}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="after-class">下课巡检</SelectItem>
                        <SelectItem value="scheduled">定时巡检</SelectItem>
                        <SelectItem value="manual">手动巡检</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="bg-primary hover:bg-primary/90" onClick={handlePatrolCheck} disabled={checking}>
                    {checking ? "巡检中..." : "立即巡检"}
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    导出
                  </Button>
                </div>
              </div>

              {/* 上次巡检摘要 */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 shrink-0 text-primary" />
                <span>
                  上次巡检: <span className="font-mono text-foreground">{formatDateTime(recordSummary.latestPatrolTime)}</span>
                  {" · "}
                  覆盖: <span className="text-foreground">{recordSummary.totalRoomCount}</span>间
                  {" · "}
                  异常: <span className="text-red-600 font-medium">{recordSummary.abnormalCount}</span>处
                  {" | "}
                  模式: 每日自动
                </span>
              </div>

              {/* 表格 */}
              <div className="border border-border rounded-lg overflow-auto flex-1 min-h-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="p-3 text-center text-sm font-medium text-muted-foreground w-16">序号</th>
                      <th className="p-3 text-center text-sm font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          巡检时间
                          <div className="flex flex-col">
                            <ChevronUp className="h-3 w-3" />
                            <ChevronDown className="h-3 w-3 -mt-1" />
                          </div>
                        </div>
                      </th>
                      <th className="p-3 text-center text-sm font-medium text-muted-foreground">校区</th>
                      <th className="p-3 text-center text-sm font-medium text-muted-foreground">楼栋</th>
                      <th className="p-3 text-center text-sm font-medium text-muted-foreground">楼层</th>
                      <th className="p-3 text-center text-sm font-medium text-muted-foreground">教室</th>
                      <th className="p-3 text-center text-sm font-medium text-muted-foreground">设备数</th>
                      <th className="p-3 text-center text-sm font-medium text-muted-foreground">AI快照</th>
                      <th className="p-3 text-center text-sm font-medium text-muted-foreground">结果</th>
                      <th className="p-3 text-center text-sm font-medium text-muted-foreground">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recordLoading ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-sm text-muted-foreground">
                          加载中...
                        </td>
                      </tr>
                    ) : records.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-sm text-muted-foreground">
                          暂无巡检记录
                        </td>
                      </tr>
                    ) : (
                      records.map((record, idx) => (
                        <tr key={record.id} className="border-b border-border hover:bg-muted/20">
                          <td className="p-3 text-center text-sm">{(recordPage - 1) * pageSize + idx + 1}</td>
                          <td className="p-3 text-center text-sm">{formatDateTime(record.createTime)}</td>
                          <td className="p-3 text-center text-sm">{record.campus}</td>
                          <td className="p-3 text-center text-sm">{record.building}</td>
                          <td className="p-3 text-center text-sm">{record.floor}</td>
                          <td className="p-3 text-center text-sm">{record.room}</td>
                          <td className="p-3 text-center text-sm">{record.deviceCount}</td>
                          <td className="p-3 text-center">
                            <button
                              className="text-sm text-primary hover:underline"
                              onClick={() => handleViewSnapshot(record.imgUrl1)}
                            >
                              {record.imgUrl1 ? "查看" : "-"}
                            </button>
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`text-sm ${
                                record.status === 1 ? "text-red-600" : "text-green-600"
                              }`}
                            >
                              {record.status === 1 ? "异常" : "正常"}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              className="text-sm text-primary hover:underline"
                              onClick={() => handleViewDetail(record.id)}
                            >
                              详情
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              <div className="flex items-center justify-end gap-4">
                <span className="text-sm text-muted-foreground">共 {recordTotal} 条数据</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    disabled={recordPage <= 1}
                    onClick={() => setRecordPage((p) => Math.max(1, p - 1))}
                  >
                    上一页
                  </Button>
                  <span className="text-sm text-muted-foreground px-2">
                    第 {recordPage} / {Math.ceil(recordTotal / pageSize) || 1} 页
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    disabled={recordPage >= Math.ceil(recordTotal / pageSize)}
                    onClick={() => setRecordPage((p) => p + 1)}
                  >
                    下一页
                  </Button>
                </div>
                <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  setPageSize(Number(v))
                  setRecordPage(1)
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
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 巡检详情弹窗 */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              巡检详情
            </DialogTitle>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-sm text-muted-foreground">加载中...</span>
            </div>
          ) : detailData ? (
            <div className="space-y-5">
              {/* 基本信息 */}
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  教室信息
                </h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">校区</span>
                    <span className="text-foreground font-medium">{detailData.campus || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">楼栋</span>
                    <span className="text-foreground font-medium">{detailData.building || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">楼层</span>
                    <span className="text-foreground font-medium">{detailData.floor || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">教室</span>
                    <span className="text-foreground font-medium">{detailData.room || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">巡检时间</span>
                    <span className="text-foreground font-medium font-mono">{formatDateTime(detailData.createTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">巡检结果</span>
                    <span className={cn(
                      "flex items-center gap-1 font-medium",
                      detailData.status === 1 ? "text-red-600" : "text-green-600"
                    )}>
                      {detailData.status === 1 ? (
                        <><XCircle className="h-4 w-4" /> 异常</>
                      ) : (
                        <><CheckCircle2 className="h-4 w-4" /> 正常</>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* 设备状态 */}
              {detailData.equipmentStatus && Object.keys(detailData.equipmentStatus).length > 0 && (
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MonitorSmartphone className="h-4 w-4 text-primary" />
                    设备状态
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(detailData.equipmentStatus).map(([name, value]) => (
                      <div
                        key={name}
                        className={cn(
                          "flex items-center justify-between rounded-md px-3 py-2 text-sm",
                          value === 1
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        )}
                      >
                        <span className="font-medium">{name}</span>
                        <span className="flex items-center gap-1">
                          {value === 1 ? (
                            <><CheckCircle2 className="h-3.5 w-3.5" /> 正常</>
                          ) : (
                            <><XCircle className="h-3.5 w-3.5" /> 异常</>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI 截图 */}
              {detailData.imgUrls && detailData.imgUrls.length > 0 && (
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    AI 巡检截图
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {detailData.imgUrls.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => { setDetailOpen(false); setPreviewUrl(url); setPreviewOpen(true) }}
                        className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-muted hover:border-primary transition-colors"
                      >
                        <img
                          src={url}
                          alt={`巡检截图 ${i + 1}`}
                          className="h-full w-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-sm font-medium text-foreground">点击查看大图</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <span className="text-sm text-muted-foreground">暂无详情数据</span>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 图片大图预览 */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setPreviewOpen(false)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-background p-2 shadow-lg border border-border hover:bg-muted"
            onClick={() => setPreviewOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={previewUrl}
            alt="预览"
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  )
}
