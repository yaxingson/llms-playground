"use client"

import { useState } from "react"
import { User, LogIn, LogOut, Settings, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import type { User as UserType, AuthState } from "../types/user"

interface UserManagementProps {
  authState: AuthState
  onLogin: (user: UserType) => void
  onLogout: () => void
  onUpdateUser: (user: UserType) => void
  onShowAuthPage?: () => void
}

const mockUsers: UserType[] = [
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

export function UserManagement({ authState, onLogin, onLogout, onUpdateUser, onShowAuthPage }: UserManagementProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [users, setUsers] = useState<UserType[]>(mockUsers)

  const handleLogin = () => {
    // 模拟登录验证
    const user = users.find((u) => u.username === loginForm.username)
    if (user) {
      onLogin({ ...user, lastLoginAt: new Date() })
      setIsLoginOpen(false)
      setLoginForm({ username: "", password: "" })
    }
  }

  const handleUpdatePreferences = (preferences: Partial<UserType["preferences"]>) => {
    if (authState.user) {
      const updatedUser = {
        ...authState.user,
        preferences: { ...authState.user.preferences, ...preferences },
      }
      onUpdateUser(updatedUser)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500"
      case "user":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onShowAuthPage}>
          <LogIn className="h-4 w-4 mr-1" />
          登录
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={authState.user?.avatar || "/placeholder.svg"} />
        <AvatarFallback>
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{authState.user?.username}</span>
        <Badge variant="outline" className={`text-xs ${getRoleColor(authState.user?.role || "guest")}`}>
          {authState.user?.role}
        </Badge>
      </div>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>用户设置</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">个人信息</TabsTrigger>
              <TabsTrigger value="preferences">偏好设置</TabsTrigger>
              {authState.user?.role === "admin" && <TabsTrigger value="users">用户管理</TabsTrigger>}
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">个人信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={authState.user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{authState.user?.username}</h3>
                      <p className="text-sm text-muted-foreground">{authState.user?.email}</p>
                      <Badge variant="outline" className="mt-1">
                        {authState.user?.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>注册时间</Label>
                      <p className="text-muted-foreground">{authState.user?.createdAt.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label>最后登录</Label>
                      <p className="text-muted-foreground">{authState.user?.lastLoginAt.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">偏好设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>主题</Label>
                    <Select
                      value={authState.user?.preferences.theme}
                      onValueChange={(value) => handleUpdatePreferences({ theme: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">浅色</SelectItem>
                        <SelectItem value="dark">深色</SelectItem>
                        <SelectItem value="system">跟随系统</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>默认模型</Label>
                    <Select
                      value={authState.user?.preferences.defaultModel}
                      onValueChange={(value) => handleUpdatePreferences({ defaultModel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>自动保存对话</Label>
                    <Switch
                      checked={authState.user?.preferences.autoSave}
                      onCheckedChange={(checked) => handleUpdatePreferences({ autoSave: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {authState.user?.role === "admin" && (
              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      用户管理
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.username}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Shield className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </DialogContent>
      </Dialog>

      <Button variant="ghost" size="sm" onClick={onLogout}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
