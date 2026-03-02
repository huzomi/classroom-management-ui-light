"use client"

import { Save, User, Bell, Shield, Database, Palette, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0a] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">系统设置</h1>
            <p className="mt-1 text-sm text-gray-400">配置系统参数与权限管理</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" />
            保存设置
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-white/5">
            <TabsTrigger value="general">常规设置</TabsTrigger>
            <TabsTrigger value="notification">通知设置</TabsTrigger>
            <TabsTrigger value="security">安全设置</TabsTrigger>
            <TabsTrigger value="system">系统配置</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5" />
                  基本信息
                </CardTitle>
                <CardDescription>配置系统基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-gray-300">学校名称</Label>
                    <Input defaultValue="智慧大学" className="border-white/10 bg-white/5 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">管理员姓名</Label>
                    <Input defaultValue="管理员" className="border-white/10 bg-white/5 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">联系邮箱</Label>
                  <Input
                    type="email"
                    defaultValue="admin@university.edu"
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">联系电话</Label>
                  <Input defaultValue="010-12345678" className="border-white/10 bg-white/5 text-white" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Palette className="h-5 w-5" />
                  界面设置
                </CardTitle>
                <CardDescription>自定义界面外观</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">深色模式</Label>
                    <p className="text-sm text-gray-500">使用深色主题界面</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="bg-white/10" />
                <div className="space-y-2">
                  <Label className="text-gray-300">语言设置</Label>
                  <Select defaultValue="zh-CN">
                    <SelectTrigger className="border-white/10 bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh-CN">简体中文</SelectItem>
                      <SelectItem value="en-US">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">时区</Label>
                  <Select defaultValue="Asia/Shanghai">
                    <SelectTrigger className="border-white/10 bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Shanghai">中国标准时间 (UTC+8)</SelectItem>
                      <SelectItem value="America/New_York">东部时间 (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">格林威治时间 (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notification" className="space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bell className="h-5 w-5" />
                  通知配置
                </CardTitle>
                <CardDescription>管理系统通知与告警</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "设备故障通知", desc: "当设备出现故障时发送通知", checked: true },
                  { label: "设备离线告警", desc: "当设备离线超过5分钟时告警", checked: true },
                  { label: "能耗异常提醒", desc: "当能耗超过阈值时提醒", checked: true },
                  { label: "环境异常告警", desc: "当环境指标超标时告警", checked: true },
                  { label: "工单状态通知", desc: "工单状态变更时通知相关人员", checked: true },
                  { label: "每日运行报告", desc: "每天发送系统运行报告", checked: false },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-gray-300">{item.label}</Label>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <Switch defaultChecked={item.checked} />
                    </div>
                    <Separator className="mt-4 bg-white/10" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">通知方式</CardTitle>
                <CardDescription>选择接收通知的方式</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "站内消息", checked: true },
                  { label: "邮件通知", checked: true },
                  { label: "短信通知", checked: false },
                  { label: "微信通知", checked: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <Label className="text-gray-300">{item.label}</Label>
                    <Switch defaultChecked={item.checked} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5" />
                  安全设置
                </CardTitle>
                <CardDescription>配置系统安全策略</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">会话超时时间</Label>
                  <Select defaultValue="30">
                    <SelectTrigger className="border-white/10 bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15分钟</SelectItem>
                      <SelectItem value="30">30分钟</SelectItem>
                      <SelectItem value="60">1小时</SelectItem>
                      <SelectItem value="120">2小时</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">强制使用HTTPS</Label>
                    <p className="text-sm text-gray-500">始终使用安全连接</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">登录验证码</Label>
                    <p className="text-sm text-gray-500">登录时要求输入验证码</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">IP白名单</Label>
                    <p className="text-sm text-gray-500">只允许白名单IP访问</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">操作日志</CardTitle>
                <CardDescription>记录管理员操作历史</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">启用操作日志</Label>
                    <p className="text-sm text-gray-500">记录所有管理操作</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">日志保留时长</Label>
                  <Select defaultValue="90">
                    <SelectTrigger className="border-white/10 bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30天</SelectItem>
                      <SelectItem value="90">90天</SelectItem>
                      <SelectItem value="180">180天</SelectItem>
                      <SelectItem value="365">1年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Database className="h-5 w-5" />
                  数据配置
                </CardTitle>
                <CardDescription>配置数据存储与同步</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">自动备份</Label>
                    <p className="text-sm text-gray-500">每天自动备份系统数据</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator className="bg-white/10" />
                <div className="space-y-2">
                  <Label className="text-gray-300">数据刷新频率</Label>
                  <Select defaultValue="5">
                    <SelectTrigger className="border-white/10 bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1秒</SelectItem>
                      <SelectItem value="5">5秒</SelectItem>
                      <SelectItem value="10">10秒</SelectItem>
                      <SelectItem value="30">30秒</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">历史数据保留</Label>
                  <Select defaultValue="365">
                    <SelectTrigger className="border-white/10 bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90天</SelectItem>
                      <SelectItem value="180">180天</SelectItem>
                      <SelectItem value="365">1年</SelectItem>
                      <SelectItem value="730">2年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Globe className="h-5 w-5" />
                  第三方集成
                </CardTitle>
                <CardDescription>配置教务系统等第三方服务</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">教务系统API地址</Label>
                  <Input
                    placeholder="https://api.university.edu/course"
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">API密钥</Label>
                  <Input
                    type="password"
                    placeholder="••••••••••••••••"
                    className="border-white/10 bg-white/5 text-white"
                  />
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">自动同步课表</Label>
                    <p className="text-sm text-gray-500">每天同步最新课表数据</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button variant="outline" className="w-full border-white/10 bg-white/5">
                  测试连接
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
