"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"

// 菜单配置，用于获取页面标题
const menuConfig: Record<string, string> = {
  "/": "首页",
  "/classroom-management": "教室管理",
  "/monitoring": "教学监控",
  "/teaching-integration/schedule": "课表管理",
  "/teaching-integration/tasks": "任务管理",
  "/operations/inspection": "智能巡检",
  "/operations/maintenance": "故障报修",
  "/operations/logs": "操作日志",
  "/operations/card-logs": "刷卡日志",
  "/assets": "资产管理",
  "/statistics/reports": "报表统计",
  "/statistics/dashboard": "数据大屏",
  "/system-ops/buildings": "教学楼管理",
  "/system-ops/floors": "楼层管理",
  "/system-ops/classrooms": "教室管理",
  "/system-ops/dictionary": "字典管理",
  "/system-ops/card-system": "一卡通管理",
  "/system-ops/locks": "门锁管理",
  "/system-ops/upgrade": "远程升级",
  "/system-ops/control-programming": "中控编程",
  "/system/menu": "菜单管理",
  "/settings/semesters": "学期管理",
  "/settings/periods": "节次管理",
  "/settings/users": "用户管理",
}

export interface Tab {
  path: string
  title: string
  closable: boolean
}

interface TabsContextType {
  tabs: Tab[]
  activeTab: string
  addTab: (path: string, title?: string) => void
  removeTab: (path: string) => void
  removeOtherTabs: (path: string) => void
  removeAllTabs: () => void
  setActiveTab: (path: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

export function TabsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  
  // 初始化时添加首页标签
  const [tabs, setTabs] = useState<Tab[]>([
    { path: "/", title: "首页", closable: false }
  ])
  const [activeTab, setActiveTab] = useState("/")

  // 根据路径获取页面标题
  const getPageTitle = useCallback((path: string): string => {
    return menuConfig[path] || "未知页面"
  }, [])

  // 添加标签
  const addTab = useCallback((path: string, title?: string) => {
    setTabs(prev => {
      const exists = prev.find(tab => tab.path === path)
      if (exists) {
        return prev
      }
      return [...prev, { 
        path, 
        title: title || getPageTitle(path), 
        closable: path !== "/" 
      }]
    })
    setActiveTab(path)
  }, [getPageTitle])

  // 移除标签
  const removeTab = useCallback((path: string) => {
    // 首页不可关闭
    if (path === "/") return

    setTabs(prev => {
      const index = prev.findIndex(tab => tab.path === path)
      if (index === -1) return prev

      const newTabs = prev.filter(tab => tab.path !== path)
      
      // 如果关闭的是当前激活的标签，则切换到前一个或后一个标签
      if (pathname === path) {
        const newActiveIndex = Math.min(index, newTabs.length - 1)
        const newActiveTab = newTabs[newActiveIndex]
        if (newActiveTab) {
          setTimeout(() => router.push(newActiveTab.path), 0)
        }
      }
      
      return newTabs
    })
  }, [pathname, router])

  // 关闭其他标签
  const removeOtherTabs = useCallback((path: string) => {
    setTabs(prev => prev.filter(tab => tab.path === "/" || tab.path === path))
  }, [])

  // 关闭所有标签（除了首页）
  const removeAllTabs = useCallback(() => {
    setTabs([{ path: "/", title: "首页", closable: false }])
    router.push("/")
  }, [router])

  // 监听路由变化，自动添加标签并同步激活状态
  useEffect(() => {
    if (pathname) {
      setActiveTab(pathname)
      setTabs(prev => {
        const exists = prev.find(tab => tab.path === pathname)
        if (exists) {
          return prev
        }
        return [...prev, { 
          path: pathname, 
          title: getPageTitle(pathname), 
          closable: pathname !== "/" 
        }]
      })
    }
  }, [pathname, getPageTitle])

  return (
    <TabsContext.Provider value={{ 
      tabs, 
      activeTab, 
      addTab, 
      removeTab, 
      removeOtherTabs, 
      removeAllTabs, 
      setActiveTab 
    }}>
      {children}
    </TabsContext.Provider>
  )
}

export function useTabs() {
  const context = useContext(TabsContext)
  if (context === undefined) {
    throw new Error("useTabs must be used within a TabsProvider")
  }
  return context
}
