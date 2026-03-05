"use client"

import { usePathname } from "next/navigation"
import { PlatformSidebar } from "@/components/layout/platform-sidebar"
import { PlatformHeader } from "@/components/layout/platform-header"
import { TabsNav } from "@/components/layout/tabs-nav"

const AUTH_PATHS = ["/login"]

export function AuthLayoutSwitch({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = AUTH_PATHS.some((p) => pathname?.startsWith(p))

  if (isAuthPage) {
    return <div className="min-h-screen bg-background">{children}</div>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <PlatformSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <PlatformHeader />
        <TabsNav />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
