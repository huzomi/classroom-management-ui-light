/**
 * 资产管理 API
 * /equipment + /equipmentTypeDO
 */
import { get, post } from "./client"

// ---------- 分页查询 ----------

export interface EquipmentPageDTO {
  page: number
  pageSize: number
  name?: string
  type?: number
  status?: number
  scrap?: number | null
}

export interface EquipmentPageVO {
  id: string
  name: string
  brand: string
  model: string
  group: number
  purchasingDate: string
  serviceLifeHour: number
  workingTime: number
  type: number
  typeName: string
  status: number
  buildingId: string
  floorId: string
  roomId: string
}

export interface EquipmentPageResult {
  records: EquipmentPageVO[]
  total: number
  size: number
  current: number
  pages: number
}

export function getEquipmentPage(params: EquipmentPageDTO) {
  return post<EquipmentPageResult>("/equipment/page", params)
}

// ---------- 新增 ----------

export interface EquipmentAddDTO {
  name: string
  brand: string
  model: string
  group: number
  type: number
  serviceLifeHour: number
  purchasingDate: string
  buildingId: string
  floorId: string
  roomId: string
}

export function addEquipment(data: EquipmentAddDTO) {
  return post<string>("/equipment/add", data)
}

// ---------- 修改 ----------

export interface EquipmentUpdateDTO extends EquipmentAddDTO {
  id: string
  status: number
}

export function updateEquipment(data: EquipmentUpdateDTO) {
  return post<string>("/equipment/update", data)
}

// ---------- 删除 ----------

export function deleteEquipment(ids: string[]) {
  return post<string>("/equipment/del", { ids })
}

// ---------- 详情 ----------

export interface EquipmentDetailVO {
  id: string
  address: string
  name: string
  brand: string
  model: string
  group: number
  purchasingDate: string
  serviceLifeHour: number
  workingTime: number
  type: number
  status: string
}

export function getEquipmentDetail(id: string) {
  return get<EquipmentDetailVO>(`/equipment/detail/${id}`)
}

// ---------- 状态统计 ----------

export interface EquipmentStatusCountVO {
  totalCount: number
  normalCount: number
  abnormalCount: number
  scrapCount: number
}

export function getEquipmentStatusCount() {
  return get<EquipmentStatusCountVO>("/equipment/count")
}

// ---------- 设备分类列表 ----------

export interface EquipmentTypeVO {
  type: number
  name: string
}

export function getEquipmentTypeList() {
  return get<EquipmentTypeVO[]>("/equipmentTypeDO/list")
}

/** 设备状态映射（0-正常 1-故障 2-报废） */
export const EQUIPMENT_STATUS_MAP: Record<number, { label: string; className: string }> = {
  0: { label: "正常", className: "text-green-600" },
  1: { label: "故障", className: "text-amber-600" },
  2: { label: "报废", className: "text-destructive" },
}

// ---------- 根据教室查询设备状态 ----------

export interface EquipmentStatusVO {
  joinnumId: string
  name: string
  value: string
  joinnum: number
}

export function getEquipmentStatusByRoom(roomId: string) {
  return get<EquipmentStatusVO[]>("/equipment/status", { roomId })
}

// ---------- 远程控制（上下课） ----------

export function remoteControl(roomIds: string[], value: number) {
  return post<unknown>("/edu/joinnum/remote/controls", { roomIds, value })
}

// ---------- 多教室设备控制 ----------

export function multiControlDevice(roomIds: string[], joinNum: number, value: number) {
  return post<unknown>("/edu/joinnum/remote/multicontroldevice", { roomIds, joinNum, value })
}

/** 统计卡片 → scrap 参数映射 */
export const SCRAP_FILTER_MAP = {
  all: undefined,
  normal: 2,
  abnormal: 3,
  scrap: 1,
} as const
