"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { GraphicalCaptcha } from "@/components/auth/graphical-captcha"
import { Monitor } from "lucide-react"
import { login } from "@/lib/api/auth"
import { ApiError } from "@/lib/api/client"

const loginSchema = z.object({
  username: z.string().min(1, "请输入用户名"),
  password: z.string().min(1, "请输入密码"),
  captcha: z.string().min(1, "请输入验证码"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [checkKey, setCheckKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      captcha: "",
    },
  })

  const handleCaptchaRefresh = useCallback(() => {
    form.setValue("captcha", "")
    form.clearErrors("captcha")
  }, [form])

  const onSubmit = async (data: LoginFormValues) => {
    if (!checkKey) {
      form.setError("captcha", { message: "验证码已过期，请点击刷新" })
      return
    }
    setLoading(true)
    setErrorMsg("")
    try {
      await login({
        username: data.username,
        password: data.password,
        captcha: data.captcha.trim(),
        checkKey,
      })
      router.push("/dashboard")
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "登录失败，请重试"
      setErrorMsg(message)
      form.setError("captcha", { message: "验证码错误或已过期，请刷新后重试" })
      form.setValue("captcha", "")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Monitor className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold">智慧运维教室管理系统</CardTitle>
          <CardDescription>请输入账号密码登录</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {errorMsg && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errorMsg}
                </div>
              )}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入用户名" autoComplete="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="请输入密码"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="captcha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>验证码</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder="请输入验证码"
                          autoComplete="off"
                          className="flex-1"
                          maxLength={6}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            form.clearErrors("captcha")
                            setErrorMsg("")
                          }}
                        />
                      </FormControl>
                      <GraphicalCaptcha
                        onCheckKeyChange={setCheckKey}
                        onRefresh={handleCaptchaRefresh}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "登录中..." : "登录"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
