/**
 * 课表/教学周 API
 * /common/timetable
 */
import { get, post } from "./client"

// ---------- 当前教学周 ----------

export interface WeekInfo {
  semesterId: string
  week: number
  weekday: number
  semesterName?: string
  startDate?: string | null
  endDate?: string | null
  totalWeek?: number
  academyYear?: string
  semester?: string
  [key: string]: unknown
}

export function getCurrentWeekInfo() {
  return get<WeekInfo>("/common/timetable/now")
}

// ---------- 课表数量统计 ----------

export interface TimetableNumDTO {
  semesterId: string
  week: string
  roomId?: string
  weekday?: number
}

export interface TimetableClassNumVO {
  all: number
  will: number
  over: number
  ing: number
}

export function getTimetableNum(params: TimetableNumDTO) {
  return post<TimetableClassNumVO>("/common/timetable/num", params)
}

// ---------- 课表列表 ----------

export interface TimetableDTO {
  semesterId?: string
  week?: string
  roomId?: string
  weekday?: number
}

export interface TimetableDO {
  id: string
  semesterId: string
  week: string
  weekday: string
  lessons: string
  roomId: string
  roomName: string
  teacherId: string
  jobNumber: string
  teacherName: string
  teacherAcademyId: string
  courseId: string
  courseName: string
  wid: string
  className: string
  classAcademyId: string
  reserveId: string
  attendNum: number
  type: number
  isDelete: number
  lessonStartTime: string | null
  lessonEndTime: string | null
  createTime: string
  updateTime: string
}

export function getTimetableList(params: TimetableDTO) {
  return post<TimetableDO[]>("/common/timetable/list", params)
}
