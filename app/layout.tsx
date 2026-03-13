import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SidebarProvider } from "@/components/layout/sidebar-context"
import { TabsProvider } from "@/components/layout/tabs-context"
import { AuthLayoutSwitch } from "@/components/layout/auth-layout-switch"
import { Toaster } from "@/components/ui/toaster"

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
          <TabsProvider>
            <AuthLayoutSwitch>{children}</AuthLayoutSwitch>
          </TabsProvider>
        </SidebarProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
