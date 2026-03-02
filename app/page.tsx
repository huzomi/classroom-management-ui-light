"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push("/classroom-management")
  }, [router])

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-muted-foreground">加载中...</div>
    </div>
  )
}
