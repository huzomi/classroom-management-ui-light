/**
 * 配置/字典管理 API
 * 对应接口: /common/config
 */
import { post, put, del } from "./client"

/** 配置项 */
export interface ConfigVO {
  id: string
  key?: string
  value?: string
  type?: string
  desc?: string
  createTime?: string
  updateTime?: string
}

/** 分页结果 */
interface ConfigPageResult {
  records: ConfigVO[]
  total: number
  size: number
  current: number
  pages: number
}

/** 配置编辑 DTO */
export interface ConfigEditDTO {
  id?: string
  key: string
  value: string
  type: string
  desc?: string
}

/** 添加配置 */
export function addConfig(data: ConfigEditDTO) {
  return post<string>("/common/config/add", data)
}

/** 更新配置 */
export function updateConfig(data: ConfigEditDTO) {
  return put<string>("/common/config/update", data)
}

/** 删除配置 */
export function deleteConfig(ids: string[]) {
  return del<string>("/common/config/delete", { ids })
}

/** 分页查询配置列表 */
export async function getConfigList(params?: {
  page?: number
  pageSize?: number
  name?: string
}): Promise<{ records: ConfigVO[]; total: number }> {
  const result = await post<ConfigPageResult>("/common/config/list", {
    page: params?.page ?? 1,
    pageSize: params?.pageSize ?? 10,
    name: params?.name?.trim() || undefined,
  })
  return {
    records: result?.records ?? [],
    total: result?.total ?? 0,
  }
}

/** 获取配置类型列表 */
export async function getConfigTypeList(): Promise<string[]> {
  const result = await post<string[]>("/common/config/type", {})
  return result ?? []
}
