"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Home,
  AlertCircle,
  Calendar,
  Clock,
  Download,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// 每日巡检状态数据（日期 -> { count: 巡检次数, hasAbnormal: 是否有异常 }）
const dailyInspectionStatus: Record<string, { count: number; hasAbnormal: boolean }> = {
  "2026-02-02": { count: 3, hasAbnormal: false },
  "2026-02-03": { count: 2, hasAbnormal: true },
  "2026-02-05": { count: 1, hasAbnormal: false },
  "2026-02-09": { count: 4, hasAbnormal: false },
  "2026-02-10": { count: 2, hasAbnormal: true },
  "2026-02-11": { count: 1, hasAbnormal: false },
  "2026-02-16": { count: 3, hasAbnormal: false },
  "2026-02-17": { count: 2, hasAbnormal: false },
  "2026-02-18": { count: 1, hasAbnormal: true },
  "2026-02-23": { count: 2, hasAbnormal: false },
  "2026-02-24": { count: 1, hasAbnormal: false },
}

// 固定的巡检记录数据
const inspectionRecords = [
  { id: 1, time: "2026-02-02 17:35:04", campus: "阳光校区", building: "纺织大学教学楼", floor: "一楼", classroom: "YG09-102", deviceCount: 1, result: "正常" },
  { id: 2, time: "2026-02-02 17:35:04", campus: "阳光校区", building: "纺织大学教学楼", floor: "一楼", classroom: "YG09-104", deviceCount: 1, result: "正常" },
  { id: 3, time: "2026-02-02 17:35:04", campus: "阳光校区", building: "纺织大学教学楼", floor: "一楼", classroom: "YG09-105", deviceCount: 1, result: "正常" },
  { id: 4, time: "2026-02-02 17:35:04", campus: "阳光校区", building: "纺织大学教学楼", floor: "一楼", classroom: "YG09-106", deviceCount: 1, result: "正常" },
  { id: 5, time: "2026-02-02 17:35:04", campus: "阳光校区", building: "纺织大学教学楼", floor: "一楼", classroom: "YG09-108", deviceCount: 1, result: "正常" },
  { id: 6, time: "2026-02-02 17:35:04", campus: "阳光校区", building: "纺织大学教学楼", floor: "一楼", classroom: "YG09-109", deviceCount: 1, result: "正常" },
  { id: 7, time: "2026-02-02 17:35:04", campus: "阳光校区", building: "纺织大学教学楼", floor: "一楼", classroom: "YG09-118", deviceCount: 1, result: "正常" },
  { id: 8, time: "2026-02-02 17:35:04", campus: "阳光校区", building: "纺织大学教学楼", floor: "一楼", classroom: "YG09-120", deviceCount: 1, result: "正常" },
  { id: 9, time: "2026-02-02 17:35:04", campus: "阳光校区", building: "纺织大学教学楼", floor: "一楼", classroom: "YG09-121", deviceCount: 1, result: "正常" },
  { id: 10, time: "2026-02-02 17:35:04", campus: "阳光校区", building: "纺织大学教学楼", floor: "一楼", classroom: "YG09-122", deviceCount: 1, result: "正常" },
]

export default function InspectionPage() {
  const [currentYear, setCurrentYear] = useState(2026)
  const [currentMonth, setCurrentMonth] = useState(2)
  const [selectedDate, setSelectedDate] = useState(2)
  const [selectedRecordDate, setSelectedRecordDate] = useState("2026-02-02")
  const [inspectionMode, setInspectionMode] = useState("after-class")
  const [pageSize, setPageSize] = useState(10)

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
      const dateKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      const dayStatus = dailyInspectionStatus[dateKey]
      
      let status: "normal" | "abnormal" | "none" = "none"
      let count = 0
      
      if (dayStatus) {
        status = dayStatus.hasAbnormal ? "abnormal" : "normal"
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

  const calendarDays = generateCalendarDays()
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
    const today = new Date()
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth() + 1)
    setSelectedDate(today.getDate())
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
                <p className="text-3xl font-bold text-foreground">19</p>
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
                <p className="text-3xl font-bold text-foreground">1</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">上次巡检：</p>
                <p className="text-xl font-bold text-foreground font-mono">2026-02-02 17:35:04</p>
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
              <h3 className="font-semibold text-foreground mb-4">巡检日历</h3>
              
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
                    onClick={() => item.isCurrentMonth && setSelectedDate(item.day)}
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
                      onChange={(e) => setSelectedRecordDate(e.target.value)}
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
                  <Button className="bg-primary hover:bg-primary/90">立即巡检</Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    导出
                  </Button>
                </div>
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
                    {inspectionRecords.map((record) => (
                      <tr key={record.id} className="border-b border-border hover:bg-muted/20">
                        <td className="p-3 text-center text-sm">{record.id}</td>
                        <td className="p-3 text-center text-sm">{record.time}</td>
                        <td className="p-3 text-center text-sm">{record.campus}</td>
                        <td className="p-3 text-center text-sm">{record.building}</td>
                        <td className="p-3 text-center text-sm">{record.floor}</td>
                        <td className="p-3 text-center text-sm">{record.classroom}</td>
                        <td className="p-3 text-center text-sm">{record.deviceCount}</td>
                        <td className="p-3 text-center">
                          <button className="text-sm text-primary hover:underline">查看</button>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`text-sm ${record.result === "正常" ? "text-green-600" : "text-red-600"}`}>
                            {record.result}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button className="text-sm text-primary hover:underline">详情</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              <div className="flex items-center justify-end gap-4">
                <span className="text-sm text-muted-foreground">共 {inspectionRecords.length} 条数据</span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-primary text-primary-foreground">
                    1
                  </Button>
                </div>
                <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
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
    </main>
  )
}
