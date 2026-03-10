"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Settings,
  MonitorSpeaker,
  Wrench,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"

const navItems = [
  {
    title: "教学运行域",
    icon: MonitorSpeaker,
    children: [
      { title: "今日看板", href: "/" },
      { title: "教室管理", href: "/classroom" },
      { title: "教学联动", href: "/linkage" },
    ],
  },
  {
    title: "运维保障域",
    icon: Wrench,
    children: [
      { title: "巡课评分", href: "/patrol" },
    ],
  },
]

interface SidebarNavProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function SidebarNav({ collapsed = false, onToggle }: SidebarNavProps) {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["教学运行域", "运维保障域"])

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    )
  }

  if (collapsed) {
    return (
      <>
        {/* 展开按钮 - 固定在左侧边缘 */}
        <button
          onClick={onToggle}
          className="fixed left-0 top-3 z-50 flex h-8 w-6 items-center justify-center rounded-r-md border border-l-0 border-border bg-card shadow-md transition-colors hover:bg-secondary"
        >
          <PanelLeft className="h-4 w-4 text-muted-foreground" />
        </button>
      </>
    )
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">
              智慧教室
            </span>
            <span className="text-xs text-sidebar-foreground/60">管理平台</span>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-sidebar-accent"
        >
          <PanelLeftClose className="h-4 w-4 text-sidebar-foreground/70" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((group) => (
          <div key={group.title}>
            <button
              onClick={() => toggleGroup(group.title)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <div className="flex items-center gap-3">
                <group.icon className="h-4 w-4" />
                <span>{group.title}</span>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  expandedGroups.includes(group.title) && "rotate-180"
                )}
              />
            </button>
            {expandedGroups.includes(group.title) && (
              <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                {group.children.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <Settings className="h-4 w-4" />
          <span>系统设置</span>
        </Link>
      </div>
    </aside>
  )
}
