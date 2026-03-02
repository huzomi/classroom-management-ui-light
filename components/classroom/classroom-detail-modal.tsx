"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  User,
  BookOpen,
  Thermometer,
  Droplets,
  Wind,
  Leaf,
  Sun,
  Activity,
  Zap,
  Video,
  Lightbulb,
  AirVentIcon as AirConditioner,
  Monitor,
  Volume2,
  Power,
  PowerOff,
  Camera,
  MonitorPlay,
} from "lucide-react"

interface ClassroomDetailModalProps {
  classroomId: string
  onClose: () => void
}

export function ClassroomDetailModal({ classroomId, onClose }: ClassroomDetailModalProps) {
  const [activeCamera, setActiveCamera] = useState<"teacher" | "student" | "desktop">("teacher")

  // Mock classroom data
  const classroom = {
    id: classroomId,
    name: `${classroomId}教室`,
    status: "in-class",
    teacher: "张老师",
    course: "高等数学",
    temperature: 24,
    humidity: 45,
    pm25: 12,
    co2: 450,
    formaldehyde: 0.02,
    tvoc: 0.15,
    light: 450,
    energyConsumption: 3.5,
    devices: {
      projector: { online: true, status: "on" },
      lights: { online: true, status: "on", brightness: 80 },
      ac: { online: true, status: "on", temperature: 24 },
      computer: { online: true, status: "on" },
      amplifier: { online: true, status: "on", volume: 75 },
    },
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            {classroom.name}
            <Badge className="bg-blue-500">上课中</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList>
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="control">设备控制</TabsTrigger>
            <TabsTrigger value="monitor">实时监控</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Course Info */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">课程信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">授课教师</div>
                    <div className="font-medium">{classroom.teacher}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">课程名称</div>
                    <div className="font-medium">{classroom.course}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Environmental Data */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">环境信息</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <Thermometer className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">温度</div>
                    <div className="text-2xl font-bold">{classroom.temperature}°C</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Droplets className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">湿度</div>
                    <div className="text-2xl font-bold">{classroom.humidity}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-100 dark:bg-gray-900/20 rounded-lg">
                    <Wind className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">PM2.5</div>
                    <div className="text-2xl font-bold">{classroom.pm25}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Leaf className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">CO₂</div>
                    <div className="text-2xl font-bold">{classroom.co2} ppm</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Activity className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">甲醛</div>
                    <div className="text-2xl font-bold">{classroom.formaldehyde} mg/m³</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <Sun className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">光照度</div>
                    <div className="text-2xl font-bold">{classroom.light} lx</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Energy & Device Status */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  能耗监测
                </h3>
                <div className="text-3xl font-bold">{classroom.energyConsumption} kWh</div>
                <div className="text-sm text-muted-foreground mt-1">当前功率</div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">设备状态</h3>
                <div className="space-y-2">
                  {Object.entries(classroom.devices).map(([key, device]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{key}</span>
                      <Badge variant={device.online ? "default" : "secondary"}>{device.online ? "在线" : "离线"}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Control Tab */}
          <TabsContent value="control" className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">快捷控制</h3>
              <div className="flex items-center gap-3">
                <Button className="flex-1">
                  <Power className="h-4 w-4 mr-2" />
                  一键上课
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <PowerOff className="h-4 w-4 mr-2" />
                  一键下课
                </Button>
              </div>
            </Card>

            {/* Device Controls */}
            <div className="grid grid-cols-2 gap-6">
              {/* Projector */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Video className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold">投影仪</h3>
                  </div>
                  <Switch checked={classroom.devices.projector.status === "on"} />
                </div>
                <Badge variant={classroom.devices.projector.online ? "default" : "secondary"}>
                  {classroom.devices.projector.online ? "在线" : "离线"}
                </Badge>
              </Card>

              {/* Lights */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-semibold">灯光</h3>
                  </div>
                  <Switch checked={classroom.devices.lights.status === "on"} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">亮度</span>
                    <span className="font-medium">{classroom.devices.lights.brightness}%</span>
                  </div>
                  <Slider defaultValue={[classroom.devices.lights.brightness]} max={100} step={1} />
                </div>
              </Card>

              {/* Air Conditioner */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <AirConditioner className="h-5 w-5 text-cyan-500" />
                    <h3 className="font-semibold">空调</h3>
                  </div>
                  <Switch checked={classroom.devices.ac.status === "on"} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">温度</span>
                    <span className="font-medium">{classroom.devices.ac.temperature}°C</span>
                  </div>
                  <Slider defaultValue={[classroom.devices.ac.temperature]} min={16} max={30} step={1} />
                </div>
              </Card>

              {/* Computer */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">台式机</h3>
                  </div>
                  <Switch checked={classroom.devices.computer.status === "on"} />
                </div>
                <Badge variant={classroom.devices.computer.online ? "default" : "secondary"}>
                  {classroom.devices.computer.online ? "在线" : "离线"}
                </Badge>
              </Card>

              {/* Amplifier */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold">功放</h3>
                  </div>
                  <Switch checked={classroom.devices.amplifier.status === "on"} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">音量</span>
                    <span className="font-medium">{classroom.devices.amplifier.volume}%</span>
                  </div>
                  <Slider defaultValue={[classroom.devices.amplifier.volume]} max={100} step={1} />
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Monitor Tab */}
          <TabsContent value="monitor" className="space-y-6">
            {/* Camera Selector */}
            <div className="flex items-center gap-3">
              <Button
                variant={activeCamera === "teacher" ? "default" : "outline"}
                onClick={() => setActiveCamera("teacher")}
              >
                <Camera className="h-4 w-4 mr-2" />
                教师通道
              </Button>
              <Button
                variant={activeCamera === "student" ? "default" : "outline"}
                onClick={() => setActiveCamera("student")}
              >
                <Camera className="h-4 w-4 mr-2" />
                学生通道
              </Button>
              <Button
                variant={activeCamera === "desktop" ? "default" : "outline"}
                onClick={() => setActiveCamera("desktop")}
              >
                <MonitorPlay className="h-4 w-4 mr-2" />
                台式机画面
              </Button>
            </div>

            {/* Video Display */}
            <Card className="p-6">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    {activeCamera === "teacher" && "教师通道摄像头"}
                    {activeCamera === "student" && "学生通道摄像头"}
                    {activeCamera === "desktop" && "台式机桌面画面"}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
