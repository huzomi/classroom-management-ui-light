/**
 * 统一 API 客户端
 * 运行时根据浏览器当前 origin 动态拼接 API 地址
 * 生产环境: {origin}/api/jeecg-boot
 * 开发环境: 使用 NEXT_PUBLIC_API_BASE_URL 环境变量
 */

function resolveBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  if (envUrl) return envUrl
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/jeecg-boot`
  }
  return "http://localhost:8201/jeecg-boot"
}

export interface ApiResult<T> {
  success: boolean
  message: string
  code: number
  result: T
  timestamp: number
}

export class ApiError extends Error {
  code: number
  constructor(message: string, code: number) {
    super(message)
    this.name = "ApiError"
    this.code = code
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers["X-Access-Token"] = token
  }

  const res = await fetch(`${resolveBaseUrl()}${url}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}: ${res.statusText}`, res.status)
  }

  const json: ApiResult<T> = await res.json()

  if (!json.success) {
    throw new ApiError(json.message || "请求失败", json.code)
  }

  return json.result
}

export function get<T>(
  url: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  let query = ""
  if (params) {
    const filtered = Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== ""
    )
    if (filtered.length) {
      query =
        "?" +
        new URLSearchParams(
          filtered.map(([k, v]) => [k, String(v)])
        ).toString()
    }
  }
  return request<T>(`${url}${query}`, { method: "GET" })
}

export function post<T>(url: string, body?: unknown): Promise<T> {
  return request<T>(url, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

export function put<T>(url: string, body?: unknown): Promise<T> {
  return request<T>(url, {
    method: "PUT",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

export function del<T>(url: string, body?: unknown): Promise<T> {
  return request<T>(url, {
    method: "DELETE",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

/** 获取 BASE_URL，供 auth、导出等模块使用 */
export function getBaseUrl(): string {
  return resolveBaseUrl()
}

/** 获取流媒体 BASE_URL */
export function getStreamBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_STREAM_BASE_URL
  if (envUrl) return envUrl
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api`
  }
  return "http://localhost:8200"
}
