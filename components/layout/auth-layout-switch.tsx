"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { PlatformSidebar } from "@/components/layout/platform-sidebar"
import { PlatformHeader } from "@/components/layout/platform-header"
import { TabsNav } from "@/components/layout/tabs-nav"

const AUTH_PATHS = ["/login"]

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export function AuthLayoutSwitch({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isAuthPage = AUTH_PATHS.some((p) => pathname?.startsWith(p))

  useEffect(() => {
    if (!isAuthPage && !getToken()) {
      router.replace("/login")
    }
  }, [isAuthPage, router])

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
