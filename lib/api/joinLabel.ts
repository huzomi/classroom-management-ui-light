/**
 * 控制码标签管理 API
 * 对应接口: POST /edu/joinLabel/cameron
 */
import { post } from "./client"

/** 控制码标签项 */
export interface EDUJoinnumLabelVO {
  id: string
  joinNum?: number
  equipmentType?: number
  equipmentTypeName?: string | null
  equipmentName?: string
  buttonStatusList?: string[]
  /** 设备任务类型：control 设备控制 / patrol 设备巡检 */
  taskType?: "control" | "patrol"
}

/** 分页结果 */
interface JoinLabelPageResult {
  records: EDUJoinnumLabelVO[]
  total: number
  size: number
  current: number
  pages: number
}

/** 分页查询控制码标签列表 */
export async function getJoinLabelList(params?: {
  page?: number
  pageSize?: number
}): Promise<EDUJoinnumLabelVO[]> {
  const result = await post<JoinLabelPageResult>("/edu/joinLabel/cameron", {
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 2000,
  })
  return result?.records ?? []
}
