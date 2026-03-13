/**
 * 刷卡记录 API
 * POST /payCardLog/page
 */
import { post } from "./client"

export interface PayCardLogPageDTO {
  page: number
  size: number
  cardNo?: string
  name?: string
}

export interface PayCardLogPageVO {
  id: number
  cardNo: string
  jobNumber: string
  name: string
  college: string
  result: number
  roomName: string
  actionTime: string
}

export interface PayCardLogPageResult {
  records: PayCardLogPageVO[]
  total: number
  size: number
  current: number
}

/** result 枚举映射 */
export const CARD_RESULT_MAP: Record<number, { label: string; className: string }> = {
  0: { label: "刷卡成功", className: "text-green-600" },
  1: { label: "刷卡失败", className: "text-destructive" },
}

export function getPayCardLogPage(params: PayCardLogPageDTO) {
  return post<PayCardLogPageResult>("/payCardLog/page", params)
}
