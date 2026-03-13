/**
 * 楼层管理 API
 * 对应接口: /common/floor
 */
import { post, put, del } from "./client"

/** 楼层编辑 DTO */
export interface FloorCommonEditDTO {
  id?: string
  name: string
  buildingId: string
  delFlag?: number
  sort?: number
  floorCode?: string
}

/** 楼层分页项 */
export interface FloorPageVO {
  id: string
  name?: string
  buildingId?: string
  delFlag?: number
  sort?: number
  floorCode?: string
  createTime?: string
  updateTime?: string
  buildingName?: string
  campusName?: string
}

/** 分页结果 */
interface FloorPageResult {
  records: FloorPageVO[]
  total: number
  size: number
  current: number
  pages: number
}

/** 分页查询参数 */
export interface FloorPageParams {
  page?: number
  pageSize?: number
  name?: string
  campusId?: string
  buildingId?: string
  sort?: number
  order?: string
}

/** 添加楼层 */
export function addFloor(data: FloorCommonEditDTO) {
  return post<string>("/common/floor/add", data)
}

/** 更新楼层 */
export function updateFloor(data: FloorCommonEditDTO) {
  return put<string>("/common/floor/update", data)
}

/** 删除楼层 */
export function deleteFloor(ids: string[]) {
  return del<string>("/common/floor/delete", { ids })
}

/** 分页查询楼层列表 */
export async function getFloorPage(params?: FloorPageParams): Promise<{
  records: FloorPageVO[]
  total: number
}> {
  const result = await post<FloorPageResult>("/common/floor/page", {
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 10,
    name: params?.name?.trim() || undefined,
    campusId: params?.campusId || undefined,
    buildingId: params?.buildingId || undefined,
    sort: params?.sort,
    order: params?.order,
  })
  return {
    records: result?.records ?? [],
    total: result?.total ?? 0,
  }
}
