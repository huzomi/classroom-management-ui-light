/**
 * 任务管理 API
 * 对应接口: POST /edu/task/num, POST /edu/task/page
 */
import { post } from "./client"

/** 任务数量统计 */
export interface TaskDataVO {
  all: number
  active: number
  disable: number
  today: number
}

/** 获取任务数量统计 */
export function getTaskNum() {
  return post<TaskDataVO>("/edu/task/num")
}

/** 任务类型项 */
export interface TaskTypeVO {
  id?: string
  command?: number
  name?: string
  joinnum?: number
  taskType?: string
}

/** 任务列表项 */
export interface TaskVO {
  id: string
  taskName?: string
  taskType?: string
  taskCycle?: string
  description?: string
  cronSpec?: string
  cronConfig?: string
  taskHour?: string
  status?: number
  taskTypeVOS?: TaskTypeVO[] | null
  roomTaskVOList?: unknown[]
  lastActiveTime?: string | null
  createdTime?: string
  updatedTime?: string
}

/** 分页结果 */
interface TaskPageResult {
  records: TaskVO[]
  total: number
  size: number
  current: number
  pages: number
}

/** 分页查询任务列表 */
export async function getTaskPage(params?: {
  page?: number
  pageSize?: number
  name?: string
}): Promise<TaskVO[]> {
  const body: Record<string, unknown> = {
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 100,
  }
  if (params?.name?.trim()) body.name = params.name.trim()
  const result = await post<TaskPageResult>("/edu/task/page", body)
  return result?.records ?? []
}

/** 删除任务 */
export function deleteTask(ids: string[]) {
  return post<string>("/edu/task/del", { ids })
}

/** 立即执行任务 */
export function executeTask(taskId: string) {
  return post<string>("/edu/task/execute", { id: taskId })
}

/** 激活/停用任务 */
export function reactiveTask(taskId: string, status: 0 | 1) {
  return post<string>("/edu/task/reactive", { taskId, status })
}

/** 新增/编辑任务请求 */
export interface TaskEditDTO {
  id?: string
  taskName: string
  taskType: string
  taskCycle?: string
  cronSpec?: string
  cronConfig?: string
  description?: string
  status?: number
  taskHour?: string
  taskDay?: number
  roomIds?: string[]
  taskTypeDOS?: {
    joinnum?: number
    joinnumLabelId?: string
    command?: number
    name?: string
    taskType?: string
    value?: string
  }[]
}

/** 新增或编辑任务 */
export function taskEdit(data: TaskEditDTO) {
  return post<string>("/edu/task/edit", data)
}
