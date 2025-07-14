"use client"

import { useState } from "react"
import { Bot, Play, Square, PenToolIcon as Tool, Plus, Code, Calculator, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import type { Agent, Tool as ToolType, AgentExecution } from "../types/agent"

interface AgentManagerProps {
  userId: string
  onExecuteAgent: (agent: Agent, input: string) => Promise<AgentExecution>
}

// 预定义工具
const availableTools: ToolType[] = [
  {
    id: "calculator",
    name: "计算器",
    description: "执行数学计算",
    parameters: {
      type: "object",
      properties: {
        expression: { type: "string", description: "数学表达式" },
      },
      required: ["expression"],
    },
    function: async (params) => {
      try {
        // 简单的数学计算（实际应用中需要更安全的实现）
        const result = eval(params.expression)
        return { result, expression: params.expression }
      } catch (error) {
        return { error: "计算错误", expression: params.expression }
      }
    },
  },
  {
    id: "web_search",
    name: "网络搜索",
    description: "搜索网络信息",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "搜索关键词" },
        limit: { type: "number", description: "结果数量限制" },
      },
      required: ["query"],
    },
    function: async (params) => {
      // 模拟网络搜索
      return {
        query: params.query,
        results: [
          { title: `关于 ${params.query} 的搜索结果 1`, url: "https://example.com/1" },
          { title: `关于 ${params.query} 的搜索结果 2`, url: "https://example.com/2" },
        ],
      }
    },
  },
  {
    id: "code_executor",
    name: "代码执行器",
    description: "执行Python代码",
    parameters: {
      type: "object",
      properties: {
        code: { type: "string", description: "Python代码" },
        language: { type: "string", description: "编程语言", default: "python" },
      },
      required: ["code"],
    },
    function: async (params) => {
      // 模拟代码执行
      return {
        code: params.code,
        output: `执行结果：\n模拟输出 - 代码已执行\n${params.code}`,
        language: params.language || "python",
      }
    },
  },
]

