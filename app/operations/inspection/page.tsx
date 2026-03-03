"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Home,
  AlertCircle,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
    <main className="flex-1 overflow-auto p-6 bg-background">
      <div className="mx-auto max-w-[1800px] space-y-6">
        {/* 顶部统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">覆盖教室(间)</p>
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

        {/* 主体内容：日历 + 记录表格 */}
        <div className="flex gap-6">
          {/* 左侧日历 */}
          <Card className="w-80 flex-shrink-0">
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
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
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

          {/* 右侧巡检记录 */}
          <Card className="flex-1">
            <CardContent className="p-4">
              {/* 标题行 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-foreground">巡检记录</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={selectedRecordDate}
                      onChange={(e) => setSelectedRecordDate(e.target.value)}
                      className="border border-border rounded-md px-3 py-1.5 text-sm bg-background"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">模式</span>
                  <Select value={inspectionMode} onValueChange={setInspectionMode}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="after-class">下课巡检</SelectItem>
                      <SelectItem value="scheduled">定时巡检</SelectItem>
                      <SelectItem value="manual">手动巡检</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-primary hover:bg-primary/90">
                    立即巡检
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    导出
                  </Button>
                </div>
              </div>

              {/* 表格 */}
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-16 text-center">序号</TableHead>
                      <TableHead className="w-40">巡检时间</TableHead>
                      <TableHead>校区</TableHead>
                      <TableHead>楼栋</TableHead>
                      <TableHead className="w-20">楼层</TableHead>
                      <TableHead className="w-24">教室</TableHead>
                      <TableHead className="w-20 text-center">设备数</TableHead>
                      <TableHead className="w-20 text-center">AI快照</TableHead>
                      <TableHead className="w-20 text-center">结果</TableHead>
                      <TableHead className="w-20 text-center">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspectionRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="text-center">{record.id}</TableCell>
                        <TableCell>{record.time}</TableCell>
                        <TableCell>{record.campus}</TableCell>
                        <TableCell>{record.building}</TableCell>
                        <TableCell>{record.floor}</TableCell>
                        <TableCell>{record.classroom}</TableCell>
                        <TableCell className="text-center">{record.deviceCount}</TableCell>
                        <TableCell className="text-center">
                          <Button variant="link" className="text-primary p-0 h-auto">
                            查看
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={record.result === "正常" ? "text-green-600" : "text-red-600"}>
                            {record.result}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="link" className="text-primary p-0 h-auto">
                            详情
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
