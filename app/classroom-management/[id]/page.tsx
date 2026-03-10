import { ClassroomDetailClient } from "./classroom-detail-client"

// 静态导出：预生成 mockRoomsData 中的教室详情页
const STATIC_ROOM_IDS = ["a101", "a102", "a103", "a201", "a202", "b101", "b102", "a301", "a302"]

export function generateStaticParams() {
  return STATIC_ROOM_IDS.map((id) => ({ id }))
}

export default async function ClassroomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ClassroomDetailClient id={id} />
}
