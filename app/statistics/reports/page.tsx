"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

// 刷卡教室排名 Top 10 数据
const classroomSwipeData = [
  { name: "YG09-102", count: 279 },
  { name: "YG09-276", count: 276 },
  { name: "YG09-266", count: 266 },
  { name: "YG09-262", count: 262 },
  { name: "YG09-249", count: 249 },
  { name: "YG09-244", count: 244 },
  { name: "YG09-234", count: 234 },
  { name: "YG09-233", count: 233 },
  { name: "YG09-118", count: 233 },
  { name: "YG09-120", count: 228 },
]

// 学院刷卡活跃度 Top 10
const collegeSwipeData = [
  { name: "纺织科学与工程学院", count: 1046 },
  { name: "机械工程学院", count: 892 },
  { name: "会计学院", count: 784 },
  { name: "计算机与人工智能学院", count: 756 },
  { name: "环境工程学院", count: 698 },
  { name: "材料科学与工程学院", count: 645 },
  { name: "管理学院", count: 612 },
  { name: "化学与化工学院", count: 578 },
  { name: "电子与电气学院", count: 534 },
  { name: "经济学院", count: 498 },
]

// 刷卡达人榜 Top 5
const topSwipersData = [
  { rank: 1, name: "许家龙", college: "环境工程学院", count: 301 },
  { rank: 2, name: "李明", college: "计算机与人工智能学院", count: 278 },
  { rank: 3, name: "王芳", college: "纺织科学与工程学院", count: 256 },
  { rank: 4, name: "张伟", college: "机械工程学院", count: 234 },
  { rank: 5, name: "刘洋", college: "会计学院", count: 221 },
]

// 使用教室排名 Top 10（按时长）
const classroomUsageData = [
  { name: "201", hours: 7 },
  { name: "A101", hours: 6.5 },
  { name: "401", hours: 6 },
  { name: "301", hours: 5.5 },
  { name: "402", hours: 5 },
  { name: "101", hours: 4.5 },
  { name: "C301", hours: 4 },
  { name: "102", hours: 3.5 },
  { name: "B201", hours: 3 },
  { name: "202", hours: 2.5 },
]

const chartConfig = {
  count: { label: "刷卡次数", color: "hsl(var(--primary))" },
  hours: { label: "时长(小时)", color: "hsl(var(--primary))" },
}

export default function ReportsPage() {
  const [year, setYear] = useState("2026")
  const [season, setSeason] = useState("spring")
  const [month, setMonth] = useState("2")
  const [classroomRankMode, setClassroomRankMode] = useState<"most" | "least">("most")
  const [collegeRankMode, setCollegeRankMode] = useState<"most" | "least">("most")
  const [swiperRankMode, setSwiperRankMode] = useState<"most" | "least">("most")
  const [usageRankMode, setUsageRankMode] = useState<"most" | "least">("most")

  const classroomData = classroomRankMode === "most"
    ? [...classroomSwipeData].reverse()
    : classroomSwipeData
  const collegeData = collegeRankMode === "most"
    ? [...collegeSwipeData].reverse()
    : collegeSwipeData
  const swiperData = swiperRankMode === "most"
    ? topSwipersData
    : [...topSwipersData].reverse()
  const usageData = usageRankMode === "most"
    ? [...classroomUsageData].reverse()
    : classroomUsageData

  const ToggleSwitch = ({
    value,
    onChange,
  }: {
    value: "most" | "least"
    onChange: (v: "most" | "least") => void
  }) => (
    <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
      <button
        type="button"
        onClick={() => onChange("least")}
        className={cn(
          "rounded px-2 py-0.5 text-xs transition-colors",
          value === "least" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        最少
      </button>
      <button
        type="button"
        onClick={() => onChange("most")}
        className={cn(
          "rounded px-2 py-0.5 text-xs transition-colors",
          value === "most" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
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
                <SelectItem value="2026">2026年</SelectItem>
                <SelectItem value="2025">2025年</SelectItem>
                <SelectItem value="2024">2024年</SelectItem>
              </SelectContent>
            </Select>
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="选择季节" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spring">春季</SelectItem>
                <SelectItem value="summer">夏季</SelectItem>
                <SelectItem value="autumn">秋季</SelectItem>
                <SelectItem value="winter">冬季</SelectItem>
              </SelectContent>
            </Select>
            <Select value={month} onValueChange={setMonth}>
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

        {/* 顶部 4 张卡片 */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">刷卡最多教室</p>
              <p className="mt-1 text-xl font-bold text-primary">YG09-102</p>
              <p className="mt-1 text-sm text-muted-foreground">刷卡次数 279次</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">刷卡最多学院</p>
              <p className="mt-1 text-xl font-bold text-primary">纺织科学与工程学院</p>
              <p className="mt-1 text-sm text-muted-foreground">刷卡次数 1046次</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">刷卡最多个人</p>
              <p className="mt-1 text-xl font-bold text-orange-500">许家龙</p>
              <p className="mt-1 text-sm text-muted-foreground">刷卡次数 301次</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">最长使用教室</p>
              <p className="mt-1 text-xl font-bold text-primary">201</p>
              <p className="mt-1 text-sm text-muted-foreground">使用时长 7小时</p>
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
                <ToggleSwitch value={classroomRankMode} onChange={setClassroomRankMode} />
              </div>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <BarChart data={classroomData} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number) => [`${value}次`, "刷卡次数"]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* 学院刷卡活跃度 - 折线图 */}
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">学院刷卡活跃度排名 (Top 10)</h3>
                <ToggleSwitch value={collegeRankMode} onChange={setCollegeRankMode} />
              </div>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <AreaChart data={collegeData} margin={{ left: 8, right: 8 }}>
                  <defs>
                    <linearGradient id="collegeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(0, 4) + "..."} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: "人次", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    formatter={(value: number) => [`${value}人次`, ""]}
                    labelFormatter={(label) => collegeData.find((d) => d.name === label)?.name ?? label}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="url(#collegeGradient)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* 底行：刷卡达人榜 + 使用教室排名 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 刷卡达人榜 */}
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">刷卡达人榜 (Top 5)</h3>
                <ToggleSwitch value={swiperRankMode} onChange={setSwiperRankMode} />
              </div>
              <div className="space-y-3">
                {swiperData.map((item) => (
                  <div key={item.rank} className="flex items-center gap-4 rounded-lg border border-border bg-muted/20 px-4 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {item.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.college}</p>
                    </div>
                    <span className="font-medium text-foreground">{item.count}次</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 使用教室排名 - 纵向柱状图 */}
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">使用教室排名 (Top 10)</h3>
                <ToggleSwitch value={usageRankMode} onChange={setUsageRankMode} />
              </div>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <BarChart data={usageData} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: "时长(小时)", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    formatter={(value: number) => [`${value}小时`, "使用时长"]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
