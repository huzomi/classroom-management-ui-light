"use client"

import { useRouter, usePathname } from "next/navigation"
import { X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTabs } from "./tabs-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRef, useEffect, useState } from "react"

export function TabsNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { tabs, removeTab, removeOtherTabs, removeAllTabs } = useTabs()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollButtons, setShowScrollButtons] = useState(false)

  // 检查是否需要显示滚动
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        setShowScrollButtons(scrollRef.current.scrollWidth > scrollRef.current.clientWidth)
      }
    }
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [tabs])

  // 滚动到当前激活的标签（含子路径时滚动到父级标签）
  useEffect(() => {
    if (scrollRef.current) {
      let targetPath = pathname
      const exactTab = scrollRef.current.querySelector(`[data-path="${pathname}"]`)
      if (!exactTab) {
        const parentTab = Array.from(scrollRef.current.querySelectorAll("[data-path]")).find(
          (el) => pathname.startsWith((el as HTMLElement).dataset.path + "/")
        )
        if (parentTab) targetPath = (parentTab as HTMLElement).dataset.path!
      }
      const activeTab = scrollRef.current.querySelector(`[data-path="${targetPath}"]`)
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [pathname])

  const handleTabClick = (path: string) => {
    router.push(path)
  }

  const handleCloseTab = (e: React.MouseEvent, path: string) => {
    e.stopPropagation()
    removeTab(path)
  }

  return (
    <div className="flex items-center h-10 bg-card border-b border-border px-2">
      {/* 标签列表 */}
      <div 
        ref={scrollRef}
        className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide"
      >
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.path || pathname.startsWith(tab.path + "/")
          
          return (
            <div
              key={tab.path}
              data-path={tab.path}
              onClick={() => handleTabClick(tab.path)}
              className={cn(
                "group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors whitespace-nowrap flex-shrink-0",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <span>{tab.title}</span>
              {tab.closable && (
                <button
                  onClick={(e) => handleCloseTab(e, tab.path)}
                  className={cn(
                    "h-4 w-4 rounded-sm flex items-center justify-center transition-colors",
                    isActive
                      ? "hover:bg-primary-foreground/20"
                      : "opacity-0 group-hover:opacity-100 hover:bg-muted"
                  )}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* 更多操作下拉菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center h-7 w-7 rounded hover:bg-accent ml-1 flex-shrink-0">
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => removeOtherTabs(pathname)}>
            关闭其他
          </DropdownMenuItem>
          <DropdownMenuItem onClick={removeAllTabs}>
            关闭全部
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
