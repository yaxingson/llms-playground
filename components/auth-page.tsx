"use client"

import { useState } from "react"
import { Eye, EyeOff, UserIcon, Mail, Lock, ArrowLeft, UserPlus, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { User } from "../types/user"

interface AuthPageProps {
  onLogin: (user: User) => void
  onBack: () => void
}

interface LoginForm {
  username: string
  password: string
  rememberMe: boolean
}

interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    lastLoginAt: new Date(),
    preferences: {
      theme: "system",
      defaultModel: "gpt-4",
      autoSave: true,
    },
  },
  {
    id: "2",
    username: "user1",
    email: "user1@example.com",
    role: "user",
    createdAt: new Date("2024-01-15"),
    lastLoginAt: new Date(),
    preferences: {
      theme: "light",
      defaultModel: "gpt-3.5-turbo",
      autoSave: false,
    },
  },
]

export function AuthPage({ onLogin, onBack }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: "",
    password: "",
    rememberMe: false,
  })

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handleLogin = async () => {
    setError("")
    setIsLoading(true)

    // 基本验证
    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setError("请填写用户名和密码")
      setIsLoading(false)
      return
    }

    // 模拟登录验证
    setTimeout(() => {
      const user = mockUsers.find((u) => u.username === loginForm.username || u.email === loginForm.username)

      if (user && loginForm.password === "password") {
        onLogin({ ...user, lastLoginAt: new Date() })
        setSuccess("登录成功！")
      } else {
        setError("用户名或密码错误")
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleRegister = async () => {
    setError("")
    setIsLoading(true)

    // 表单验证
    if (!registerForm.username.trim()) {
      setError("请输入用户名")
      setIsLoading(false)
      return
    }

    if (!registerForm.email.trim()) {
      setError("请输入邮箱地址")
      setIsLoading(false)
      return
    }

    if (!validateEmail(registerForm.email)) {
      setError("请输入有效的邮箱地址")
      setIsLoading(false)
      return
    }

    if (!validatePassword(registerForm.password)) {
      setError("密码长度至少6位")
      setIsLoading(false)
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("两次输入的密码不一致")
      setIsLoading(false)
      return
    }

    if (!registerForm.agreeToTerms) {
      setError("请同意用户协议和隐私政策")
      setIsLoading(false)
      return
    }

    // 检查用户名和邮箱是否已存在
    const existingUser = mockUsers.find((u) => u.username === registerForm.username || u.email === registerForm.email)

    if (existingUser) {
      setError("用户名或邮箱已存在")
      setIsLoading(false)
      return
    }

    // 模拟注册
    setTimeout(() => {
      const newUser: User = {
        id: Date.now().toString(),
        username: registerForm.username,
        email: registerForm.email,
        role: "user",
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          theme: "system",
          defaultModel: "gpt-3.5-turbo",
          autoSave: true,
        },
      }

      mockUsers.push(newUser)
      setSuccess("注册成功！正在为您登录...")

      // 自动登录
      setTimeout(() => {
        onLogin(newUser)
      }, 1000)

      setIsLoading(false)
    }, 1500)
  }

  const quickLogin = (username: string) => {
    setLoginForm((prev) => ({ ...prev, username, password: "password" }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 返回按钮 */}
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回主页
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <UserIcon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">LLM 调试平台</CardTitle>
            <CardDescription>登录或注册以使用完整功能</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  登录
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  注册
                </TabsTrigger>
              </TabsList>

              {/* 错误和成功提示 */}
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* 登录表单 */}
              <TabsContent value="login" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="login-username">用户名或邮箱</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="输入用户名或邮箱"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="输入密码"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={loginForm.rememberMe}
                    onCheckedChange={(checked) => setLoginForm((prev) => ({ ...prev, rememberMe: checked as boolean }))}
                  />
                  <Label htmlFor="remember-me" className="text-sm">
                    记住我
                  </Label>
                </div>

                <Button onClick={handleLogin} disabled={isLoading} className="w-full">
                  {isLoading ? "登录中..." : "登录"}
                </Button>

                {/* 快速登录 */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">快速登录（测试账号）</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => quickLogin("admin")} className="flex-1 text-xs">
                      <Badge variant="secondary" className="mr-1 text-xs">
                        管理员
                      </Badge>
                      admin
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => quickLogin("user1")} className="flex-1 text-xs">
                      <Badge variant="outline" className="mr-1 text-xs">
                        用户
                      </Badge>
                      user1
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">密码均为：password</p>
                </div>
              </TabsContent>

              {/* 注册表单 */}
              <TabsContent value="register" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="register-username">用户名</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-username"
                      type="text"
                      placeholder="输入用户名"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm((prev) => ({ ...prev, username: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">邮箱地址</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="输入邮箱地址"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="输入密码（至少6位）"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">确认密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="再次输入密码"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pl-10 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agree-terms"
                    checked={registerForm.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setRegisterForm((prev) => ({ ...prev, agreeToTerms: checked as boolean }))
                    }
                    className="mt-1"
                  />
                  <Label htmlFor="agree-terms" className="text-sm leading-relaxed">
                    我同意{" "}
                    <a href="#" className="text-primary hover:underline">
                      用户协议
                    </a>{" "}
                    和{" "}
                    <a href="#" className="text-primary hover:underline">
                      隐私政策
                    </a>
                  </Label>
                </div>

                <Button onClick={handleRegister} disabled={isLoading} className="w-full">
                  {isLoading ? "注册中..." : "注册账号"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 功能说明 */}
        <Card className="mt-6 bg-muted/50">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">平台功能</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• 多模型对话调试</p>
              <p>• Prompt 模板管理</p>
              <p>• RAG 检索增强生成（需登录）</p>
              <p>• AI Agent 智能代理（需登录）</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
