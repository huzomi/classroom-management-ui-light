"use client"

import { useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Star, ChevronDown, ChevronUp, Plus, Save } from "lucide-react"
import { cn } from "@/lib/utils"

export interface EvaluationDimension {
  id: string
  name: string
  desc: string
  maxScore: number
}

const EVALUATION_DIMENSIONS: EvaluationDimension[] = [
  { id: "goal", name: "教学目标", desc: "目标明确，符合课程标准", maxScore: 10 },
  { id: "content", name: "内容组织", desc: "内容充实，逻辑清晰，重难点突出", maxScore: 20 },
  { id: "method", name: "教学方法", desc: "方法多样，启发式教学，师生互动", maxScore: 20 },
  { id: "language", name: "语言表达", desc: "普通话标准，语言准确流畅", maxScore: 10 },
  { id: "atmosphere", name: "课堂氛围", desc: "活跃有序，学生参与度高", maxScore: 20 },
  { id: "effect", name: "教学效果", desc: "学生理解掌握情况，课堂目标达成", maxScore: 20 },
]

export interface CourseInfo {
  room: string
  courseName: string
  teacher: string
  time: string
}

interface TeachingEvaluationSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseInfo: CourseInfo | null
  onSave?: (data: EvaluationFormData) => void
}

export interface EvaluationFormData {
  dimensions: Record<string, { score: number; comment?: string }>
  overallComment: string
  realtimeNotes: { time: string; content: string }[]
}

function StarRating({
  value,
  max = 5,
  onChange,
}: {
  value: number
  max?: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className="p-0.5 text-amber-500 hover:opacity-80 transition-opacity"
        >
          <Star
            className={cn("h-5 w-5", i < value ? "fill-amber-500" : "fill-none stroke-amber-500/50")}
          />
        </button>
      ))}
    </div>
  )
}

export function TeachingEvaluationSheet({
  open,
  onOpenChange,
  courseInfo,
  onSave,
}: TeachingEvaluationSheetProps) {
  const [dimensions, setDimensions] = useState<Record<string, { score: number; comment?: string }>>(
    Object.fromEntries(
      EVALUATION_DIMENSIONS.map((d) => [d.id, { score: Math.ceil(d.maxScore * 0.8), comment: "" }])
    )
  )
  const [overallComment, setOverallComment] = useState("")
  const [realtimeNotes, setRealtimeNotes] = useState<{ time: string; content: string }[]>([
    { time: "08:12", content: "导入环节生动，联系实际案例效果好" },
    { time: "08:35", content: "板书清晰，讲解递归算法时举例恰当" },
  ])
  const [newNote, setNewNote] = useState("")
  const [expandedDim, setExpandedDim] = useState<string | null>("content")

  // 切换教室时重置表单
  useEffect(() => {
    if (courseInfo && open) {
      setDimensions(
        Object.fromEntries(
          EVALUATION_DIMENSIONS.map((d) => [d.id, { score: Math.ceil(d.maxScore * 0.8), comment: "" }])
        )
      )
      setOverallComment("")
      setRealtimeNotes([
        { time: "08:12", content: "导入环节生动，联系实际案例效果好" },
        { time: "08:35", content: "板书清晰，讲解递归算法时举例恰当" },
      ])
      setExpandedDim("content")
    }
  }, [courseInfo?.room, open])

  const totalScore = EVALUATION_DIMENSIONS.reduce(
    (sum, d) => sum + (dimensions[d.id]?.score ?? 0),
    0
  )
  const maxTotal = EVALUATION_DIMENSIONS.reduce((sum, d) => sum + d.maxScore, 0)

  const handleDimensionScore = (id: string, stars: number) => {
    const dim = EVALUATION_DIMENSIONS.find((d) => d.id === id)!
    const score = Math.round((stars / 5) * dim.maxScore)
    setDimensions((prev) => ({
      ...prev,
      [id]: { ...prev[id], score: Math.min(score, dim.maxScore) },
    }))
  }

  const handleDimensionComment = (id: string, comment: string) => {
    setDimensions((prev) => ({ ...prev, [id]: { ...prev[id], comment } }))
  }

  const addRealtimeNote = () => {
    if (!newNote.trim()) return
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    setRealtimeNotes((prev) => [...prev, { time: timeStr, content: newNote.trim() }])
    setNewNote("")
  }

  const handleSave = () => {
    onSave?.({
      dimensions,
      overallComment,
      realtimeNotes,
    })
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  if (!courseInfo) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto flex flex-col p-0"
      >
        <SheetHeader className="shrink-0 border-b border-border px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <SheetTitle className="text-lg">听评课记录</SheetTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                地点：{courseInfo.room} · {courseInfo.courseName} · {courseInfo.teacher} · {courseInfo.time}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-lg font-semibold text-foreground">
                总分 {totalScore} / {maxTotal}
              </span>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* 评分量表 */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">评分量表</h3>
            <div className="space-y-3">
              {EVALUATION_DIMENSIONS.map((dim) => {
                const data = dimensions[dim.id] ?? { score: 0, comment: "" }
                const isExpanded = expandedDim === dim.id
                return (
                  <Card key={dim.id} className="border-border">
                    <Collapsible
                      open={isExpanded}
                      onOpenChange={(o) => setExpandedDim(o ? dim.id : null)}
                    >
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">{dim.desc}</p>
                            <div className="mt-2 flex items-center gap-4">
                              <StarRating
                                value={Math.round((data.score / dim.maxScore) * 5)}
                                onChange={(v) =>
                                  handleDimensionScore(dim.id, Math.round((v / 5) * dim.maxScore))
                                }
                              />
                              <span className="text-sm text-muted-foreground">
                                {data.score} / {dim.maxScore}
                              </span>
                            </div>
                          </div>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="pt-0 px-4 pb-4">
                          <Textarea
                            placeholder={`对「${dim.name}」的具体评价...`}
                            value={data.comment ?? ""}
                            onChange={(e) => handleDimensionComment(dim.id, e.target.value)}
                            className="min-h-[80px] resize-none"
                          />
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )
              })}
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-foreground">综合评语</label>
              <Textarea
                placeholder="对本次课程的整体评价与建议..."
                value={overallComment}
                onChange={(e) => setOverallComment(e.target.value)}
                className="mt-2 min-h-[100px] resize-none"
              />
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              {new Date().toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}{" "}
              巡课记录
            </p>
          </div>

          {/* 随堂记录 */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">随堂记录</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {realtimeNotes.map((note, i) => (
                <div
                  key={i}
                  className="flex gap-2 text-sm py-2 border-b border-border last:border-0"
                >
                  <span className="shrink-0 text-muted-foreground font-mono">{note.time}</span>
                  <span className="text-foreground">{note.content}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="添加随堂记录..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addRealtimeNote()}
                className="flex-1"
              />
              <Button size="icon" onClick={addRealtimeNote} className="shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <SheetFooter className="shrink-0 border-t border-border px-6 py-4 gap-2">
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            保存记录
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
