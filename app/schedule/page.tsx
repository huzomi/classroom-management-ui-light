"use client"

import { Calendar, Clock, Search, Plus, Download, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const timeSlots = ["08:00", "10:00", "14:00", "16:00", "19:00"]
const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]

export default function SchedulePage() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0a] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">课表排课</h1>
            <p className="mt-1 text-sm text-gray-400">教学课程安排与管理</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-white/10 bg-white/5">
              <Upload className="mr-2 h-4 w-4" />
              导入课表
            </Button>
            <Button variant="outline" className="border-white/10 bg-white/5">
              <Download className="mr-2 h-4 w-4" />
              导出课表
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              新建课程
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Filters */}
          <Card className="border-white/10 bg-white/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="搜索课程、教师、教室..."
                    className="border-white/10 bg-white/5 pl-10 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Grid */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">本周课表</CardTitle>
                  <CardDescription>2024年第3周 (1月15日 - 1月21日)</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    上一周
                  </Button>
                  <Button variant="ghost" size="sm">
                    下一周
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="p-3 text-left text-sm font-medium text-gray-400">时间</th>
                      {weekDays.map((day) => (
                        <th key={day} className="p-3 text-center text-sm font-medium text-gray-400">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((time, timeIndex) => (
                      <tr key={time} className="border-b border-white/10">
                        <td className="p-3 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {time}
                          </div>
                        </td>
                        {weekDays.map((day, dayIndex) => {
                          const hasCourse = Math.random() > 0.3
                          return (
                            <td key={day} className="p-2">
                              {hasCourse ? (
                                <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 hover:bg-blue-500/20 transition-colors cursor-pointer">
                                  <p className="text-sm font-medium text-white">高等数学</p>
                                  <p className="mt-1 text-xs text-gray-400">张老师</p>
                                  <p className="mt-1 text-xs text-gray-500">101教室</p>
                                  <Badge variant="outline" className="mt-2 text-xs border-blue-500/50 text-blue-400">
                                    已排课
                                  </Badge>
                                </div>
                              ) : (
                                <div className="flex h-full min-h-[100px] items-center justify-center rounded-lg border border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 transition-colors cursor-pointer">
                                  <Plus className="h-5 w-5 text-gray-600" />
                                </div>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Course List */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">课程列表</CardTitle>
              <CardDescription>所有已排课程</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "高等数学", teacher: "张老师", room: "101", time: "周一 08:00-09:40", students: 120 },
                  { name: "大学英语", teacher: "李老师", room: "102", time: "周一 10:00-11:40", students: 80 },
                  { name: "计算机基础", teacher: "王老师", room: "103", time: "周二 14:00-15:40", students: 100 },
                  { name: "物理实验", teacher: "刘老师", room: "201", time: "周三 14:00-16:40", students: 45 },
                ].map((course, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                        <Calendar className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{course.name}</p>
                        <p className="mt-1 text-sm text-gray-400">
                          {course.teacher} · {course.room}教室 · {course.students}人
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">{course.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        编辑
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        删除
                      </Button>
                    </div>
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
