"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Building2 } from "lucide-react"

export default function BuildingsPage() {
  const buildings = [
    { id: 1, name: "第一教学楼", code: "A", floors: 5, classrooms: 120, status: "active" },
    { id: 2, name: "第二教学楼", code: "B", floors: 6, classrooms: 150, status: "active" },
    { id: 3, name: "第三教学楼", code: "C", floors: 4, classrooms: 100, status: "active" },
    { id: 4, name: "实验楼", code: "D", floors: 8, classrooms: 200, status: "active" },
  ]

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">教学楼管理</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          添加教学楼
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="搜索教学楼..." className="pl-9" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {buildings.map((building) => (
          <div key={building.id} className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{building.name}</h3>
                  <p className="text-sm text-muted-foreground">楼栋代码: {building.code}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                运行中
              </Badge>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">{building.floors}</div>
                <div className="text-sm text-muted-foreground">楼层数</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{building.classrooms}</div>
                <div className="text-sm text-muted-foreground">教室数</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                <Edit className="h-4 w-4" />
                编辑
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
                删除
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
