/**
 * 教学楼管理 API
 * 对应接口: /common/building
 */
import { post, put, del, get } from "./client"

/** 教学楼编辑 DTO */
export interface BuildingCommonEditDTO {
  id?: string
  name: string
  sort?: number
  buildingCode?: string
  campusId: string
  departId?: string
  lon?: number
  lat?: number
}

/** 教学楼分页项 */
export interface BuildingPageVO {
  id: string
  name?: string
  delFlag?: number
  sort?: number
  buildingCode?: string
  campusId?: string
  departId?: string | number
  lon?: number
  lat?: number
  campusName?: string
  createTime?: string
  updateTime?: string
}

/** 分页结果 */
interface BuildingPageResult {
  records: BuildingPageVO[]
  total: number
  size: number
  current: number
  pages: number
}

/** 分页查询参数 */
export interface BuildingPageParams {
  page?: number
  pageSize?: number
  name?: string
  campusId?: string
  sort?: number
  order?: string
}

/** 添加教学楼 */
export function addBuilding(data: BuildingCommonEditDTO) {
  return post<string>("/common/building/add", data)
}

/** 更新教学楼 */
export function updateBuilding(data: BuildingCommonEditDTO) {
  return put<string>("/common/building/update", data)
}

/** 删除教学楼 */
export function deleteBuilding(ids: string[]) {
  return del<string>("/common/building/delete", { ids })
}

/** 分页查询教学楼列表 */
export async function getBuildingPage(params?: BuildingPageParams): Promise<{
  records: BuildingPageVO[]
  total: number
}> {
  const result = await post<BuildingPageResult>("/common/building/page", {
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 10,
    name: params?.name?.trim() || undefined,
    campusId: params?.campusId || undefined,
    sort: params?.sort,
    order: params?.order,
  })
  return {
    records: result?.records ?? [],
    total: result?.total ?? 0,
  }
}

/**
 * 楼栋/楼层/教室列表 API
 * 用于新增报修等场景的级联选择
 */


export interface BuildingListVO {
  id: string
  name: string
}

export interface FloorListVO {
  id: string
  name: string
}

export interface RoomListVO {
  id: string
  name: string
}

/** 楼栋列表 GET /common/building/list */
export function getBuildingList(campusId?: string) {
  return get<BuildingListVO[]>("/common/building/list", campusId ? { campusId } : undefined)
}

/** 楼层列表 GET /common/floor/list?buildingId=xxx */
export function getFloorList(buildingId: string) {
  return get<FloorListVO[]>("/common/floor/list", { buildingId })
}

/** 教室列表 GET /common/room/list?buildingId=xxx&floorId=xxx */
export function getRoomList(buildingId: string, floorId: string) {
  return get<RoomListVO[]>("/common/room/list", { buildingId, floorId })
}
