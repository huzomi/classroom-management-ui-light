"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Play,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type FilterType = "all" | "normal" | "abnormal"

export default function InspectionPage() {
  const [startDate, setStartDate] = useState(new Date(2024, 0, 1))
  const [selectedDate, setSelectedDate] = useState<string | null>("2024-01-15")
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedClassroom, setSelectedClassroom] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState<FilterType>("all")

  const generate30DaysData = () => {
    const days = []
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 29)

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]
      const total = Math.floor(Math.random() * 50) + 30
      const abnormal = Math.floor(Math.random() * 5)
      days.push({
        date: dateStr,
        dayOfWeek: ["日", "一", "二", "三", "四", "五", "六"][date.getDay()],
        day: date.getDate(),
        month: date.getMonth() + 1,
        total,
        normal: total - abnormal,
        abnormal,
        status: abnormal === 0 ? "normal" : abnormal < 3 ? "warning" : "error",
      })
    }
    return days
  }

  const thirtyDaysData = generate30DaysData()

  const goToPrevious30Days = () => {
    const newStart = new Date(startDate)
    newStart.setDate(newStart.getDate() - 30)
    setStartDate(newStart)
    setSelectedDate(null)
  }

  const goToNext30Days = () => {
    const newStart = new Date(startDate)
    newStart.setDate(newStart.getDate() + 30)
    setStartDate(newStart)
    setSelectedDate(null)
  }

  const getDateRangeText = () => {
    const start = new Date(startDate)
    const end = new Date(startDate)
    end.setDate(end.getDate() + 29)
    return `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日 - ${end.getFullYear()}年${end.getMonth() + 1}月${end.getDate()}日`
  }

  const generateAllInspections = () => {
    const allInspections: any[] = []
    thirtyDaysData.forEach((day) => {
      const dayInspections = [
        {
          id: `${day.date}-1`,
          classroom: "101教室",
          building: "第一教学楼",
          floor: "1层",
          time: `${day.date} 08:00`,
          status: Math.random() > 0.8 ? "异常" : "正常",
          items: { total: 12, passed: Math.random() > 0.8 ? 10 : 12, failed: Math.random() > 0.8 ? 2 : 0 },
          details: [
            { name: "投影仪", status: "正常", message: "设备在线，工作正常" },
            { name: "灯光", status: "正常", message: "照明正常" },
            { name: "空调", status: "正常", message: "温度控制正常" },
            { name: "电脑", status: "正常", message: "系统运行正常" },
            { name: "功放", status: "正常", message: "音频输出正常" },
            { name: "摄像头", status: "正常", message: "画面正常" },
          ],
        },
        {
          id: `${day.date}-2`,
          classroom: "102教室",
          building: "第一教学楼",
          floor: "1层",
          time: `${day.date} 08:05`,
          status: Math.random() > 0.7 ? "异常" : "正常",
          items: { total: 12, passed: Math.random() > 0.7 ? 10 : 12, failed: Math.random() > 0.7 ? 2 : 0 },
          details: [
            { name: "投影仪", status: "异常", message: "设备离线，无法连接" },
            { name: "灯光", status: "正常", message: "照明正常" },
            { name: "空调", status: "异常", message: "温度传感器故障" },
            { name: "电脑", status: "正常", message: "系统运行正常" },
            { name: "功放", status: "正常", message: "音频输出正常" },
            { name: "摄像头", status: "正常", message: "画面正常" },
          ],
        },
        {
          id: `${day.date}-3`,
          classroom: "201教室",
          building: "第一教学楼",
          floor: "2层",
          time: `${day.date} 08:10`,
          status: "正常",
          items: { total: 12, passed: 12, failed: 0 },
          details: [
            { name: "投影仪", status: "正常", message: "设备在线，工作正常" },
            { name: "灯光", status: "正常", message: "照明正常" },
            { name: "空调", status: "正常", message: "温度控制正常" },
            { name: "电脑", status: "正常", message: "系统运行正常" },
            { name: "功放", status: "正常", message: "音频输出正常" },
            { name: "摄像头", status: "正常", message: "画面正常" },
          ],
        },
      ]
      allInspections.push(...dayInspections)
    })
    return allInspections
  }

  const allInspections = generateAllInspections()

  const selectedDayData = selectedDate ? thirtyDaysData.find((d) => d.date === selectedDate) : null
  const totalInspected = selectedDate
    ? selectedDayData?.total || 0
    : thirtyDaysData.reduce((sum, day) => sum + day.total, 0)
  const normalCount = selectedDate
    ? selectedDayData?.normal || 0
    : thirtyDaysData.reduce((sum, day) => sum + day.normal, 0)
  const abnormalCount = selectedDate
    ? selectedDayData?.abnormal || 0
    : thirtyDaysData.reduce((sum, day) => sum + day.abnormal, 0)

  const filteredInspections = allInspections.filter((item) => {
    if (selectedDate && !item.time.startsWith(selectedDate)) return false

    if (statusFilter === "normal" && item.status !== "正常") return false
    if (statusFilter === "abnormal" && item.status !== "异常") return false

    return true
  })

  const handleDateClick = (date: string) => {
    if (selectedDate === date) {
      setSelectedDate(null)
    } else {
      setSelectedDate(date)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-[1600px] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">智能巡检</h1>
              <p className="mt-1 text-sm text-gray-600">自动检测教室设备状态，查看历史巡检记录</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Play className="mr-2 h-4 w-4" />
              开始巡检
            </Button>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-medium text-gray-900">
                  30天巡检记录
                  {!selectedDate && <span className="ml-2 text-sm text-gray-500">（已选择全部日期）</span>}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevious30Days}
                    className="h-8 border-gray-300 hover:bg-gray-100 bg-transparent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium text-gray-700">{getDateRangeText()}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNext30Days}
                    className="h-8 border-gray-300 hover:bg-gray-100 bg-transparent"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-green-500"></div>
                  <span>正常</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-yellow-500"></div>
                  <span>警告</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-red-500"></div>
                  <span>异常</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-10 gap-2">
              {thirtyDaysData.map((day) => (
                <button
                  key={day.date}
                  onClick={() => handleDateClick(day.date)}
                  className={`flex flex-col items-center justify-center rounded-lg border p-3 transition-all ${
                    selectedDate === day.date
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-xs text-gray-500">
                    {day.month}/{day.day}
                  </div>
                  <div
                    className={`text-xs ${
                      day.status === "normal"
                        ? "text-green-600"
                        : day.status === "warning"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    周{day.dayOfWeek}
                  </div>
                  <div className="mt-1 text-xs text-gray-600">{day.total}次</div>
                  {day.abnormal > 0 && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                      <AlertTriangle className="h-3 w-3" />
                      {day.abnormal}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-lg border p-6 text-left shadow-sm transition-all ${
                statusFilter === "all"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">巡检总数</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{totalInspected}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                {selectedDate
                  ? `${selectedDate} 共执行 ${totalInspected} 次巡检`
                  : `近30天共执行 ${totalInspected} 次巡检`}
              </div>
            </button>

            <button
              onClick={() => setStatusFilter("normal")}
              className={`rounded-lg border p-6 text-left shadow-sm transition-all ${
                statusFilter === "normal"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">正常</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{normalCount}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                正常率 {totalInspected > 0 ? Math.round((normalCount / totalInspected) * 100) : 0}%
              </div>
            </button>

            <button
              onClick={() => setStatusFilter("abnormal")}
              className={`rounded-lg border p-6 text-left shadow-sm transition-all ${
                statusFilter === "abnormal"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">异常</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{abnormalCount}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                异常率 {totalInspected > 0 ? Math.round((abnormalCount / totalInspected) * 100) : 0}%
              </div>
            </button>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedDate ? selectedDate : "近30天"} 巡检详情
                  {statusFilter !== "all" && (
                    <span className="ml-2 text-sm text-gray-500">
                      （{statusFilter === "normal" ? "仅显示正常" : "仅显示异常"}）
                    </span>
                  )}
                </h2>
                <p className="mt-1 text-xs text-gray-500">共 {filteredInspections.length} 条记录</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="搜索教室..."
                  className="w-64 border-gray-200 bg-white pl-10 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredInspections.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm transition-all hover:border-gray-300 hover:shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.classroom}</h3>
                      <p className="text-xs text-gray-500">
                        {item.building} · {item.floor}
                      </p>
                    </div>
                    <Badge
                      variant={item.status === "正常" ? "default" : "destructive"}
                      className={item.status === "正常" ? "bg-green-600" : "bg-red-600"}
                    >
                      {item.status}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">检测项</span>
                      <span className="text-gray-900">{item.items.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        通过
                      </span>
                      <span className="text-gray-900">{item.items.passed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-red-600">
                        <XCircle className="h-4 w-4" />
                        失败
                      </span>
                      <span className="text-gray-900">{item.items.failed}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.time.split(" ")[1]}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-blue-600 hover:text-blue-700"
                      onClick={() => {
                        setSelectedClassroom(item)
                        setShowDetailDialog(true)
                      }}
                    >
                      <FileText className="mr-1 h-3 w-3" />
                      查看详情
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredInspections.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-gray-300" />
                <p className="mt-4 text-sm text-gray-500">暂无巡检记录</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl border-gray-200 bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">{selectedClassroom?.classroom} 巡检详情</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <p className="text-xs text-gray-600">教学楼</p>
                <p className="mt-1 text-sm text-gray-900">{selectedClassroom?.building}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">楼层</p>
                <p className="mt-1 text-sm text-gray-900">{selectedClassroom?.floor}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">巡检时间</p>
                <p className="mt-1 text-sm text-gray-900">{selectedClassroom?.time}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">状态</p>
                <Badge
                  variant={selectedClassroom?.status === "正常" ? "default" : "destructive"}
                  className={`mt-1 ${selectedClassroom?.status === "正常" ? "bg-green-600" : "bg-red-600"}`}
                >
                  {selectedClassroom?.status}
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-900">设备检测详情</h3>
              <div className="space-y-2">
                {selectedClassroom?.details.map((detail: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      {detail.status === "正常" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{detail.name}</p>
                        <p className="text-xs text-gray-600">{detail.message}</p>
                      </div>
                    </div>
                    <Badge
                      variant={detail.status === "正常" ? "default" : "destructive"}
                      className={detail.status === "正常" ? "bg-green-600" : "bg-red-600"}
                    >
                      {detail.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
