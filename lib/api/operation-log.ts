/**
 * 操作日志 API
 * POST /operationLog/page
 */
import { post } from "./client"

export interface OperationLogPageDTO {
  page: number
  pageSize: number
  actionType?: number
}

export interface OperationLogDO {
  id: string
  userId: string
  actionType: number
  content: string
  ip: string
  joinnumId: string
  roomId: string
  roomName: string
  clientType: string
  createTime: string
  updateTime: string
}

export interface OperationLogPageResult {
  records: OperationLogDO[]
  total: number
  size: number
  current: number
}

/** actionType 枚举映射 */
export const ACTION_TYPE_MAP: Record<number, string> = {
  1: "手动控制",
  2: "课表自动控制",
  3: "定时任务(手动)",
  4: "定时任务(自动)",
  5: "状态上报",
  6: "升级程序",
}

export function getOperationLogPage(params: OperationLogPageDTO) {
  return post<OperationLogPageResult>("/operationLog/page", params)
}
