/**
 * 课表管理 API
 * /common/timetable
 */
import { get, post } from "./client"

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

/** 查询课表列表 */
export function getTimetableList(params: TimetableDTO) {
  return post<TimetableDO[]>("/common/timetable/list", params)
}

export interface WeekInfo {
  semesterId: string
  week: number
  weekday: number
  [key: string]: unknown
}

/** 获取当前学期/周信息 */
export function getCurrentWeekInfo() {
  return get<WeekInfo>("/common/timetable/now")
}
