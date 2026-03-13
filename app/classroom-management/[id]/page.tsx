import { ClassroomDetailClient } from "./classroom-detail-client"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://192.168.10.11:8200/jeecgboot"

/** 静态导出：从 API 获取教室 ID 列表，失败时使用数字 ID 范围兜底 */
export async function generateStaticParams() {
  try {
    const res = await fetch(`${BASE_URL}/common/room/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: 1, pageSize: 500 }),
    })
    const json = await res.json()
    const records = json?.result?.records ?? []
    if (records.length > 0) {
      return records.map((r: { roomId: string }) => ({ id: r.roomId }))
    }
  } catch {
    // API 不可用时使用数字 ID 范围兜底
  }
  return Array.from({ length: 100 }, (_, i) => ({ id: String(i + 1) }))
}

export default async function ClassroomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ClassroomDetailClient id={id} />
}
