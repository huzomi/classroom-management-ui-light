"use client"

import { Input } from "@/components/ui/input"
import { Search, CreditCard, Clock, MapPin, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function CardLogsPage() {
  const cardLogs = [
    { id: 1, teacher: "张老师", cardNo: "8888", classroom: "101教室", time: "2024-01-15 08:28:15", status: "成功" },
    { id: 2, teacher: "李老师", cardNo: "8889", classroom: "102教室", time: "2024-01-15 10:43:22", status: "成功" },
    { id: 3, teacher: "王老师", cardNo: "8890", classroom: "201教室", time: "2024-01-15 14:18:45", status: "成功" },
    { id: 4, teacher: "赵老师", cardNo: "8891", classroom: "103教室", time: "2024-01-15 16:05:33", status: "失败" },
  ]

  return (
    <div className="flex-1 overflow-auto bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">刷卡日志</h1>
          <p className="mt-1 text-sm text-muted-foreground">记录教师刷卡开门记录</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索教师或卡号..." className="pl-10" />
        </div>

        <div className="space-y-2">
          {cardLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                  <CreditCard className="h-5 w-5 text-purple-400" />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">{log.teacher}</span>
                    <Badge variant="outline" className="text-xs">
                      卡号: {log.cardNo}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{log.classroom}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge variant={log.status === "成功" ? "default" : "destructive"}>
                  <CheckCircle className="mr-1 h-3 w-3" />
                  {log.status}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{log.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
