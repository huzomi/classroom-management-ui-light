/**
 * 课节/节次管理 API
 * 对应接口: /common/lesson
 */
import { post, put, del } from "./client"

/** 课节列表项 */
export interface LessonPageVO {
  id: string
  startTime?: string
  endTime?: string
  startOffset?: number | null
  endOffset?: number | null
  timing?: number
  realStartTime?: string
  realEndTime?: string
}

/** 分页结果 */
interface LessonPageResult {
  records: LessonPageVO[]
  total: number
  size: number
  current: number
  pages: number
}

/** 课节编辑 DTO */
export interface LessonEditDTO {
  id?: string
  startTime: string
  endTime: string
  startOffset?: number
  endOffset?: number
}

/** 添加课节 */
export function addLesson(data: LessonEditDTO) {
  return post<string>("/common/lesson/add", {
    ...data,
    startTime: toTimeString(data.startTime),
    endTime: toTimeString(data.endTime),
  })
}

/** 更新课节 */
export function updateLesson(data: LessonEditDTO) {
  return put<string>("/common/lesson/update", {
    ...data,
    startTime: toTimeString(data.startTime),
    endTime: toTimeString(data.endTime),
  })
}

/** 删除课节 */
export function deleteLesson(ids: string[]) {
  return del<string>("/common/lesson/delete", { ids })
}

/** 分页查询课节列表 */
export async function getLessonPage(params?: {
  page?: number
  pageSize?: number
  name?: string
}): Promise<{ records: LessonPageVO[]; total: number }> {
  const result = await post<LessonPageResult>("/common/lesson/list", {
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 10,
    name: params?.name?.trim() || undefined,
  })
  return {
    records: result?.records ?? [],
    total: result?.total ?? 0,
  }
}

/** 获取课节列表（不分页，用于课表等） */
export async function getLessonList(params?: {
  page?: number
  pageSize?: number
}): Promise<LessonPageVO[]> {
  const { records } = await getLessonPage({
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 2000,
  })
  return records
}

/** 将 HH:mm 转为 HH:mm:ss */
function toTimeString(v: string): string {
  if (!v) return v
  const parts = v.split(":")
  if (parts.length === 2) return `${v}:00`
  return v
}
