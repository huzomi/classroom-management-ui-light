/**
 * 巡检记录 API - 巡检日历
 * POST /patrolDetail/calendar
 */
import { get, post } from "./client"

export interface PatrolCalendarDTO {
  queryDate: string
}

export interface PatrolCalendarVO {
  date: string
  patrolCount: number
  failCount: number
  status: number
}

/** 巡检日历：queryDate 格式 YYYY-MM-DD 00:00:00，返回往前一个月的数据 */
export function getPatrolCalendar(queryDate: string) {
  const formatted = queryDate.includes(" ") ? queryDate : `${queryDate} 00:00:00`
  return post<PatrolCalendarVO[]>("/patrolDetail/calendar", { queryDate: formatted })
}

// --- 巡检分页查询 ---

export interface PatrolDetailDTO {
  page: number
  pageSize: number
  createTime?: string
}

export interface PatrolDetailPageVO {
  id: string
  createTime: string
  campus: string
  building: string
  floor: string
  room: string
  status: number
  imgUrl1?: string
  deviceCount: number
}

export interface PatrolRecordPageResultVO {
  pageData: {
    records: PatrolDetailPageVO[]
    total: number
    size: number
    current: number
  }
  abnormalCount: number
  latestPatrolTime: string | null
  totalRoomCount: number
}

/** 巡检分页查询：createTime 格式 YYYY-MM-DD 00:00:00 */
export function getPatrolRecord(params: { page: number; pageSize: number; createTime?: string }) {
  const createTime = params.createTime
    ? params.createTime.includes(" ") ? params.createTime : `${params.createTime} 00:00:00`
    : undefined
  return post<PatrolRecordPageResultVO>("/patrolDetail/record", {
    page: params.page,
    pageSize: params.pageSize,
    createTime,
  })
}

// --- 巡检详情 ---

export interface PatrolDetailVO {
  campus: string
  building: string
  floor: string
  room: string
  createTime: string
  status: number
  imgUrls: string[]
  equipmentStatus: Record<string, number>
}

export function getPatrolDetail(patrolId: string) {
  return get<PatrolDetailVO>("/patrolDetail/detail", { patrolId })
}
