"use client"

import { Zap, Thermometer, Droplets, Wind } from "lucide-react"

const energyData = {
  instantPower: 128.5,
  dailyConsumption: 2456,
  avgTemp: 24.2,
  avgHumidity: 58,
  avgCO2: 520,
}

export function EcoMonitoring() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          能效与环境概览
        </h2>
        <span className="text-xs text-muted-foreground">Eco-Monitoring</span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-3/10">
              <Zap className="h-6 w-6 text-chart-3" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">实时总能耗</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-foreground">
                  {energyData.instantPower}
                </span>
                <span className="text-sm text-muted-foreground">kW</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
            <span className="text-sm text-muted-foreground">当日累计电耗</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-primary">
                {energyData.dailyConsumption.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">kWh</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="mb-4 text-sm text-muted-foreground">环境舒适度平均值</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-chart-5/10">
                <Thermometer className="h-5 w-5 text-chart-5" />
              </div>
              <p className="text-lg font-semibold text-foreground">
                {energyData.avgTemp}°C
              </p>
              <p className="text-xs text-muted-foreground">平均温度</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                <Droplets className="h-5 w-5 text-chart-2" />
              </div>
              <p className="text-lg font-semibold text-foreground">
                {energyData.avgHumidity}%
              </p>
              <p className="text-xs text-muted-foreground">平均湿度</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Wind className="h-5 w-5 text-primary" />
              </div>
              <p className="text-lg font-semibold text-foreground">
                {energyData.avgCO2}
              </p>
              <p className="text-xs text-muted-foreground">CO2 (ppm)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
