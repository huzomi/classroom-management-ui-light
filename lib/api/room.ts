/**
 * 教室管理 API - 分页查询教室面板
 * POST /common/room/search
 */
import { post } from "./client"

export interface RoomSearchDTO {
  buildingId?: string
  floorId?: string
  classRoom?: string
  status?: number
  isFault?: number
  page: number
  pageSize: number
}

export interface JoinnumStatusModel {
  joinNumId?: string
  joinNum?: number
  equipmentName?: string
  value?: string
  status?: number
}

export interface RoomSearchVO {
  roomId: string
  classRoom: string
  status: number
  isFault: number
  teacherName: string
  courseName: string
  lessonStartTime: string | null
  lessonEndTime: string | null
  environmentalInfo: Record<string, string>
  joinnumStatusModelList: JoinnumStatusModel[]
}

export interface PageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

/** 分页查询教室面板 */
export function searchRooms(data: RoomSearchDTO) {
  return post<PageResult<RoomSearchVO>>("/common/room/search", data)
}
