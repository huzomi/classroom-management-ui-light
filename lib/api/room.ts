/**
 * 教室管理 API
 * 对应接口: /common/room
 */
import { post, put, del } from "./client"

/** 教室编辑 DTO */
export interface RoomCommonEditDTO {
  id?: string
  name: string
  roomCode?: string
  campusId: string
  buildingId: string
  floorId: string
  streamId?: number
  roomType?: number
  seatNum?: number
  examSeatNum?: number
  stopTaskState?: number
  isDelete?: number
  regionId?: string
  regionName?: string
}

/** 教室分页项 */
export interface RoomPageVO {
  id: string
  name?: string
  roomCode?: string
  campusId?: string
  buildingId?: string
  floorId?: string
  streamId?: number
  roomType?: number
  seatNum?: number
  examSeatNum?: number
  stopTaskState?: number
  isDelete?: number
  regionId?: string
  regionName?: string
  createTime?: string
  updateTime?: string
  campusName?: string
  buildingName?: string
  floorName?: string
}

/** 分页结果 */
interface RoomPageResult {
  records: RoomPageVO[]
  total: number
  size: number
  current: number
  pages: number
}

/** 分页查询参数 */
export interface RoomPageParams {
  page?: number
  pageSize?: number
  name?: string
  campusId?: string
  buildingId?: string
  floorId?: string
  sort?: number
  order?: string
}

/** 添加教室 */
export function addRoom(data: RoomCommonEditDTO) {
  return post<string>("/common/room/add", data)
}

/** 更新教室 */
export function updateRoom(data: RoomCommonEditDTO) {
  return put<string>("/common/room/update", data)
}

/** 删除教室 */
export function deleteRoom(ids: string[]) {
  return del<string>("/common/room/delete", { ids })
}

/** 分页查询教室列表 */
export async function getRoomPage(params?: RoomPageParams): Promise<{
  records: RoomPageVO[]
  total: number
}> {
  const result = await post<RoomPageResult>("/common/room/page", {
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 10,
    name: params?.name?.trim() || undefined,
    campusId: params?.campusId || undefined,
    buildingId: params?.buildingId || undefined,
    floorId: params?.floorId || undefined,
    sort: params?.sort,
    order: params?.order,
  })
  return {
    records: result?.records ?? [],
    total: result?.total ?? 0,
  }
}
