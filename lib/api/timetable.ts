/**
 * 课表/教学周 API
 * 对应接口: GET /common/timetable/now, POST /common/timetable/num
 */
import { get, post } from "./client"

/** 当前教学周响应 */
export interface TimetableNowVO {
  semesterId: string
  semesterName: string
  startDate: string | null
  endDate: string | null
  totalWeek: number
  academyYear: string
  semester: string
  week: number
  weekday: number
}

/** 获取当前教学周 */
export function getTimetableNow() {
  return get<TimetableNowVO>("/common/timetable/now")
}

/** 课表数量统计请求 */
export interface TimetableNumDTO {
  semesterId: string
  week: string
  roomId?: string
  weekday?: number
}

/** 课表数量统计响应 */
export interface TimetableClassNumVO {
  all: number
  will: number
  over: number
  ing: number
}

/** 获取本周课表数量统计 */
export function getTimetableNum(params: TimetableNumDTO) {
  return post<TimetableClassNumVO>("/common/timetable/num", params)
}

/** 课表列表请求 */
export interface TimetableListDTO {
  semesterId: string
  week: string
  roomId?: string
  weekday?: number
}

/** 课表列表项 */
export interface TimetableDO {
  id: string
  semesterId?: string
  week?: string
  weekday?: string
  lessons?: string
  roomId?: string
  roomName?: string
  teacherId?: string
  jobNumber?: string
  teacherName?: string
  courseId?: string
  courseName?: string
  className?: string
}

/** 获取课表列表 */
export function getTimetableList(params: TimetableListDTO) {
  return post<TimetableDO[] | null>("/common/timetable/list", params)
}
