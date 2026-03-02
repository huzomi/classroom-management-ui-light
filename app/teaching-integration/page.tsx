"use client"

import { useState } from "react"
import {
  Calendar,
  Clock,
  School,
  Play,
  Square,
  Lock,
  Unlock,
  Lightbulb,
  Monitor,
  Volume2,
  Thermometer,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TeachingIntegrationPage() {
  const [autoControl, setAutoControl] = useState(true)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0a] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">教学联动</h1>
            <p className="mt-1 text-sm text-gray-400">课表管理与设备自动化控制</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch id="auto-control" checked={autoControl} onCheckedChange={setAutoControl} />
              <Label htmlFor="auto-control" className="text-sm text-gray-300">
                自动控制
              </Label>
            </div>
            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              <Calendar className="mr-2 h-4 w-4" />
              同步课表
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="bg-white/5">
            <TabsTrigger value="schedule">课表管理</TabsTrigger>
            <TabsTrigger value="rules">控制策略</TabsTrigger>
            <TabsTrigger value="history">执行历史</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6">
            {/* Schedule Overview */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">今日课程</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">128</div>
                  <p className="mt-1 text-xs text-gray-500">进行中: 42</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">自动控制</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-400">96</div>
                  <p className="mt-1 text-xs text-gray-500">成功率: 99.2%</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">待执行任务</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">18</div>
                  <p className="mt-1 text-xs text-gray-500">下一节: 14:00</p>
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400">异常教室</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-400">3</div>
                  <p className="mt-1 text-xs text-gray-500">需要手动介入</p>
                </CardContent>
              </Card>
            </div>

            {/* Current Schedule */}
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">当前课程</CardTitle>
                <CardDescription>正在进行的课程与自动控制状态</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      room: "101教室",
                      course: "高等数学",
                      teacher: "张老师",
                      time: "08:00-09:40",
                      status: "进行中",
                      auto: true,
                    },
                    {
                      room: "102教室",
                      course: "大学英语",
                      teacher: "李老师",
                      time: "08:00-09:40",
                      status: "进行中",
                      auto: true,
                    },
                    {
                      room: "103教室",
                      course: "计算机基础",
                      teacher: "王老师",
                      time: "08:00-09:40",
                      status: "进行中",
                      auto: false,
                    },
                    {
                      room: "201教室",
                      course: "物理实验",
                      teacher: "刘老师",
                      time: "10:00-11:40",
                      status: "待开始",
                      auto: true,
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                          <School className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{item.room}</p>
                            <Badge variant={item.status === "进行中" ? "default" : "secondary"} className="text-xs">
                              {item.status}
                            </Badge>
                            {item.auto && (
                              <Badge variant="outline" className="border-emerald-500/50 text-xs text-emerald-400">
                                自动控制
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-400">
                            {item.course} · {item.teacher}
                          </p>
                          <p className="mt-0.5 flex items-center text-xs text-gray-500">
                            <Clock className="mr-1 h-3 w-3" />
                            {item.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-white">
                          查看详情
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-gray-400 hover:text-white">
                          手动控制
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">自动控制策略</CardTitle>
                <CardDescription>设置上课和下课时的设备自动化控制规则</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Class Start Rules */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-white">上课时自动执行</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Monitor, label: "开启投影仪", enabled: true },
                      { icon: Monitor, label: "开启台式机", enabled: true },
                      { icon: Volume2, label: "开启功放", enabled: true },
                      { icon: Lightbulb, label: "调整灯光亮度", enabled: true, value: "80%" },
                      { icon: Thermometer, label: "空调温度控制", enabled: true, value: "24°C" },
                      { icon: Lock, label: "锁定控制面板", enabled: false },
                    ].map((rule, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <rule.icon className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-300">{rule.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {rule.value && <span className="text-sm text-gray-400">{rule.value}</span>}
                          <Switch checked={rule.enabled} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Class End Rules */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-white">下课时自动执行</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Monitor, label: "关闭投影仪", enabled: true },
                      { icon: Monitor, label: "关闭台式机", enabled: false },
                      { icon: Volume2, label: "关闭功放", enabled: true },
                      { icon: Lightbulb, label: "关闭灯光", enabled: false },
                      { icon: Thermometer, label: "关闭空调", enabled: false },
                      { icon: Unlock, label: "解锁控制面板", enabled: true },
                    ].map((rule, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <rule.icon className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-300">{rule.label}</span>
                        </div>
                        <Switch checked={rule.enabled} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timing Settings */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-white">时间设置</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-400">上课前提前执行</Label>
                      <Select defaultValue="5">
                        <SelectTrigger className="border-white/10 bg-white/5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">不提前</SelectItem>
                          <SelectItem value="5">5分钟</SelectItem>
                          <SelectItem value="10">10分钟</SelectItem>
                          <SelectItem value="15">15分钟</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-400">下课后延迟执行</Label>
                      <Select defaultValue="5">
                        <SelectTrigger className="border-white/10 bg-white/5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">立即执行</SelectItem>
                          <SelectItem value="5">5分钟</SelectItem>
                          <SelectItem value="10">10分钟</SelectItem>
                          <SelectItem value="15">15分钟</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">执行历史</CardTitle>
                <CardDescription>自动控制任务的执行记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      time: "14:00:00",
                      room: "101教室",
                      action: "上课控制",
                      status: "success",
                      details: "投影仪开启、台式机开启、功放开启",
                    },
                    {
                      time: "13:55:00",
                      room: "201教室",
                      action: "上课控制",
                      status: "success",
                      details: "投影仪开启、台式机开启、灯光调整至80%",
                    },
                    {
                      time: "11:45:00",
                      room: "103教室",
                      action: "下课控制",
                      status: "failed",
                      details: "投影仪关闭失败，设备无响应",
                    },
                    {
                      time: "11:40:00",
                      room: "102教室",
                      action: "下课控制",
                      status: "success",
                      details: "投影仪关闭、功放关闭、面板解锁",
                    },
                  ].map((log, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            log.status === "success" ? "bg-emerald-500/10" : "bg-red-500/10"
                          }`}
                        >
                          {log.status === "success" ? (
                            <Play className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <Square className="h-5 w-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white">{log.room}</p>
                            <Badge variant={log.status === "success" ? "default" : "destructive"} className="text-xs">
                              {log.status === "success" ? "成功" : "失败"}
                            </Badge>
                          </div>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {log.action} · {log.time}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">{log.details}</p>
                        </div>
                      </div>
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
