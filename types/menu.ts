export type MenuType = "一级菜单" | "子菜单" | "按钮"

export interface MenuItem {
  id: string
  name: string
  type: MenuType
  icon?: string
  component: string
  path: string
  sort: number
  parentId?: string
  children?: MenuItem[]
}
