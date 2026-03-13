/**
 * 摄像头/流媒体 API
 * 教学监控 - 获取播放地址
 */

import { post, getStreamBaseUrl } from "./client"

/** 流输出 VO */
export interface CommonStreamOutputVO {
  type: number
  title: string
  id: string
  sourceId: string
  format: string
  outputType: number
  url: string
  bitrateKbps: number | null
  width: number | null
  height: number | null
  fps: number | null
  enable: number
  createdAt: string | null
  updatedAt: string | null
}

/** 摄像头窗口请求 DTO */
export interface CameraWindowsDTO {
  roomId: string
  type: number
}

/**
 * 获取摄像头播放地址
 * @param roomId 教室ID
 * @param type 类型，固定传 0
 * @returns 流列表，包含教师通道、学生通道、桌面等
 */
export async function getPlayWindows(
  roomId: string,
  type: number = 0
): Promise<CommonStreamOutputVO[]> {
  const list = await post<CommonStreamOutputVO[] | null>("/common/camera/windows", {
    roomId,
    type,
  })
  return list ?? []
}

/**
 * 将相对 URL 转为完整播放地址
 * 根据当前浏览器 IP 动态拼接，流媒体端口 8200
 * 例如: streamOut/live/1/stu.flv -> http://host:8200/streamOut/live/1/stu.flv
 */
export function getFullStreamUrl(relativeUrl: string): string {
  const base = getStreamBaseUrl().replace(/\/$/, "")
  const path = relativeUrl.startsWith("/") ? relativeUrl : `/${relativeUrl}`
  return `${base}${path}`
}
