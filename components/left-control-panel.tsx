"use client"

import { useState } from "react"
import { BookOpen, Brain, Bot, MessageSquare, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface LeftControlPanelProps {
  isAuthenticated: boolean
  activeModule: string
  onModuleChange: (module: string) => void
}

export function LeftControlPanel({ isAuthenticated, activeModule, onModuleChange }: LeftControlPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    chat: true,
    prompt: true,
    rag: false,
    agent: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const modules = [
    {
      id: "chat",
      name: "对话模式",
      icon: MessageSquare,
      description: "与AI进行自由对话",
      available: true,
      badges: ["实时对话", "多模型"],
    },
    {
      id: "prompt",
      name: "Prompt 管理",
      icon: BookOpen,
      description: "管理和应用提示词模板",
      available: true,
      badges: ["5个模板", "分类管理"],
    },
    {
      id: "rag",
      name: "RAG 检索增强",
      icon: Brain,
      description: "基于知识库的智能问答",
      available: isAuthenticated,
      badges: ["知识库", "文档检索"],
      requireAuth: true,
    },
    {
      id: "agent",
      name: "AI Agent",
      icon: Bot,
      description: "智能代理和工具调用",
      available: isAuthenticated,
      badges: ["3个工具", "自定义Agent"],
      requireAuth: true,
    },
  ]

  return (
    <div className="w-80 border-r bg-muted/30 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-4">功能模块</h2>

        <div className="space-y-3">
          {modules.map((module) => {
            const Icon = module.icon
            const isActive = activeModule === module.id
            const sectionKey = module.id

            return (
              <Collapsible
                key={module.id}
                open={expandedSections[sectionKey]}
                onOpenChange={() => toggleSection(sectionKey)}
              >
                <Card className={isActive ? "ring-2 ring-primary" : ""}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {module.name}
                          {isActive && (
                            <Badge variant="default" className="text-xs">
                              当前
                            </Badge>
                          )}
                        </div>
                        {expandedSections[sectionKey] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-3">
                      <p className="text-xs text-muted-foreground">{module.description}</p>

                      {module.available ? (
                        <>
                          <Button
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() => onModuleChange(module.id)}
                          >
                            {isActive ? "当前模式" : "切换到此模式"}
                          </Button>
                          <div className="flex gap-1 flex-wrap">
                            {module.badges.map((badge) => (
                              <Badge key={badge} variant="secondary" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
                            {module.requireAuth ? "需要登录后使用" : "功能暂不可用"}
                          </div>
                          <Button variant="outline" size="sm" className="w-full bg-transparent" disabled>
                            需要登录
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )
          })}
        </div>
      </div>

      {/* 模块使用提示 */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-muted-foreground">
          <div className="mb-4">
            {activeModule === "chat" && <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />}
            {activeModule === "prompt" && <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />}
            {activeModule === "rag" && <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />}
            {activeModule === "agent" && <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />}
          </div>
          <h3 className="font-medium mb-2">{modules.find((m) => m.id === activeModule)?.name || "选择功能模块"}</h3>
          <p className="text-sm">
            {modules.find((m) => m.id === activeModule)?.description || "点击上方模块卡片开始使用"}
          </p>
        </div>
      </div>
    </div>
  )
}
