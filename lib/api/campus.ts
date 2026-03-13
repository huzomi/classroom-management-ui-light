/**
 * 校区管理 API - 空间架构树形数据
 * 对应 API_DOC: GET /common/campus/tree
 */
import { get } from "./client"

export interface CampusBuildingFloorTreeVO {
  id: string
  name: string
  campusCode: string
  buildings: {
    id: string
    name: string
    buildingCode: string
    floors: {
      id: string
      name: string
      floorCode: string
      rooms: {
        id: string
        name: string
        roomCode: string
      }[]
    }[]
  }[]
}

/** 查询校区-楼栋-楼层树形结构 */
export function getCampusTree() {
  return get<CampusBuildingFloorTreeVO[]>("/common/campus/tree")
}
