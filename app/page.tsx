"use client"

import { useState } from "react"
import { LeftControlPanel } from "../components/left-control-panel"
import { MainContentArea } from "../components/main-content-area"
import { ResizableConfigPanel } from "../components/resizable-config-panel"
import { UnifiedToolbar } from "../components/unified-toolbar"
import { AuthPage } from "../components/auth-page"
import type { User, AuthState } from "../types/user"
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

interface ModelConfig {
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  systemPrompt: string
}

const models = [
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
  { id: "llama-2-70b", name: "Llama 2 70B", provider: "Meta" },
]

export default function LLMDebugChat() {
  const [showAuthPage, setShowAuthPage] = useState(false)
  const [activeModule, setActiveModule] = useState("chat")
  const [selectedModel, setSelectedModel] = useState("gpt-4")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  })

  const [config, setConfig] = useState<ModelConfig>({
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    systemPrompt: "You are a helpful AI assistant.",
  })

  const handleLogin = (user: User) => {
    setAuthState({ user, isAuthenticated: true, isLoading: false })
    setShowAuthPage(false)
  }

  const handleLogout = () => {
    setAuthState({ user: null, isAuthenticated: false, isLoading: false })
    // 如果当前在需要登录的模块，切换回对话模式
    if (activeModule === "rag" || activeModule === "agent") {
      setActiveModule("chat")
    }
  }

  const handleUpdateUser = (user: User) => {
    setAuthState((prev) => ({ ...prev, user }))
  }

  const handleShowAuthPage = () => {
    setShowAuthPage(true)
  }

  const handleModuleChange = (module: string) => {
    // 检查权限
    if ((module === "rag" || module === "agent") && !authState.isAuthenticated) {
      setShowAuthPage(true)
      return
    }
    setActiveModule(module)
  }

  const handleRAGQuery = async (query: RAGQuery): Promise<RAGResult> => {
    // 模拟RAG查询实现
    return {
      answer: "这是模拟的RAG回答",
      sources: [],
      confidence: 0.8,
    }
  }

  const handleExecuteAgent = async (agent: Agent, input: string): Promise<AgentExecution> => {
    // 模拟Agent执行实现
    return {
      id: Date.now().toString(),
      agentId: agent.id,
      input,
      output: "模拟的Agent执行结果",
      toolCalls: [],
      status: "completed",
      startTime: new Date(),
      endTime: new Date(),
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // 模拟API调用
    setTimeout(
      () => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `这是来自 ${models.find((m) => m.id === selectedModel)?.name} 的模拟响应。\n\n参数配置：\n- Temperature: ${config.temperature}\n- Max Tokens: ${config.maxTokens}\n- Top P: ${config.topP}\n\n您的问题："${input}"已收到并处理。`,
          timestamp: new Date(),
          model: selectedModel,
          tokens: Math.floor(Math.random() * 500) + 100,
        }
        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)
      },
      1000 + Math.random() * 2000,
    )
  }

  const clearChat = () => {
    setMessages([])
  }

  const exportChat = () => {
    const chatData = {
      model: selectedModel,
      config,
      messages,
      timestamp: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chat-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const resetConfig = () => {
    setConfig({
      temperature: 0.7,
      maxTokens: 2048,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
      systemPrompt: "You are a helpful AI assistant.",
    })
  }

  const handleApplyPrompt = (prompt: string) => {
    setConfig((prev) => ({ ...prev, systemPrompt: prompt }))
    // 应用prompt后切换到对话模式
    setActiveModule("chat")
  }

  // 如果显示认证页面
  if (showAuthPage) {
    return <AuthPage onLogin={handleLogin} onBack={() => setShowAuthPage(false)} />
  }

  return (
    <div className="flex h-screen bg-background">
      {/* 左侧功能控制面板 */}
      <LeftControlPanel
        isAuthenticated={authState.isAuthenticated}
        activeModule={activeModule}
        onModuleChange={handleModuleChange}
      />

      {/* 中间内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 统一工具栏 */}
        <UnifiedToolbar
          activeModule={activeModule}
          authState={authState}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
          onShowAuthPage={handleShowAuthPage}
          selectedModel={selectedModel}
          messageCount={messages.length}
          models={models}
          onExportChat={exportChat}
          onClearChat={clearChat}
        />

        {/* 主内容区域 */}
        <MainContentArea
          activeModule={activeModule}
          isAuthenticated={authState.isAuthenticated}
          userId={authState.user?.id || ""}
          messages={messages}
          input={input}
          isLoading={isLoading}
          onInputChange={setInput}
          onSend={handleSend}
          onCopyMessage={copyMessage}
          onApplyPrompt={handleApplyPrompt}
          onRAGQuery={handleRAGQuery}
          onExecuteAgent={handleExecuteAgent}
        />
      </div>

      {/* 右侧可调整大小的配置面板 */}
      <ResizableConfigPanel
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        config={config}
        onConfigChange={setConfig}
        onResetConfig={resetConfig}
        models={models}
      />
    </div>
  )
}
