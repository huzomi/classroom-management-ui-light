export type MenuType = "目录" | "菜单" | "按钮"

export interface MenuItem {
  id: string
  name: string
  type: MenuType
  icon?: string
  component?: string
  componentName?: string
  path?: string
  redirect?: string
  frameSrc?: string
  sort: number
  parentId?: string
  permission?: string
  permsType?: string
  status?: string
  isRoute?: number
  keepAlive?: number
  hidden?: number
  hideTab?: number
  alwaysShow?: number
  internalOrExternal?: number
  children?: MenuItem[]
}
