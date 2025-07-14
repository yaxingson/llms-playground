"use client"

import { Download, Trash2, Settings, User, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import type { User as UserType, AuthState } from "../types/user"

interface UnifiedToolbarProps {
  // 模块信息
  activeModule: string
  // 用户相关
  authState: AuthState
  onLogin: (user: UserType) => void
  onLogout: () => void
  onUpdateUser: (user: UserType) => void
  onShowAuthPage?: () => void
  // 对话相关（仅在chat模式下显示）
  selectedModel?: string
  messageCount?: number
  models?: Array<{ id: string; name: string; provider: string }>
  onExportChat?: () => void
  onClearChat?: () => void
}

const moduleNames = {
  chat: "对话模式",
  prompt: "Prompt 管理",
  rag: "RAG 检索增强生成",
  agent: "AI Agent 管理",
}

export function UnifiedToolbar({
  activeModule,
  authState,
  onLogin,
  onLogout,
  onUpdateUser,
  onShowAuthPage,
  selectedModel,
  messageCount = 0,
  models = [],
  onExportChat,
  onClearChat,
}: UnifiedToolbarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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

  return (
    <div className="border-b px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between">
        {/* 左侧：模块信息和状态 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{moduleNames[activeModule as keyof typeof moduleNames]}</h1>
          </div>

          {/* 模块特定信息 */}
          {activeModule === "chat" && selectedModel && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Badge variant="outline">{models.find((m) => m.id === selectedModel)?.name}</Badge>
                <Badge variant="secondary">{Math.floor(messageCount / 2)} 轮对话</Badge>
              </div>
            </>
          )}

          {activeModule === "prompt" && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Badge variant="outline">模板管理</Badge>
            </>
          )}

          {activeModule === "rag" && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Badge variant="outline">知识库检索</Badge>
            </>
          )}

          {activeModule === "agent" && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Badge variant="outline">智能代理</Badge>
            </>
          )}
        </div>

        {/* 右侧：操作按钮和用户信息 */}
        <div className="flex items-center gap-2">
          {/* 对话模式特有的操作按钮 */}
          {activeModule === "chat" && (
            <>
              <Button variant="ghost" size="sm" onClick={onExportChat} title="导出对话">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClearChat} title="清空对话">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
            </>
          )}

          {/* 用户信息和设置 */}
          {authState.isAuthenticated ? (
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
                  </Tabs>
                </DialogContent>
              </Dialog>

              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={onShowAuthPage}>
              <LogIn className="h-4 w-4 mr-1" />
              登录
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
