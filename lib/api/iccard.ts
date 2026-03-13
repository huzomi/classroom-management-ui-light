/**
 * 一卡通管理 API
 * 对应接口: /iccard
 */
import { post } from "./client"

/** 一卡通分页项 */
export interface IccardPageVO {
  id: number
  cardNo: string
  name: string
  status: string
}

/** 分页结果 */
interface IccardPageResult {
  records: IccardPageVO[]
  total: number
  size: number
  current: number
  pages: number
}

/** 分页查询参数 */
export interface IccardPageParams {
  page?: number
  size?: number
  name?: string
  cardNo?: string
}

/** 分页查询一卡通列表 */
export async function getIccardPage(params?: IccardPageParams): Promise<{
  records: IccardPageVO[]
  total: number
}> {
  const result = await post<IccardPageResult>("/iccard/page", {
    page: params?.page ?? 1,
    size: params?.size ?? 10,
    name: params?.name?.trim() || undefined,
    cardNo: params?.cardNo?.trim() || undefined,
  })
  return {
    records: result?.records ?? [],
    total: result?.total ?? 0,
  }
}
