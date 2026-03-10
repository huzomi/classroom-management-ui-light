"use client"

import { SpaceOverview } from "@/components/dashboard/space-overview"
import { ConnectivityHub } from "@/components/dashboard/connectivity-hub"
import { AcademicTrends } from "@/components/dashboard/academic-trends"
import { OMEfficiency } from "@/components/dashboard/om-efficiency"
import { EcoMonitoring } from "@/components/dashboard/eco-monitoring"

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <SpaceOverview />
        <div className="grid gap-6 lg:grid-cols-2">
          <ConnectivityHub />
          <AcademicTrends />
        </div>
        <OMEfficiency />
        <EcoMonitoring />
      </div>
    </div>
  )
}
