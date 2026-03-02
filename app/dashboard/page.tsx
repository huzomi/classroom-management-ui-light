"use client"

import { Activity, Zap, ThermometerSun, Droplets, TrendingUp, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col bg-[#050505]">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-8 py-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">智慧教室运维大屏</h1>
            <p className="mt-2 text-sm text-gray-300">实时监控 · 数据分析 · 智能管理</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">当前时间</p>
            <p className="text-xl font-semibold text-white">2024-01-15 15:30:25</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Top Stats */}
        <div className="mb-6 grid gap-6 md:grid-cols-4">
          <Card className="border-white/10 bg-gradient-to-br from-blue-600/20 to-blue-600/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">教室总数</p>
                  <p className="mt-2 text-4xl font-bold text-white">120</p>
                  <p className="mt-2 text-sm text-emerald-400">使用中: 98</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
                  <Activity className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-emerald-600/20 to-emerald-600/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">设备在线率</p>
                  <p className="mt-2 text-4xl font-bold text-white">98.2%</p>
                  <p className="mt-2 flex items-center text-sm text-emerald-400">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    较昨日 +0.5%
                  </p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                  <Zap className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-amber-600/20 to-amber-600/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">今日能耗</p>
                  <p className="mt-2 text-4xl font-bold text-white">1,248</p>
                  <p className="mt-2 text-sm text-gray-400">kWh</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                  <Zap className="h-8 w-8 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-red-600/20 to-red-600/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">故障告警</p>
                  <p className="mt-2 text-4xl font-bold text-white">12</p>
                  <p className="mt-2 text-sm text-red-400">紧急: 3</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">教室使用分布</h3>
                <div className="space-y-3">
                  {[
                    { building: "第一教学楼", total: 40, inUse: 35, color: "bg-blue-500" },
                    { building: "第二教学楼", total: 30, inUse: 28, color: "bg-emerald-500" },
                    { building: "实验楼", total: 25, inUse: 20, color: "bg-purple-500" },
                    { building: "东校区", total: 25, inUse: 15, color: "bg-amber-500" },
                  ].map((item) => (
                    <div key={item.building}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-gray-300">{item.building}</span>
                        <span className="text-gray-400">
                          {item.inUse}/{item.total}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full ${item.color}`}
                          style={{ width: `${(item.inUse / item.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">环境监测</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: ThermometerSun, label: "平均温度", value: "24.2°C", color: "text-orange-400" },
                    { icon: Droplets, label: "平均湿度", value: "45%", color: "text-blue-400" },
                    { icon: Activity, label: "PM2.5", value: "18", color: "text-emerald-400" },
                    { icon: Activity, label: "CO₂", value: "520", color: "text-purple-400" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-2">
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        <p className="text-xs text-gray-400">{item.label}</p>
                      </div>
                      <p className={`mt-2 text-2xl font-bold ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">实时告警</h3>
                <div className="space-y-3">
                  {[
                    { room: "101教室", issue: "投影仪无法启动", time: "5分钟前", level: "high" },
                    { room: "203教室", issue: "温度过高 28°C", time: "12分钟前", level: "medium" },
                    { room: "305教室", issue: "CO₂浓度超标", time: "25分钟前", level: "medium" },
                    { room: "402教室", issue: "功放设备离线", time: "1小时前", level: "low" },
                  ].map((alert, i) => (
                    <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{alert.room}</p>
                          <p className="mt-1 text-xs text-gray-400">{alert.issue}</p>
                          <p className="mt-1 text-xs text-gray-500">{alert.time}</p>
                        </div>
                        <div
                          className={`h-2 w-2 rounded-full ${
                            alert.level === "high"
                              ? "bg-red-500"
                              : alert.level === "medium"
                                ? "bg-amber-500"
                                : "bg-gray-500"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">能耗趋势</h3>
                <div className="h-[200px] flex items-end justify-between gap-1">
                  {[65, 72, 68, 82, 78, 85, 82, 75, 88, 92, 85, 90].map((value, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center">
                      <div className="w-full flex-1 relative">
                        <div
                          className="absolute bottom-0 w-full rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400"
                          style={{ height: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">设备状态</h3>
                <div className="space-y-3">
                  {[
                    { type: "投影仪", online: 118, total: 120, color: "bg-blue-500" },
                    { type: "台式机", online: 115, total: 120, color: "bg-emerald-500" },
                    { type: "功放", online: 120, total: 120, color: "bg-purple-500" },
                    { type: "灯光", online: 235, total: 240, color: "bg-amber-500" },
                    { type: "空调", online: 165, total: 180, color: "bg-cyan-500" },
                  ].map((device) => (
                    <div key={device.type}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-gray-300">{device.type}</span>
                        <span className="text-gray-400">
                          {device.online}/{device.total}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full ${device.color}`}
                          style={{ width: `${(device.online / device.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">工单处理</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">待处理</span>
                    <span className="text-2xl font-bold text-amber-400">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">处理中</span>
                    <span className="text-2xl font-bold text-blue-400">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">本月完成</span>
                    <span className="text-2xl font-bold text-emerald-400">156</span>
                  </div>
                  <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="text-sm text-gray-400">平均响应时间</p>
                    <p className="mt-1 text-3xl font-bold text-white">18分钟</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
