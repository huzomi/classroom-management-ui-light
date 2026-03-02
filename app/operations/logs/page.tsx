"use client"

import { Input } from "@/components/ui/input"
import { Search, User, Clock, Monitor } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function OperationLogsPage() {
  const logs = [
    { id: 1, user: "张老师", action: "开启投影", classroom: "101教室", time: "2024-01-15 08:30:25", type: "设备控制" },
    { id: 2, user: "李老师", action: "关闭空调", classroom: "102教室", time: "2024-01-15 10:45:12", type: "设备控制" },
    {
      id: 3,
      user: "管理员",
      action: "批量上课",
      classroom: "第一教学楼",
      time: "2024-01-15 08:00:00",
      type: "批量操作",
    },
    { id: 4, user: "王老师", action: "调整灯光", classroom: "201教室", time: "2024-01-15 14:20:33", type: "设备控制" },
  ]

  return (
    <div className="flex-1 overflow-auto bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">操作日志</h1>
          <p className="mt-1 text-sm text-muted-foreground">记录所有用户操作行为</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索用户或操作..." className="pl-10" />
        </div>

        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                  <User className="h-5 w-5 text-blue-400" />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">{log.user}</span>
                    <Badge variant="outline" className="text-xs">
                      {log.type}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{log.action}</span>
                    <span>•</span>
                    <Monitor className="h-3 w-3" />
                    <span>{log.classroom}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
