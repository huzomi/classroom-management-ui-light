/**
 * 任务日志 API
 * 对应接口: POST /edu/taskLog/page
 */
import { post } from "./client"

/** 任务日志项 */
export interface TaskLogVO {
  id?: string
  taskId?: string
  joinNum?: number
  value?: string
  status?: number
  createTime?: string
  updateTime?: string
}

/** 分页结果 */
interface TaskLogPageResult {
  records: TaskLogVO[]
  total: number
  size: number
  current: number
  pages: number
}

/** 分页查询任务日志 */
export async function getTaskLogPage(params: {
  page?: number
  pageSize?: number
  id: string
}): Promise<{ records: TaskLogVO[]; total: number }> {
  const result = await post<TaskLogPageResult>("/edu/taskLog/page", {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
    id: params.id,
  })
  return {
    records: result?.records ?? [],
    total: result?.total ?? 0,
  }
}
