"use client"

import { useState } from "react"
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

const loginSchema = z.object({
  username: z.string().min(1, "请输入用户名"),
  password: z.string().min(1, "请输入密码"),
  captcha: z.string().min(1, "请输入验证码"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [captchaCode, setCaptchaCode] = useState("")

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      captcha: "",
    },
  })

  const validateCaptcha = (value: string) => {
    if (!captchaCode) return "验证码已过期，请刷新"
    if (value.toUpperCase() !== captchaCode.toUpperCase()) return "验证码错误"
    return true
  }

  const onSubmit = (data: LoginFormValues) => {
    const captchaValid = validateCaptcha(data.captcha)
    if (captchaValid !== true) {
      form.setError("captcha", { message: captchaValid })
      return
    }
    // TODO: 调用登录 API
    router.push("/classroom-management")
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
                          className="flex-1 uppercase"
                          maxLength={6}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            form.clearErrors("captcha")
                          }}
                        />
                      </FormControl>
                      <GraphicalCaptcha
                        onChange={setCaptchaCode}
                        onRefresh={() => form.setValue("captcha", "")}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg">
                登录
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
