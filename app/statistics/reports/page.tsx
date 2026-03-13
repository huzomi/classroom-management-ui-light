"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChartContainer } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts"
import { Download } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getRoomRankPage,
  getCollegeRankPage,
  getPersonalRankPage,
  getRoomUseTime,
  SEASON_MAP,
  type RoomRankVO,
  type CollegeRankVO,
  type PersonalRankVO,
  type RoomUseTimeVO,
} from "@/lib/api/report"

const CHART_BLUE = "#60a5fa"

const chartConfig = {
  payCount: { label: "刷卡次数", color: CHART_BLUE },
  time: { label: "时长(小时)", color: CHART_BLUE },
}

type SortMode = "most" | "least"

function sortValue(mode: SortMode): number {
  return mode === "most" ? 2 : 1
}

export default function ReportsPage() {
  const [year, setYear] = useState("")
  const [season, setSeason] = useState("")
  const [month, setMonth] = useState("")

  const [classroomSort, setClassroomSort] = useState<SortMode>("most")
  const [collegeSort, setCollegeSort] = useState<SortMode>("most")
  const [swiperSort, setSwiperSort] = useState<SortMode>("most")
  const [usageSort, setUsageSort] = useState<SortMode>("most")

  const [roomData, setRoomData] = useState<RoomRankVO[]>([])
  const [collegeData, setCollegeData] = useState<CollegeRankVO[]>([])
  const [personalData, setPersonalData] = useState<PersonalRankVO[]>([])
  const [usageData, setUsageData] = useState<RoomUseTimeVO[]>([])

  const [loadingRoom, setLoadingRoom] = useState(false)
  const [loadingCollege, setLoadingCollege] = useState(false)
  const [loadingPersonal, setLoadingPersonal] = useState(false)
  const [loadingUsage, setLoadingUsage] = useState(false)

  const baseFilter = useCallback(() => {
    const f: { year?: number; month?: number; season?: string } = {}
    if (year) f.year = Number(year)
    if (season) f.season = SEASON_MAP[season]
    else if (month) f.month = Number(month)
    return f
  }, [year, season, month])

  // ── 四个请求函数 ──

  const fetchRoomRank = useCallback(async (sort: SortMode) => {
    setLoadingRoom(true)
    try {
      const res = await getRoomRankPage({ ...baseFilter(), sort: sortValue(sort), page: 1, pageSize: 10 })
      setRoomData(res.records ?? [])
    } catch (err) { console.error("刷卡教室排名请求失败", err) }
    finally { setLoadingRoom(false) }
  }, [baseFilter])

  const fetchCollegeRank = useCallback(async (sort: SortMode) => {
    setLoadingCollege(true)
    try {
      const res = await getCollegeRankPage({ ...baseFilter(), sort: sortValue(sort), page: 1, pageSize: 10 })
      setCollegeData(res.records ?? [])
    } catch (err) { console.error("学院排名请求失败", err) }
    finally { setLoadingCollege(false) }
  }, [baseFilter])

  const fetchPersonalRank = useCallback(async (sort: SortMode) => {
    setLoadingPersonal(true)
    try {
      const res = await getPersonalRankPage({ ...baseFilter(), sort: sortValue(sort), page: 1, pageSize: 5 })
      setPersonalData(res.records ?? [])
    } catch (err) { console.error("刷卡达人榜请求失败", err) }
    finally { setLoadingPersonal(false) }
  }, [baseFilter])

  const fetchUsageRank = useCallback(async (sort: SortMode) => {
    setLoadingUsage(true)
    try {
      const res = await getRoomUseTime({ ...baseFilter(), sort: sortValue(sort) })
      setUsageData(res ?? [])
    } catch (err) { console.error("使用教室排名请求失败", err) }
    finally { setLoadingUsage(false) }
  }, [baseFilter])

  // 筛选条件变化 → 全部重新请求（sort 不作为依赖，避免切换排序时 4 个接口全部重刷）
  const classroomSortRef = useRef(classroomSort)
  const collegeSortRef = useRef(collegeSort)
  const swiperSortRef = useRef(swiperSort)
  const usageSortRef = useRef(usageSort)
  classroomSortRef.current = classroomSort
  collegeSortRef.current = collegeSort
  swiperSortRef.current = swiperSort
  usageSortRef.current = usageSort

  useEffect(() => {
    fetchRoomRank(classroomSortRef.current)
    fetchCollegeRank(collegeSortRef.current)
    fetchPersonalRank(swiperSortRef.current)
    fetchUsageRank(usageSortRef.current)
  }, [fetchRoomRank, fetchCollegeRank, fetchPersonalRank, fetchUsageRank])

  // 季节/月份互斥
  const handleSeasonChange = (v: string) => { setSeason(v); setMonth("") }
  const handleMonthChange = (v: string) => { setMonth(v); setSeason("") }

  // 排序变化 → 仅重新请求对应的单个接口
  const handleClassroomSortChange = (v: SortMode) => { setClassroomSort(v); fetchRoomRank(v) }
  const handleCollegeSortChange = (v: SortMode) => { setCollegeSort(v); fetchCollegeRank(v) }
  const handleSwiperSortChange = (v: SortMode) => { setSwiperSort(v); fetchPersonalRank(v) }
  const handleUsageSortChange = (v: SortMode) => { setUsageSort(v); fetchUsageRank(v) }

  // ── 统计卡片数据（始终取当前排序的第 1 条） ──
  const topRoom = roomData.length > 0 ? roomData[0] : null
  const topCollege = collegeData.length > 0 ? collegeData[0] : null
  const topPersonal = personalData.length > 0 ? personalData[0] : null
  const topUsage = usageData.length > 0 ? usageData[0] : null

  const ToggleSwitch = ({
    value,
    onChange,
  }: {
    value: SortMode
    onChange: (v: SortMode) => void
  }) => (
    <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
      <button
        type="button"
        onClick={() => onChange("least")}
        className={cn(
          "rounded px-2 py-0.5 text-xs transition-colors",
          value === "least" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        最少
      </button>
      <button
        type="button"
        onClick={() => onChange("most")}
        className={cn(
          "rounded px-2 py-0.5 text-xs transition-colors",
          value === "most" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        最多
      </button>
    </div>
  )

  return (
    <main className="flex-1 overflow-auto p-6 bg-background">
      <div className="mx-auto w-full max-w-[1800px] space-y-6">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">数据统计分析</h1>
          <div className="flex items-center gap-3">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="选择年份" />
              </SelectTrigger>
              <SelectContent>
                {[2026, 2025, 2024, 2023].map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}年</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={season} onValueChange={handleSeasonChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="选择季节" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SEASON_MAP).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={month} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="选择月份" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={String(i + 1)}>
                    {i + 1}月
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>
              <Download className="h-4 w-4 mr-1" />
              导出报表
            </Button>
          </div>
        </div>

        {/* 顶部 4 张统计卡片（随排序动态切换标题和数据） */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{classroomSort === "most" ? "刷卡最多教室" : "刷卡最少教室"}</p>
              <p className="mt-1 text-xl font-bold text-primary">{topRoom?.roomCode ?? "-"}</p>
              <p className="mt-1 text-sm text-muted-foreground">刷卡次数 {topRoom?.payCount ?? "-"}次</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{collegeSort === "most" ? "刷卡最多学院" : "刷卡最少学院"}</p>
              <p className="mt-1 text-xl font-bold text-primary">{topCollege?.college ?? "-"}</p>
              <p className="mt-1 text-sm text-muted-foreground">刷卡次数 {topCollege?.payCount ?? "-"}次</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{swiperSort === "most" ? "刷卡最多个人" : "刷卡最少个人"}</p>
              <p className="mt-1 text-xl font-bold text-orange-500">{topPersonal?.name ?? "-"}</p>
              <p className="mt-1 text-sm text-muted-foreground">刷卡次数 {topPersonal?.payCount ?? "-"}次</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{usageSort === "most" ? "最长使用教室" : "最短使用教室"}</p>
              <p className="mt-1 text-xl font-bold text-primary">{topUsage?.roomName ?? "-"}</p>
              <p className="mt-1 text-sm text-muted-foreground">使用时长 {topUsage?.time ?? "-"}小时</p>
            </CardContent>
          </Card>
        </div>

        {/* 中间行：2 个图表 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 刷卡教室排名 - 横向柱状图 */}
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">刷卡教室排名 (Top 10)</h3>
                <ToggleSwitch value={classroomSort} onChange={handleClassroomSortChange} />
              </div>
              {loadingRoom ? (
                <div className="h-[280px] flex items-center justify-center"><Skeleton className="h-full w-full" /></div>
              ) : roomData.length === 0 ? (
                <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">暂无数据</div>
              ) : (
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                  <BarChart data={roomData} layout="vertical" margin={{ left: 8, right: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="roomCode" width={90} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value: number) => [`${value}次`, "刷卡次数"]}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Bar dataKey="payCount" fill={CHART_BLUE} radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* 学院刷卡活跃度 - 折线面积图 */}
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">学院刷卡活跃度排名 (Top 10)</h3>
                <ToggleSwitch value={collegeSort} onChange={handleCollegeSortChange} />
              </div>
              {loadingCollege ? (
                <div className="h-[280px] flex items-center justify-center"><Skeleton className="h-full w-full" /></div>
              ) : collegeData.length === 0 ? (
                <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">暂无数据</div>
              ) : (
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                  <AreaChart data={collegeData} margin={{ left: 8, right: 8 }}>
                    <defs>
                      <linearGradient id="collegeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="college" tick={{ fontSize: 10 }} tickFormatter={(v: string) => v.length > 4 ? v.slice(0, 4) + "..." : v} />
                    <YAxis tick={{ fontSize: 11 }} label={{ value: "人次", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      formatter={(value: number) => [`${value}人次`, ""]}
                      labelFormatter={(label: string) => collegeData.find((d) => d.college === label)?.college ?? label}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Area type="monotone" dataKey="payCount" stroke={CHART_BLUE} fill="url(#collegeGradient)" strokeWidth={2} />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 底行：刷卡达人榜 + 使用教室排名 */}
        <div className="grid grid-cols-[2fr_3fr] gap-6">
          {/* 刷卡达人榜 */}
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">刷卡达人榜 (Top 5)</h3>
                <ToggleSwitch value={swiperSort} onChange={handleSwiperSortChange} />
              </div>
              {loadingPersonal ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[58px] w-full rounded-lg" />)}
                </div>
              ) : personalData.length === 0 ? (
                <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">暂无数据</div>
              ) : (
                <div className="space-y-3">
                  {personalData.map((item, idx) => (
                    <div key={item.cardNo || idx} className="flex items-center gap-4 rounded-lg border border-border bg-muted/20 px-4 py-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.college}</p>
                      </div>
                      <span className="font-medium text-foreground">{item.payCount}次</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 使用教室排名 - 纵向柱状图 */}
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">使用教室排名 (Top 10)</h3>
                <ToggleSwitch value={usageSort} onChange={handleUsageSortChange} />
              </div>
              {loadingUsage ? (
                <div className="h-[360px] flex items-center justify-center"><Skeleton className="h-full w-full" /></div>
              ) : usageData.length === 0 ? (
                <div className="h-[360px] flex items-center justify-center text-sm text-muted-foreground">暂无数据</div>
              ) : (
                <ChartContainer config={chartConfig} className="h-[360px] w-full">
                  <BarChart data={usageData} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="roomName" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} label={{ value: "时长(小时)", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      formatter={(value: number) => [`${value}小时`, "使用时长"]}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Bar dataKey="time" fill={CHART_BLUE} radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
