export interface Tool {
  id: string
  name: string
  description: string
  parameters: Record<string, any>
  function: (params: any) => Promise<any>
}

export interface Agent {
  id: string
  name: string
  description: string
  systemPrompt: string
  tools: Tool[]
  model: string
  temperature: number
  maxTokens: number
  userId: string
  createdAt: Date
  isPublic: boolean
}

export interface AgentExecution {
  id: string
  agentId: string
  input: string
  output: string
  toolCalls: ToolCall[]
  status: "running" | "completed" | "failed"
  startTime: Date
  endTime?: Date
}

export interface ToolCall {
  id: string
  toolName: string
  parameters: Record<string, any>
  result: any
  timestamp: Date
}
