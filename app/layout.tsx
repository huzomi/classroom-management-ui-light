import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { PlatformSidebar } from "@/components/layout/platform-sidebar"
import { PlatformHeader } from "@/components/layout/platform-header"
import { SidebarProvider } from "@/components/layout/sidebar-context"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "智慧运维 - 教室管理系统",
  description: "智能教室管理系统，支持远程控制、环境监测、设备管理和实时监控",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`font-sans antialiased`}>
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden bg-background">
            <PlatformSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <PlatformHeader />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </div>
        </SidebarProvider>
        <Analytics />
      </body>
    </html>
  )
}
