"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { SpaceOverview } from "@/components/dashboard/space-overview"
import { ConnectivityHub } from "@/components/dashboard/connectivity-hub"
import { AcademicTrends } from "@/components/dashboard/academic-trends"
import { OMEfficiency } from "@/components/dashboard/om-efficiency"
import { EcoMonitoring } from "@/components/dashboard/eco-monitoring"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className={cn("transition-all duration-300", sidebarCollapsed ? "pl-0" : "pl-60")}>
        <Header />
        <main className="p-6">
          <div className="space-y-6">
            <SpaceOverview />
            <div className="grid gap-6 lg:grid-cols-2">
              <ConnectivityHub />
              <AcademicTrends />
            </div>
            <OMEfficiency />
            <EcoMonitoring />
          </div>
        </main>
      </div>
    </div>
  )
}
