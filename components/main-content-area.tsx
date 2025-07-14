"use client"

import { Send, Copy, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PromptManager } from "./prompt-manager"
import { RAGManager } from "./rag-manager"
import { AgentManager } from "./agent-manager"
import type { RAGQuery, RAGResult } from "../types/rag"
import type { Agent, AgentExecution } from "../types/agent"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  model?: string
  tokens?: number
}

interface MainContentAreaProps {
  activeModule: string
  isAuthenticated: boolean
  userId: string
  // Chat props
  messages: Message[]
  input: string
  isLoading: boolean
  onInputChange: (value: string) => void
  onSend: () => void
  onCopyMessage: (content: string) => void
  // Module props
  onApplyPrompt: (prompt: string) => void
  onRAGQuery: (query: RAGQuery) => Promise<RAGResult>
  onExecuteAgent: (agent: Agent, input: string) => Promise<AgentExecution>
}

export function MainContentArea({
  activeModule,
  isAuthenticated,
  userId,
  messages,
  input,
  isLoading,
  onInputChange,
  onSend,
  onCopyMessage,
  onApplyPrompt,
  onRAGQuery,
  onExecuteAgent,
}: MainContentAreaProps) {
  const renderChatMode = () => (
    <div className="flex flex-col h-full">
      {/* 对话区域 */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">开始对话</h3>
              <p className="text-sm mb-4">选择模型并发送消息开始调试</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="text-xs">
                  支持多种模型
                </Badge>
                <Badge variant="outline" className="text-xs">
                  实时参数调节
                </Badge>
                <Badge variant="outline" className="text-xs">
                  RAG 增强
                </Badge>
                <Badge variant="outline" className="text-xs">
                  AI Agent
                </Badge>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <Card key={message.id} className={message.role === "user" ? "ml-12" : "mr-12"}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={message.role === "user" ? "default" : "secondary"}>
                        {message.role === "user" ? "用户" : "AI"}
                      </Badge>
                      {message.model && (
                        <Badge variant="outline" className="text-xs">
                          {/* {models.find((m) => m.id === message.model)?.name} */}
                        </Badge>
                      )}
                      {message.tokens && (
                        <Badge variant="outline" className="text-xs">
                          {message.tokens} tokens
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => onCopyMessage(message.content)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <span className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                </CardContent>
              </Card>
            ))
          )}
          {isLoading && (
            <Card className="mr-12">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">AI正在思考...</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* 输入区域 */}
      <div className="border-t p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="输入您的消息..."
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  onSend()
                }
              }}
            />
            <Button onClick={onSend} disabled={!input.trim() || isLoading} className="px-6">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>按 Enter 发送，Shift + Enter 换行</span>
            <span>{input.length} 字符</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeModule) {
      case "chat":
        return renderChatMode()
      case "prompt":
        return <PromptManager onApplyPrompt={onApplyPrompt} />
      case "rag":
        return isAuthenticated ? (
          <RAGManager onRAGQuery={onRAGQuery} userId={userId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <h3 className="text-lg font-medium mb-2">需要登录</h3>
              <p className="text-sm">请先登录以使用 RAG 功能</p>
            </div>
          </div>
        )
      case "agent":
        return isAuthenticated ? (
          <AgentManager userId={userId} onExecuteAgent={onExecuteAgent} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <h3 className="text-lg font-medium mb-2">需要登录</h3>
              <p className="text-sm">请先登录以使用 AI Agent 功能</p>
            </div>
          </div>
        )
      default:
        return renderChatMode()
    }
  }

  return <div className="flex-1 overflow-hidden">{renderContent()}</div>
}
