"use client"

import { BarChart3, TrendingUp, Activity, Zap, ThermometerSun, Droplets, Wind, Sun } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StatisticsPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0a] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">数据统计</h1>
            <p className="mt-1 text-sm text-gray-400">设备运行状态与能耗分析</p>
          </div>
          <div className="flex items-center gap-4">
            <Select defaultValue="today">
              <SelectTrigger className="w-[150px] border-white/10 bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">今天</SelectItem>
                <SelectItem value="week">本周</SelectItem>
                <SelectItem value="month">本月</SelectItem>
                <SelectItem value="year">本年</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/5">
            <TabsTrigger value="overview">总览</TabsTrigger>
            <TabsTrigger value="energy">能耗分析</TabsTrigger>
            <TabsTrigger value="environment">环境监测</TabsTrigger>
            <TabsTrigger value="device">设备统计</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                    <Activity className="h-4 w-4" />
                    教室使用率
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">82.5%</div>
                  <p className="mt-1 flex items-center text-xs text-emerald-400">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    较昨日 +5.2%
                  </p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                    <Zap className="h-4 w-4" />
                    今日能耗
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">1,248</div>
                  <p className="mt-1 text-xs text-gray-500">kWh</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-gradient-to-br from-amber-500/10 to-amber-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                    <BarChart3 className="h-4 w-4" />
                    设备在线率
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">98.2%</div>
                  <p className="mt-1 text-xs text-gray-500">1,652/1,682 设备在线</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                    <Activity className="h-4 w-4" />
                    平均温度
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">24.2°C</div>
                  <p className="mt-1 text-xs text-gray-500">舒适范围</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-white">教室使用趋势</CardTitle>
                  <CardDescription>本周使用率变化</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-end justify-between gap-2">
                    {[65, 72, 68, 82, 78, 85, 82].map((value, i) => (
                      <div key={i} className="flex flex-1 flex-col items-center gap-2">
                        <div className="w-full flex-1 relative">
                          <div
                            className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 transition-all hover:from-blue-400 hover:to-blue-300"
                            style={{ height: `${value}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {["周一", "周二", "周三", "周四", "周五", "周六", "周日"][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-white">能耗分布</CardTitle>
                  <CardDescription>各类设备能耗占比</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "空调系统", value: 45, color: "bg-blue-500" },
                      { label: "照明系统", value: 25, color: "bg-emerald-500" },
                      { label: "多媒体设备", value: 20, color: "bg-amber-500" },
                      { label: "其他设备", value: 10, color: "bg-gray-500" },
                    ].map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">{item.label}</span>
                          <span className="font-medium text-white">{item.value}%</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                          <div className={`h-full ${item.color} transition-all`} style={{ width: `${item.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="energy" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">今日总能耗</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">1,248 kWh</div>
                  <p className="mt-1 text-xs text-gray-500">预计费用: ¥624</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">本月累计</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">28,560 kWh</div>
                  <p className="mt-1 text-xs text-emerald-400">较上月节省 8.5%</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">峰值功率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">256 kW</div>
                  <p className="mt-1 text-xs text-gray-500">发生于 14:30</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">能耗时段分布</CardTitle>
                <CardDescription>24小时能耗变化曲线</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-between gap-1">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const value = i < 8 || i > 18 ? 20 + Math.random() * 10 : 60 + Math.random() * 40
                    return (
                      <div key={i} className="flex flex-1 flex-col items-center gap-2">
                        <div className="w-full flex-1 relative">
                          <div
                            className="absolute bottom-0 w-full rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400"
                            style={{ height: `${value}%` }}
                          />
                        </div>
                        {i % 3 === 0 && <span className="text-[10px] text-gray-500">{i}:00</span>}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="environment" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { icon: ThermometerSun, label: "平均温度", value: "24.2°C", status: "good", color: "text-emerald-400" },
                { icon: Droplets, label: "平均湿度", value: "45%", status: "good", color: "text-blue-400" },
                { icon: Wind, label: "PM2.5", value: "18 μg/m³", status: "excellent", color: "text-emerald-400" },
                { icon: Sun, label: "光照度", value: "520 lux", status: "good", color: "text-amber-400" },
              ].map((item) => (
                <Card key={item.label} className="border-white/10 bg-white/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-400">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${item.color}`}>{item.value}</div>
                    <p className="mt-1 text-xs text-gray-500">{item.status === "excellent" ? "优秀" : "良好"}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">环境质量分布</CardTitle>
                <CardDescription>各教室环境指标统计</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { metric: "温度达标率", value: 95, total: 120, color: "bg-emerald-500" },
                    { metric: "湿度达标率", value: 98, total: 120, color: "bg-blue-500" },
                    { metric: "CO₂达标率", value: 92, total: 120, color: "bg-amber-500" },
                    { metric: "空气质量达标率", value: 100, total: 120, color: "bg-emerald-500" },
                  ].map((item) => (
                    <div key={item.metric} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{item.metric}</span>
                        <span className="font-medium text-white">
                          {item.value}/{item.total} 间
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full ${item.color}`}
                          style={{ width: `${(item.value / item.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="device" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">设备总数</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">1,682</div>
                  <p className="mt-1 text-xs text-gray-500">覆盖120间教室</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">在线设备</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-400">1,652</div>
                  <p className="mt-1 text-xs text-gray-500">在线率: 98.2%</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">故障设备</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-400">30</div>
                  <p className="mt-1 text-xs text-gray-500">待维修</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">设备类型分布</CardTitle>
                <CardDescription>各类设备数量与状态</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "投影仪", total: 120, online: 118, fault: 2 },
                    { type: "台式机", total: 120, online: 115, fault: 5 },
                    { type: "功放", total: 120, online: 120, fault: 0 },
                    { type: "控制面板", total: 120, online: 118, fault: 2 },
                    { type: "灯光控制器", total: 240, online: 235, fault: 5 },
                    { type: "空调", total: 180, online: 165, fault: 15 },
                    { type: "环境传感器", total: 480, online: 478, fault: 2 },
                    { type: "摄像头", total: 240, online: 240, fault: 0 },
                  ].map((device) => (
                    <div
                      key={device.type}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white">{device.type}</span>
                          <span className="text-sm text-gray-400">
                            {device.online}/{device.total}
                          </span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${(device.online / device.total) * 100}%` }}
                          />
                        </div>
                      </div>
                      {device.fault > 0 && (
                        <div className="ml-4 flex items-center gap-1 text-xs text-red-400">
                          <Activity className="h-3 w-3" />
                          {device.fault}故障
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
