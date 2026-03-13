"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { getTaskLogPage, type TaskLogVO } from "@/lib/api/taskLog"

const STATUS_MAP: Record<number, { text: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  0: { text: "待执行", variant: "secondary" },
  1: { text: "执行中", variant: "default" },
  2: { text: "已完成", variant: "outline" },
  3: { text: "执行失败", variant: "destructive" },
}

interface TaskLogModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId: string | null
  taskName?: string
}

export function TaskLogModal({ open, onOpenChange, taskId, taskName }: TaskLogModalProps) {
  const [logs, setLogs] = useState<TaskLogVO[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const loadLogs = useCallback(async () => {
    if (!taskId) return
    setLoading(true)
    try {
      const { records, total: t } = await getTaskLogPage({
        page,
        pageSize,
        id: taskId,
      })
      setLogs(records)
      setTotal(t)
    } catch (err) {
      console.error("加载任务日志失败:", err)
      setLogs([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [taskId, page])

  useEffect(() => {
    if (open && taskId) {
      setPage(1)
    }
  }, [open, taskId])

  useEffect(() => {
    if (open && taskId) {
      loadLogs()
    } else {
      setLogs([])
      setTotal(0)
    }
  }, [open, taskId, page, loadLogs])

  const totalPages = Math.ceil(total / pageSize) || 1
  const startIndex = (page - 1) * pageSize

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>任务执行日志{taskName ? ` - ${taskName}` : ""}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto px-6 pb-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : logs.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">暂无日志</div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-20 text-center font-semibold">序号</TableHead>
                      <TableHead className="w-28 text-center font-semibold">JoinNum</TableHead>
                      <TableHead className="w-36 font-semibold">Value</TableHead>
                      <TableHead className="w-24 text-center font-semibold">状态</TableHead>
                      <TableHead className="font-semibold">执行时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log, idx) => {
                      const statusConfig = STATUS_MAP[log.status ?? 0] ?? { text: "未知", variant: "secondary" as const }
                      return (
                        <TableRow key={log.id ?? idx}>
                          <TableCell className="text-center">{startIndex + idx + 1}</TableCell>
                          <TableCell className="text-center">{log.joinNum ?? "-"}</TableCell>
                          <TableCell>{log.value ?? "-"}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={statusConfig.variant}>{statusConfig.text}</Badge>
                          </TableCell>
                          <TableCell>{log.createTime ?? "-"}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    共 {total} 条，第 {page}/{totalPages} 页
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
