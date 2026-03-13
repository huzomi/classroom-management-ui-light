/**
 * 楼栋/楼层/教室列表 API
 * 用于新增报修等场景的级联选择
 */
import { get } from "./client"

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
