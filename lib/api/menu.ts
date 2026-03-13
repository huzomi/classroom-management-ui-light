/**
 * 菜单/权限管理 API
 * 对应接口: /sys/permission (JeecgBoot)
 */
import { get, post, put, del } from "./client"

/** 菜单项（树形） */
export interface MenuPermissionVO {
  id: string
  parentId?: string
  name?: string
  menuType?: string
  perms?: string
  permsType?: string
  component?: string
  componentName?: string
  url?: string
  route?: string
  redirect?: string
  frameSrc?: string
  sortNo?: number
  icon?: string
  isLeaf?: number
  isRoute?: number
  keepAlive?: number
  hidden?: number
  hideTab?: number
  alwaysShow?: number
  internalOrExternal?: number
  status?: string
  createTime?: string
  updateTime?: string
  children?: MenuPermissionVO[]
}

/** 菜单编辑 DTO */
export interface MenuPermissionEditDTO {
  id?: string
  parentId?: string
  name: string
  menuType: string
  perms?: string
  permsType?: string
  component?: string
  componentName?: string
  url?: string
  route?: string
  redirect?: string
  frameSrc?: string
  sortNo?: number
  icon?: string
  isRoute?: number
  keepAlive?: number
  hidden?: number
  hideTab?: number
  alwaysShow?: number
  internalOrExternal?: number
  status?: string
}

/** 获取菜单树列表 */
export async function getMenuList(): Promise<MenuPermissionVO[]> {
  const result = await get<MenuPermissionVO[]>("/sys/permission/list")
  return result ?? []
}

/** 添加菜单 */
export function addMenu(data: MenuPermissionEditDTO) {
  return post<string>("/sys/permission/add", data)
}

/** 更新菜单 */
export function updateMenu(data: MenuPermissionEditDTO) {
  return put<string>("/sys/permission/edit", data)
}

/** 删除菜单 */
export function deleteMenu(ids: string[]) {
  return del<string>("/sys/permission/delete", { ids })
}
