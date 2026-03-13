/**
 * 故障报修 API
 */
import { get, post } from "./client"

export interface WorkOrderPageDTO {
  page: number
  pageSize: number
  status?: number
  faultType?: number
  buildingId?: string
  floorId?: string
  roomId?: string
}

export interface WorkOrderPageVO {
  id: string
  title: string
  address: string
  faultType: string
  description: string
  createUser: string
  createTime: string
  status: string
}

export interface WorkOrderPageResult {
  records: WorkOrderPageVO[]
  total: number
  size: number
  current: number
  pages: number
}

/** 故障报修分页查询 */
export function getWorkOrderPage(params: WorkOrderPageDTO) {
  return post<WorkOrderPageResult>("/workOrder/page", params)
}

export interface WorkOrderAddDTO {
  buildingId: string
  floorId: string
  roomId: string
  title: string
  /** 1-设备故障；2-网络故障；3-电路故障；4-其他故障 */
  faultType: number
  description?: string
  /** 0-未处理 */
  status?: number
}

/** 新增故障报修 */
export function addWorkOrder(data: WorkOrderAddDTO) {
  return post<string>("/workOrder/add", data)
}

export interface WorkOrderProgressVO {
  createTime: string
  title: string
  content: string
}

/** 查看处理进度 */
export function getWorkOrderProgress(orderId: string) {
  return get<WorkOrderProgressVO[]>("/workOrder/progress", { orderId })
}

/** 撤销故障报修 */
export function delWorkOrder(orderId: string) {
  return post<string>("/workOrder/del", { orderId })
}

export interface WorkOrderSubmitProgressDTO {
  workId: string
  equipmentId?: string
  /** 0-未处理；1-延后处理；2-已解决；3-不需要处理 */
  status: number
  handleDetail?: string
}

/** 提交工单处理流程 */
export function submitWorkOrderProgress(data: WorkOrderSubmitProgressDTO) {
  return post<string>("/workOrder/submitProgress", data)
}