export function AgentManager({ userId, onExecuteAgent }: AgentManagerProps) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [executions, setExecutions] = useState<AgentExecution[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionInput, setExecutionInput] = useState("")

  const [newAgent, setNewAgent] = useState({
    name: "",
    description: "",
    systemPrompt: "",
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 2048,
    selectedTools: [] as string[],
  })

  // 预设Agent模板
  const agentTemplates = [
    {
      name: "数据分析助手",
      description: "专业的数据分析和计算助手",
      systemPrompt: "你是一个专业的数据分析助手，擅长数据处理、统计分析和数学计算。",
      tools: ["calculator", "code_executor"],
    },
    {
      name: "研究助手",
      description: "帮助进行信息搜索和研究",
      systemPrompt: "你是一个研究助手，能够搜索信息、分析数据并提供深入的见解。",
      tools: ["web_search", "calculator"],
    },
    {
      name: "编程助手",
      description: "代码编写和执行助手",
      systemPrompt: "你是一个编程助手，能够编写、执行和调试代码。",
      tools: ["code_executor", "calculator"],
    },
  ]

  const handleCreateAgent = () => {
    if (!newAgent.name.trim()) return

    const agent: Agent = {
      id: Date.now().toString(),
      name: newAgent.name,
      description: newAgent.description,
      systemPrompt: newAgent.systemPrompt,
      tools: availableTools.filter((tool) => newAgent.selectedTools.includes(tool.id)),
      model: newAgent.model,
      temperature: newAgent.temperature,
      maxTokens: newAgent.maxTokens,
      userId,
      createdAt: new Date(),
      isPublic: false,
    }

    setAgents((prev) => [...prev, agent])
    setSelectedAgent(agent)
    setNewAgent({
      name: "",
      description: "",
      systemPrompt: "",
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 2048,
      selectedTools: [],
    })
    setIsCreateOpen(false)
  }

  const handleExecuteAgent = async () => {
    if (!selectedAgent || !executionInput.trim()) return

    setIsExecuting(true)

    try {
      // 模拟Agent执行
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockExecution: AgentExecution = {
        id: Date.now().toString(),
        agentId: selectedAgent.id,
        input: executionInput,
        output: `Agent "${selectedAgent.name}" 执行结果：\n\n基于您的输入："${executionInput}"，我已经分析并处理了相关任务。\n\n执行过程中调用了以下工具：\n${selectedAgent.tools.map((tool) => `- ${tool.name}`).join("\n")}`,
        toolCalls: selectedAgent.tools.map((tool, index) => ({
          id: `call-${Date.now()}-${index}`,
          toolName: tool.name,
          parameters: { input: executionInput },
          result: `${tool.name} 执行结果`,
          timestamp: new Date(),
        })),
        status: "completed",
        startTime: new Date(),
        endTime: new Date(),
      }

      setExecutions((prev) => [mockExecution, ...prev])
      setExecutionInput("")
    } catch (error) {
      console.error("Agent执行失败:", error)
    } finally {
      setIsExecuting(false)
    }
  }

  const applyTemplate = (template: (typeof agentTemplates)[0]) => {
    setNewAgent((prev) => ({
      ...prev,
      name: template.name,
      description: template.description,
      systemPrompt: template.systemPrompt,
      selectedTools: template.tools,
    }))
  }

  const getToolIcon = (toolName: string) => {
    switch (toolName) {
      case "计算器":
        return <Calculator className="h-4 w-4" />
      case "网络搜索":
        return <Globe className="h-4 w-4" />
      case "代码执行器":
        return <Code className="h-4 w-4" />
      default:
        return <Tool className="h-4 w-4" />
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Agent 管理
          </h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                创建Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>创建 AI Agent</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="basic">
                <TabsList>
                  <TabsTrigger value="basic">基本信息</TabsTrigger>
                  <TabsTrigger value="tools">工具配置</TabsTrigger>
                  <TabsTrigger value="templates">模板</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Agent名称</Label>
                      <Input
                        value={newAgent.name}
                        onChange={(e) => setNewAgent((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="输入Agent名称"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>模型</Label>
                      <Select
                        value={newAgent.model}
                        onValueChange={(value) => setNewAgent((prev) => ({ ...prev, model: value }))}
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
                  </div>
                  <div className="space-y-2">
                    <Label>描述</Label>
                    <Input
                      value={newAgent.description}
                      onChange={(e) => setNewAgent((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="描述Agent的功能和用途"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>系统提示词</Label>
                    <Textarea
                      value={newAgent.systemPrompt}
                      onChange={(e) => setNewAgent((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                      placeholder="定义Agent的角色、能力和行为规范..."
                      className="min-h-[120px]"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="tools" className="space-y-4">
                  <div>
                    <Label className="text-base">选择工具</Label>
                    <p className="text-sm text-muted-foreground mb-4">为Agent配置可用的工具</p>
                    <div className="space-y-3">
                      {availableTools.map((tool) => (
                        <div key={tool.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={tool.id}
                            checked={newAgent.selectedTools.includes(tool.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewAgent((prev) => ({
                                  ...prev,
                                  selectedTools: [...prev.selectedTools, tool.id],
                                }))
                              } else {
                                setNewAgent((prev) => ({
                                  ...prev,
                                  selectedTools: prev.selectedTools.filter((id) => id !== tool.id),
                                }))
                              }
                            }}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={tool.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                            >
                              {getToolIcon(tool.name)}
                              {tool.name}
                            </label>
                            <p className="text-xs text-muted-foreground">{tool.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="templates" className="space-y-4">
                  <div>
                    <Label className="text-base">Agent模板</Label>
                    <p className="text-sm text-muted-foreground mb-4">选择预设模板快速创建Agent</p>
                    <div className="space-y-3">
                      {agentTemplates.map((template, index) => (
                        <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{template.name}</h4>
                                <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                                <div className="flex gap-1 flex-wrap">
                                  {template.tools.map((toolId) => {
                                    const tool = availableTools.find((t) => t.id === toolId)
                                    return (
                                      <Badge key={toolId} variant="outline" className="text-xs">
                                        {tool?.name}
                                      </Badge>
                                    )
                                  })}
                                </div>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => applyTemplate(template)}>
                                使用模板
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateAgent}>创建Agent</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Agent选择 */}
        <div className="space-y-2">
          <Label>选择Agent</Label>
          <div className="flex gap-2 flex-wrap">
            {agents.map((agent) => (
              <Button
                key={agent.id}
                variant={selectedAgent?.id === agent.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedAgent(agent)}
              >
                <Bot className="h-3 w-3 mr-1" />
                {agent.name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {agent.tools.length} 工具
                </Badge>
              </Button>
            ))}
            {agents.length === 0 && <p className="text-sm text-muted-foreground">暂无Agent，请先创建一个</p>}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedAgent ? (
          <Tabs defaultValue="execute" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-4">
              <TabsTrigger value="execute">执行任务</TabsTrigger>
              <TabsTrigger value="history">执行历史</TabsTrigger>
              <TabsTrigger value="config">Agent配置</TabsTrigger>
            </TabsList>

            <TabsContent value="execute" className="flex-1 p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    {selectedAgent.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{selectedAgent.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    {selectedAgent.tools.map((tool) => (
                      <Badge key={tool.id} variant="outline" className="flex items-center gap-1">
                        {getToolIcon(tool.name)}
                        {tool.name}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>任务输入</Label>
                    <Textarea
                      value={executionInput}
                      onChange={(e) => setExecutionInput(e.target.value)}
                      placeholder="描述您希望Agent执行的任务..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button
                    onClick={handleExecuteAgent}
                    disabled={!executionInput.trim() || isExecuting}
                    className="w-full"
                  >
                    {isExecuting ? (
                      <>
                        <Square className="h-4 w-4 mr-2" />
                        执行中...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        执行任务
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="flex-1 p-4">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {executions
                    .filter((exec) => exec.agentId === selectedAgent.id)
                    .map((execution) => (
                      <Card key={execution.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={execution.status === "completed" ? "default" : "secondary"}>
                                {execution.status === "completed" ? "已完成" : "执行中"}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {execution.startTime.toLocaleString()}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {execution.toolCalls.length} 工具调用
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">输入</Label>
                            <p className="text-sm bg-muted/50 p-2 rounded">{execution.input}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">输出</Label>
                            <p className="text-sm bg-muted/50 p-2 rounded whitespace-pre-wrap">{execution.output}</p>
                          </div>
                          {execution.toolCalls.length > 0 && (
                            <div>
                              <Label className="text-xs text-muted-foreground">工具调用</Label>
                              <div className="space-y-1">
                                {execution.toolCalls.map((call) => (
                                  <div key={call.id} className="text-xs bg-muted/30 p-2 rounded">
                                    <span className="font-medium">{call.toolName}</span>
                                    <span className="text-muted-foreground ml-2">{call.result}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                  {executions.filter((exec) => exec.agentId === selectedAgent.id).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bot className="h-8 w-8 mx-auto mb-2" />
                      <p>暂无执行历史</p>
                      <p className="text-xs">执行任务后将显示历史记录</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="config" className="flex-1 p-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Agent 配置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>模型</Label>
                      <p className="text-muted-foreground">{selectedAgent.model}</p>
                    </div>
                    <div>
                      <Label>创建时间</Label>
                      <p className="text-muted-foreground">{selectedAgent.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <Label>系统提示词</Label>
                    <div className="text-sm bg-muted/50 p-3 rounded mt-1 whitespace-pre-wrap">
                      {selectedAgent.systemPrompt}
                    </div>
                  </div>
                  <div>
                    <Label>可用工具</Label>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {selectedAgent.tools.map((tool) => (
                        <Badge key={tool.id} variant="outline" className="flex items-center gap-1">
                          {getToolIcon(tool.name)}
                          {tool.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Bot className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">选择或创建 Agent</h3>
              <p className="text-sm">选择一个现有的Agent或创建新的Agent开始使用</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
