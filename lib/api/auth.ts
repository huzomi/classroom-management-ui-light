/**
 * 登录认证 API
 * 1. 获取验证码 2. 提交登录 3. 保存 Token 4. 后续请求携带 Token
 */
import { getBaseUrl } from "./client"
import { ApiError } from "./client"

const TOKEN_KEY = "token"

export interface LoginParams {
  username: string
  password: string
  captcha: string
  checkKey: string
}

export interface LoginResult {
  token: string
  userInfo: Record<string, unknown>
  departs: unknown[]
  multi_depart: number
  sysAllDictItems?: Record<string, unknown>
}

/** 获取图形验证码 Base64 图片，有效期 60 秒 */
export async function getCaptcha(key: string): Promise<string> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/sys/randomImage/${key}`)
  const json = await res.json()
  if (!json.success) {
    throw new ApiError(json.message || "获取验证码失败", json.code ?? 500)
  }
  return json.result
}

/** 登录：成功后自动保存 Token */
export async function login(params: LoginParams): Promise<LoginResult> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/sys/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  })
  const json = await res.json()

  if (!json.success) {
    throw new ApiError(json.message || "登录失败", json.code ?? 500)
  }

  const result = json.result as LoginResult
  if (result?.token && typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, result.token)
  }
  return result
}

/** 退出登录 */
export async function logout(): Promise<void> {
  const baseUrl = getBaseUrl()
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null
  if (token) {
    try {
      await fetch(`${baseUrl}/sys/logout`, {
        method: "GET",
        headers: { "X-Access-Token": token },
      })
    } finally {
      localStorage.removeItem(TOKEN_KEY)
    }
  }
}

/** 清除本地 Token（用于登出） */
export function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY)
  }
}
