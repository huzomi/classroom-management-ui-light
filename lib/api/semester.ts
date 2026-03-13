/**
 * 学期管理 API
 * 对应接口: /common/semester
 */
import { post, put, del } from "./client"

/** 学期分页项 */
export interface SemesterPageVO {
  id: string
  semesterName?: string
  startTime?: string
  endTime?: string
  totalWeek?: number
  academyYear?: string
  semester?: string
  createTime?: string
  updateTime?: string
}

/** 分页结果 */
interface SemesterPageResult {
  records: SemesterPageVO[]
  total: number
  size: number
  current: number
  pages: number
}

/** 学期编辑 DTO */
export interface SemesterEditDTO {
  id?: string
  semesterName: string
  startTime: string
  endTime: string
  academyYear?: string
  semester?: string
}

/** 添加学期 */
export function addSemester(data: SemesterEditDTO) {
  return post<string>("/common/semester/add", data)
}

/** 更新学期 */
export function updateSemester(data: SemesterEditDTO) {
  return put<string>("/common/semester/update", data)
}

/** 删除学期 */
export function deleteSemester(ids: string[]) {
  return del<string>("/common/semester/delete", { ids })
}

/** 分页查询学期列表 */
export async function getSemesterList(params?: {
  page?: number
  pageSize?: number
  name?: string
}): Promise<{ records: SemesterPageVO[]; total: number }> {
  const result = await post<SemesterPageResult>("/common/semester/list", {
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 10,
    name: params?.name?.trim() || undefined,
  })
  return {
    records: result?.records ?? [],
    total: result?.total ?? 0,
  }
}
