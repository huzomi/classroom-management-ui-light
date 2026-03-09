/**
 * 教室管理 API - 占位实现
 * TODO: 将 Mock 数据替换为真实 API 调用
 */

import type { RoomData } from "@/components/classroom/room-card"

const MOCK_ROOMS: RoomData[] = [
  {
    id: "a101",
    name: "A101",
    building: "教学楼A",
    floor: "1楼",
    status: "teaching",
    currentCourse: {
      name: "数据结构与算法",
      teacher: "张教授",
      time: "08:00-09:40",
    },
    devices: { pc: "online", projector: "online", light: "on", ac: "on", door: "locked" },
    iotInfo: { controller: "online" },
    environment: { temp: 24, humidity: 55, co2: 480 },
    power: 2450,
  },
  {
    id: "a102",
    name: "A102",
    building: "教学楼A",
    floor: "1楼",
    status: "idle",
    devices: { pc: "online", projector: "online", light: "off", ac: "off", door: "unlocked" },
    iotInfo: { controller: "online" },
    environment: { temp: 22, humidity: 52, co2: 420 },
    power: 120,
  },
  {
    id: "a103",
    name: "A103",
    building: "教学楼A",
    floor: "1楼",
    status: "fault",
    faultType: "mini-program",
    devices: { pc: "offline", projector: "online", light: "on", ac: "on", door: "locked" },
    iotInfo: { controller: "offline" },
    environment: { temp: 25, humidity: 58, co2: 510 },
    power: 1800,
  },
  {
    id: "a201",
    name: "A201",
    building: "教学楼A",
    floor: "2楼",
    status: "teaching",
    currentCourse: { name: "线性代数", teacher: "李教授", time: "08:00-09:40" },
    devices: { pc: "online", projector: "online", light: "on", ac: "on", door: "locked" },
    iotInfo: { controller: "online" },
    environment: { temp: 23, humidity: 54, co2: 520 },
    power: 2380,
  },
  {
    id: "a202",
    name: "A202",
    building: "教学楼A",
    floor: "2楼",
    status: "exam",
    currentCourse: { name: "期中考试", teacher: "监考组", time: "09:00-11:00" },
    devices: { pc: "online", projector: "offline", light: "on", ac: "on", door: "locked" },
    iotInfo: { controller: "online" },
    environment: { temp: 23, humidity: 50, co2: 580 },
    power: 1650,
  },
  {
    id: "a203",
    name: "A203",
    building: "教学楼A",
    floor: "2楼",
    status: "self-study",
    devices: { pc: "online", projector: "online", light: "on", ac: "on", door: "unlocked" },
    iotInfo: { controller: "online" },
    environment: { temp: 21, humidity: 48, co2: 400 },
    power: 1200,
  },
  {
    id: "b101",
    name: "B101",
    building: "教学楼B",
    floor: "1楼",
    status: "teaching",
    currentCourse: { name: "大学英语", teacher: "王老师", time: "08:00-09:40" },
    devices: { pc: "online", projector: "online", light: "on", ac: "on", door: "locked" },
    iotInfo: { controller: "online" },
    environment: { temp: 24, humidity: 56, co2: 490 },
    power: 2200,
  },
  {
    id: "b102",
    name: "B102",
    building: "教学楼B",
    floor: "1楼",
    status: "fault",
    faultType: "ip-phone",
    devices: { pc: "online", projector: "offline", light: "off", ac: "off", door: "unlocked" },
    iotInfo: { controller: "online" },
    environment: { temp: 22, humidity: 50, co2: 410 },
    power: 95,
  },
  {
    id: "a301",
    name: "A301",
    building: "教学楼A",
    floor: "3楼",
    status: "abnormal",
    abnormalType: "class-no-power",
    currentCourse: { name: "高等数学", teacher: "陈教授", time: "08:00-09:40" },
    devices: { pc: "offline", projector: "offline", light: "off", ac: "off", door: "unlocked" },
    iotInfo: { controller: "online" },
    environment: { temp: 21, humidity: 48, co2: 380 },
    power: 50,
  },
  {
    id: "a302",
    name: "A302",
    building: "教学楼A",
    floor: "3楼",
    status: "abnormal",
    abnormalType: "no-class-power-on",
    devices: { pc: "online", projector: "online", light: "on", ac: "on", door: "unlocked" },
    iotInfo: { controller: "online" },
    environment: { temp: 24, humidity: 52, co2: 420 },
    power: 2100,
  },
]

/** 获取教室列表 - 支持筛选参数 */
export async function fetchClassrooms(params?: {
  building?: string
  floor?: string
  status?: string
  search?: string
}): Promise<RoomData[]> {
  // TODO: 替换为真实 API: const res = await fetch(`/api/classrooms?${new URLSearchParams(params)}`)
  await new Promise((r) => setTimeout(r, 100)) // 模拟网络延迟
  let filtered = [...MOCK_ROOMS]
  if (params?.building) filtered = filtered.filter((r) => r.building === params.building)
  if (params?.floor) filtered = filtered.filter((r) => r.floor === params.floor)
  if (params?.status && params.status !== "all")
    filtered = filtered.filter((r) => r.status === params.status)
  if (params?.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter((r) => r.name.toLowerCase().includes(q))
  }
  return filtered
}
