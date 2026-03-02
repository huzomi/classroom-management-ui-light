"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code, Play, Save, Download } from "lucide-react"

export default function ControlProgrammingPage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">中控编程</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            导入脚本
          </Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            保存
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">控制脚本</h3>
              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                <Play className="h-4 w-4" />
                测试运行
              </Button>
            </div>
            <div className="rounded-lg bg-accent p-4 font-mono text-sm">
              <div className="space-y-1">
                <div>
                  <span className="text-purple-500">function</span> <span className="text-blue-500">onClassStart</span>
                  () {"{"}
                </div>
                <div className="ml-4">
                  <span className="text-muted-foreground">// 开启投影仪</span>
                </div>
                <div className="ml-4">
                  device.projector.<span className="text-blue-500">turnOn</span>();
                </div>
                <div className="ml-4">
                  <span className="text-muted-foreground">// 开启灯光</span>
                </div>
                <div className="ml-4">
                  device.light.<span className="text-blue-500">setBrightness</span>(80);
                </div>
                <div className="ml-4">
                  <span className="text-muted-foreground">// 开启电脑</span>
                </div>
                <div className="ml-4">
                  device.computer.<span className="text-blue-500">powerOn</span>();
                </div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 font-semibold">执行日志</h3>
            <div className="space-y-2 rounded-lg bg-accent p-3 font-mono text-xs">
              <div className="text-green-500">[2024-01-15 10:30:15] 脚本开始执行</div>
              <div className="text-blue-500">[2024-01-15 10:30:16] 投影仪已开启</div>
              <div className="text-blue-500">[2024-01-15 10:30:17] 灯光亮度设置为80%</div>
              <div className="text-blue-500">[2024-01-15 10:30:18] 电脑已启动</div>
              <div className="text-green-500">[2024-01-15 10:30:19] 脚本执行完成</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 font-semibold">可用设备</h3>
            <div className="space-y-2">
              {["投影仪", "电脑", "灯光", "空调", "功放", "摄像头"].map((device) => (
                <div key={device} className="flex items-center justify-between rounded-lg bg-accent px-3 py-2">
                  <span className="text-sm">{device}</span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">
                    在线
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 font-semibold">快速插入</h3>
            <div className="space-y-2">
              {["开启设备", "关闭设备", "设置亮度", "设置音量", "延时等待"].map((action) => (
                <Button key={action} variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                  <Code className="h-4 w-4" />
                  {action}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
