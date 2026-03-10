"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  LayoutGrid,
  MonitorPlay,
  PackageOpen,
  BarChart3,
  Settings,
  Zap,
  Wrench,
  Database,
  ChevronDown,
} from "lucide-react"
import { useState } from "react"
import { useSidebar } from "./sidebar-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  {
    title: "今日看板",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "教室管理",
    href: "/classroom-management",
    icon: LayoutGrid,
  },
  {
    title: "教学监控",
    href: "/monitoring",
    icon: MonitorPlay,
  },
  {
    title: "教学联动",
    icon: Zap,
    subItems: [
      { title: "课表管理", href: "/teaching-integration/schedule" },
      { title: "任务管理", href: "/teaching-integration/tasks" },
    ],
  },
  {
    title: "运维管理",
    icon: Wrench,
    subItems: [
      { title: "智能巡检", href: "/operations/inspection" },
      { title: "故障报修", href: "/operations/maintenance" },
      { title: "操作日志", href: "/operations/logs" },
      { title: "刷卡日志", href: "/operations/card-logs" },
    ],
  },
  {
    title: "资产管理",
    href: "/assets",
    icon: PackageOpen,
  },
  {
    title: "数据统计",
    icon: BarChart3,
    subItems: [
      { title: "报表统计", href: "/statistics/reports" },
      { title: "数据大屏", href: "/statistics/dashboard" },
    ],
  },
  {
    title: "系统运维",
    icon: Database,
    subItems: [
      { title: "教学楼管理", href: "/system-ops/buildings" },
      { title: "楼层管理", href: "/system-ops/floors" },
      { title: "教室管理", href: "/system-ops/classrooms" },
      { title: "字典管理", href: "/system-ops/dictionary" },
      { title: "一卡通管理", href: "/system-ops/card-system" },
      { title: "门锁管理", href: "/system-ops/locks" },
      { title: "远程升级", href: "/system-ops/upgrade" },
      { title: "中控编程", href: "/system-ops/control-programming" },
    ],
  },
  {
    title: "系统设置",
    icon: Settings,
    subItems: [
      { title: "菜单管理", href: "/system/menu" },
      { title: "学期管理", href: "/settings/semesters" },
      { title: "节次管理", href: "/settings/periods" },
      { title: "用户管理", href: "/settings/users" },
    ],
  },
]

export function PlatformSidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const { isCollapsed, toggleSidebar } = useSidebar()

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div 
        className={cn(
          "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-in-out overflow-hidden",
          isCollapsed ? "w-16" : "w-52"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center border-b border-sidebar-border px-4 overflow-hidden">
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary flex-shrink-0">
              <LayoutGrid className="h-5 w-5 text-primary-foreground" />
            </div>
            <span 
              className={cn(
                "text-lg font-semibold text-sidebar-foreground whitespace-nowrap transition-all duration-300 ease-in-out",
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              )}
            >
              智慧运维
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="scrollbar-hide flex-1 space-y-1 overflow-y-auto p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const hasSubItems = item.subItems && item.subItems.length > 0
            const isExpanded = expandedItems.includes(item.title)
            const isActive = item.href
              ? pathname === item.href || pathname.startsWith(item.href + "/")
              : false
            const hasActiveChild = hasSubItems ? item.subItems.some((sub) => pathname === sub.href) : false

            // 折叠状态下的渲染
            if (isCollapsed) {
              if (hasSubItems) {
                return (
                  <Tooltip key={item.title}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toggleExpand(item.title)}
                        className={cn(
                          "flex w-full items-center justify-center rounded-lg p-2 text-sm font-medium transition-colors",
                          hasActiveChild
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex flex-col gap-1">
                      <span className="font-medium">{item.title}</span>
                      <div className="flex flex-col gap-1 mt-1">
                        {item.subItems!.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              "text-xs px-2 py-1 rounded hover:bg-accent",
                              pathname === subItem.href ? "bg-accent" : ""
                            )}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              } else {
                return (
                  <Tooltip key={item.title}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href!}
                        className={cn(
                          "flex items-center justify-center rounded-lg p-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                )
              }
            }

            // 展开状态下的渲染
            return (
              <div key={item.title} className="overflow-hidden">
                {hasSubItems ? (
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors overflow-hidden",
                      hasActiveChild || isExpanded
                        ? "bg-sidebar-accent/50 text-sidebar-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 flex-shrink-0 transition-transform duration-200", isExpanded ? "rotate-180" : "")} />
                  </button>
                ) : (
                  <Link
                    href={item.href!}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors overflow-hidden",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>
                  </Link>
                )}

                {hasSubItems && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3 overflow-hidden">
                    {item.subItems!.map((subItem) => {
                      const isSubActive = pathname === subItem.href

                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors whitespace-nowrap overflow-hidden text-ellipsis",
                            isSubActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                          )}
                        >
                          {subItem.title}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        </div>
    </TooltipProvider>
  )
}
