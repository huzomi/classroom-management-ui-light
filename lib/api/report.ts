/**
 * 报表统计 API
 * 页面 A: /report/* + /operationLog/room/useTime
 * 页面 B: /common/room/bigScreen
 */
import { get, post } from "./client"

// ── 通用筛选参数（页面 A 四个接口共用） ──

export interface ReportFilterDTO {
  sort: number
  year?: number
  month?: number
  season?: string
}

export interface ReportPageDTO extends ReportFilterDTO {
  page: number
  pageSize: number
}

// ── 季节映射（前端 value → 后端中文） ──

export const SEASON_MAP: Record<string, string> = {
  "1": "春季",
  "2": "夏季",
  "3": "秋季",
  "4": "冬季",
}

// ── 3.1 刷卡教室排行 ──

export interface RoomRankVO {
  roomCode: string
  payCount: number
}

export interface RoomRankPageResult {
  records: RoomRankVO[]
  total: number
  size: number
  current: number
  pages: number
}

export function getRoomRankPage(params: ReportPageDTO) {
  return post<RoomRankPageResult>("/report/room/page", params)
}

// ── 3.2 学院刷卡活跃度排名 ──

export interface CollegeRankVO {
  college: string
  payCount: number
}

export interface CollegeRankPageResult {
  records: CollegeRankVO[]
  total: number
  size: number
  current: number
  pages: number
}

export function getCollegeRankPage(params: ReportPageDTO) {
  return post<CollegeRankPageResult>("/report/college/page", params)
}

// ── 3.3 刷卡达人榜 ──

export interface PersonalRankVO {
  name: string
  cardNo: string
  college: string
  payCount: number
}

export interface PersonalRankPageResult {
  records: PersonalRankVO[]
  total: number
  size: number
  current: number
  pages: number
}

export function getPersonalRankPage(params: ReportPageDTO) {
  return post<PersonalRankPageResult>("/report/personal/page", params)
}

// ── 3.4 使用教室排名（非分页） ──

export interface RoomUseTimeVO {
  roomName: string
  time: number
}

export function getRoomUseTime(params: ReportFilterDTO) {
  return post<RoomUseTimeVO[]>("/operationLog/room/useTime", params)
}

// ── 4.1 大屏数据 ──

export interface BigScreenVO {
  classRoomCount: {
    regularClassroomCount: number
    smartClassroomCount: number
  }
  classUse: {
    campus: string
    building: string
    campusId: string
    buildingId: string
    classroomCount: number
    usedCount: number
    idleCount: number
  }[]
  classUseTime: {
    useTimeMax: number
    useTimeMin: number
  }
  latestWorkOrderRecord: {
    workOrderId: string
    description: string
    createTime: string
  }[]
  classRoomStatus: {
    progressCount: number
    idleCount: number
    faultCount: number
    offlineCount: number
  }
  equipmentCount: Record<string, number>
  equipmentStatus: Record<string, Record<string, number>> | null
}

export function getBigScreenData() {
  return get<BigScreenVO>("/common/room/bigScreen")
}
