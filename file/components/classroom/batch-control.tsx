"use client"

import { Button } from "@/components/ui/button"
import {
  Power,
  PowerOff,
  Lock,
  Unlock,
} from "lucide-react"

interface BatchControlProps {
  selectedCount: number
  totalCount: number
  onAction: (action: string) => void
  onSelectAll: () => void
  onClearSelection: () => void
}

export function BatchControl({
  selectedCount,
  totalCount,
  onAction,
  onSelectAll,
  onClearSelection,
}: BatchControlProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedCount === totalCount && totalCount > 0}
            onChange={() => {
              if (selectedCount === totalCount) {
                onClearSelection()
              } else {
                onSelectAll()
              }
            }}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          <span className="text-sm text-muted-foreground">
            已选择 <span className="font-semibold text-primary">{selectedCount}</span> / {totalCount} 间教室
          </span>
        </div>

        {selectedCount > 0 && (
          <>
            <div className="h-6 w-px bg-border" />

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction("class-start")}
                className="gap-1.5"
                disabled={selectedCount === 0}
              >
                <Power className="h-4 w-4 text-primary" />
                一键上课
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction("class-end")}
                className="gap-1.5"
                disabled={selectedCount === 0}
              >
                <PowerOff className="h-4 w-4" />
                一键下课
              </Button>
            </div>

            <div className="h-6 w-px bg-border" />

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction("lock-panel")}
                className="gap-1.5"
                disabled={selectedCount === 0}
              >
                <Lock className="h-4 w-4" />
                锁定面板
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction("unlock-panel")}
                className="gap-1.5"
                disabled={selectedCount === 0}
              >
                <Unlock className="h-4 w-4" />
                解锁面板
              </Button>
            </div>

            <div className="h-6 w-px bg-border" />

            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              className="text-muted-foreground"
            >
              取消选择
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
