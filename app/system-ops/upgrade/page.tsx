"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, CheckCircle, Clock } from "lucide-react"

export default function UpgradePage() {
  const devices = [
    { id: 1, classroom: "101教室", version: "v2.1.0", latestVersion: "v2.2.0", needsUpgrade: true },
    { id: 2, classroom: "102教室", version: "v2.2.0", latestVersion: "v2.2.0", needsUpgrade: false },
    { id: 3, classroom: "201教室", version: "v2.0.5", latestVersion: "v2.2.0", needsUpgrade: true },
  ]

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">远程升级</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Upload className="h-4 w-4" />
            上传固件
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            批量升级
          </Button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 text-sm text-muted-foreground">当前版本</div>
          <div className="text-2xl font-bold">v2.2.0</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 text-sm text-muted-foreground">需要升级</div>
          <div className="text-2xl font-bold text-orange-500">2</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-2 text-sm text-muted-foreground">最新版本</div>
          <div className="text-2xl font-bold text-green-500">1</div>
        </div>
      </div>

      <div className="space-y-3">
        {devices.map((device) => (
          <div
            key={device.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center gap-4">
              <div>
                <div className="font-medium">{device.classroom}</div>
                <div className="text-sm text-muted-foreground">
                  当前版本: {device.version} → 最新版本: {device.latestVersion}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {device.needsUpgrade ? (
                <>
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-500">
                    <Clock className="mr-1 h-3 w-3" />
                    待升级
                  </Badge>
                  <Button size="sm">立即升级</Button>
                </>
              ) : (
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  最新版本
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
