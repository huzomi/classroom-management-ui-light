"use client"

import { CreditCard, Search, Plus, Download, UserCheck, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ICCardPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0a] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">IC卡管理</h1>
            <p className="mt-1 text-sm text-gray-400">教师IC卡权限与记录管理</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-white/10 bg-white/5">
              <Download className="mr-2 h-4 w-4" />
              导出记录
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              添加IC卡
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">已发放卡片</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">256</div>
                <p className="mt-1 text-xs text-gray-500">累计发放</p>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">活跃卡片</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-400">242</div>
                <p className="mt-1 text-xs text-gray-500">正常使用中</p>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">今日刷卡</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">1,248</div>
                <p className="mt-1 text-xs text-gray-500">次</p>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">异常卡片</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-400">14</div>
                <p className="mt-1 text-xs text-gray-500">冻结/挂失</p>
              </CardContent>
            </Card>
          </div>

          {/* Card List */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">IC卡列表</CardTitle>
                  <CardDescription>所有教师IC卡信息</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input placeholder="搜索卡号、姓名..." className="border-white/10 bg-white/5 pl-10 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: "张老师",
                    cardNo: "0012345678",
                    dept: "数学系",
                    status: "active",
                    lastUse: "5分钟前",
                    room: "101教室",
                  },
                  {
                    name: "李老师",
                    cardNo: "0012345679",
                    dept: "英语系",
                    status: "active",
                    lastUse: "1小时前",
                    room: "102教室",
                  },
                  {
                    name: "王老师",
                    cardNo: "0012345680",
                    dept: "计算机系",
                    status: "active",
                    lastUse: "2小时前",
                    room: "103教室",
                  },
                  {
                    name: "刘老师",
                    cardNo: "0012345681",
                    dept: "物理系",
                    status: "frozen",
                    lastUse: "3天前",
                    room: "-",
                  },
                  {
                    name: "陈老师",
                    cardNo: "0012345682",
                    dept: "化学系",
                    status: "active",
                    lastUse: "30分钟前",
                    room: "201教室",
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border border-white/10">
                        <AvatarFallback className="bg-blue-500/10 text-blue-400">
                          {card.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{card.name}</p>
                          <Badge variant={card.status === "active" ? "default" : "destructive"} className="text-xs">
                            {card.status === "active" ? "正常" : "冻结"}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-400">
                          卡号: {card.cardNo} · {card.dept}
                        </p>
                        <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {card.lastUse}
                          </span>
                          {card.room !== "-" && (
                            <span className="flex items-center gap-1">
                              <UserCheck className="h-3 w-3" />
                              {card.room}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        查看记录
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        权限设置
                      </Button>
                      {card.status === "active" ? (
                        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                          冻结
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300">
                          解冻
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">最近刷卡记录</CardTitle>
              <CardDescription>实时刷卡活动</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "张老师", action: "开门", room: "101教室", time: "14:30:25" },
                  { name: "李老师", action: "开灯", room: "102教室", time: "14:28:15" },
                  { name: "王老师", action: "开启投影", room: "103教室", time: "14:25:42" },
                  { name: "刘老师", action: "关门", room: "201教室", time: "14:20:18" },
                  { name: "陈老师", action: "开门", room: "202教室", time: "14:15:33" },
                ].map((record, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                        <CreditCard className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{record.name}</p>
                        <p className="text-xs text-gray-400">
                          {record.action} · {record.room}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{record.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
