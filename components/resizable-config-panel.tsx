"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { RotateCcw, Settings, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ModelConfig {
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  systemPrompt: string
}

interface ResizableConfigPanelProps {
  selectedModel: string
  onModelChange: (model: string) => void
  config: ModelConfig
  onConfigChange: (config: ModelConfig) => void
  onResetConfig: () => void
  models: Array<{ id: string; name: string; provider: string }>
}

const MIN_WIDTH = 280
const MAX_WIDTH = 600
const DEFAULT_WIDTH = 350

export function ResizableConfigPanel({
  selectedModel,
  onModelChange,
  config,
  onConfigChange,
  onResetConfig,
  models,
}: ResizableConfigPanelProps) {
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)

  const updateConfig = (updates: Partial<ModelConfig>) => {
    onConfigChange({ ...config, ...updates })
  }

  // 开始拖拽
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsResizing(true)
      startXRef.current = e.clientX
      startWidthRef.current = width
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    },
    [width],
  )

  // 拖拽过程中
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return

      const deltaX = startXRef.current - e.clientX // 注意方向，向左拖拽增加宽度
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidthRef.current + deltaX))
      setWidth(newWidth)
    },
    [isResizing],
  )

  // 结束拖拽
  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
  }, [])

  // 监听全局鼠标事件
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  // 双击重置宽度
  const handleDoubleClick = () => {
    setWidth(DEFAULT_WIDTH)
  }

  // 切换折叠状态
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const ConfigContent = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {/* 标题和重置按钮 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          模型配置
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleCollapse} title={isCollapsed ? "展开面板" : "收起面板"}>
            {isCollapsed ? "展开" : "收起"}
          </Button>
          <Button variant="ghost" size="sm" onClick={onResetConfig} title="重置配置">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* 模型选择 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">模型选择</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>当前模型</Label>
                <Select value={selectedModel} onValueChange={onModelChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center gap-2">
                          <span>{model.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {model.provider}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                <p className="font-medium mb-1">当前选择：</p>
                <p>{models.find((m) => m.id === selectedModel)?.name}</p>
                <p>提供商：{models.find((m) => m.id === selectedModel)?.provider}</p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* 系统提示词 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">系统提示词</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>角色定义</Label>
                <Textarea
                  value={config.systemPrompt}
                  onChange={(e) => updateConfig({ systemPrompt: e.target.value })}
                  placeholder="设置AI的角色和行为..."
                  className="min-h-[100px] text-sm"
                />
                <p className="text-xs text-muted-foreground">定义AI助手的角色、专业领域和回答风格</p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* 生成参数 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">生成参数</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Temperature */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Temperature</Label>
                  <Badge variant="outline" className="text-xs">
                    {config.temperature}
                  </Badge>
                </div>
                <Slider
                  value={[config.temperature]}
                  onValueChange={([value]) => updateConfig({ temperature: value })}
                  max={2}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  <p className="mb-1">控制输出的随机性和创造性</p>
                  <div className="flex justify-between">
                    <span>保守 (0.0)</span>
                    <span>创新 (2.0)</span>
                  </div>
                </div>
              </div>

              {/* Max Tokens */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Max Tokens</Label>
                  <Badge variant="outline" className="text-xs">
                    {config.maxTokens}
                  </Badge>
                </div>
                <Slider
                  value={[config.maxTokens]}
                  onValueChange={([value]) => updateConfig({ maxTokens: value })}
                  max={4096}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  <p className="mb-1">限制生成内容的最大长度</p>
                  <div className="flex justify-between">
                    <span>简短 (1)</span>
                    <span>详细 (4096)</span>
                  </div>
                </div>
              </div>

              {/* Top P */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Top P</Label>
                  <Badge variant="outline" className="text-xs">
                    {config.topP}
                  </Badge>
                </div>
                <Slider
                  value={[config.topP]}
                  onValueChange={([value]) => updateConfig({ topP: value })}
                  max={1}
                  min={0}
                  step={0.01}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  <p className="mb-1">核采样参数，控制词汇选择范围</p>
                  <div className="flex justify-between">
                    <span>精确 (0.0)</span>
                    <span>多样 (1.0)</span>
                  </div>
                </div>
              </div>

              {/* Frequency Penalty */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Frequency Penalty</Label>
                  <Badge variant="outline" className="text-xs">
                    {config.frequencyPenalty}
                  </Badge>
                </div>
                <Slider
                  value={[config.frequencyPenalty]}
                  onValueChange={([value]) => updateConfig({ frequencyPenalty: value })}
                  max={2}
                  min={-2}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  <p className="mb-1">减少重复词汇的出现频率</p>
                  <div className="flex justify-between">
                    <span>允许重复 (-2.0)</span>
                    <span>避免重复 (2.0)</span>
                  </div>
                </div>
              </div>

              {/* Presence Penalty */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Presence Penalty</Label>
                  <Badge variant="outline" className="text-xs">
                    {config.presencePenalty}
                  </Badge>
                </div>
                <Slider
                  value={[config.presencePenalty]}
                  onValueChange={([value]) => updateConfig({ presencePenalty: value })}
                  max={2}
                  min={-2}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  <p className="mb-1">鼓励讨论新话题</p>
                  <div className="flex justify-between">
                    <span>重复话题 (-2.0)</span>
                    <span>新话题 (2.0)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 配置预设 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">快速预设</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent"
                onClick={() =>
                  updateConfig({
                    temperature: 0.1,
                    topP: 0.1,
                    frequencyPenalty: 0,
                    presencePenalty: 0,
                  })
                }
              >
                🎯 精确模式
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent"
                onClick={() =>
                  updateConfig({
                    temperature: 0.7,
                    topP: 0.9,
                    frequencyPenalty: 0,
                    presencePenalty: 0,
                  })
                }
              >
                ⚖️ 平衡模式
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent"
                onClick={() =>
                  updateConfig({
                    temperature: 1.2,
                    topP: 0.95,
                    frequencyPenalty: 0.5,
                    presencePenalty: 0.5,
                  })
                }
              >
                🎨 创意模式
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )

  return (
    <div className="flex">
      {/* 拖拽调整手柄 */}
      <div
        className={cn(
          "w-1 bg-border hover:bg-primary/50 cursor-col-resize flex items-center justify-center transition-colors group relative",
          isResizing && "bg-primary",
        )}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        title="拖拽调整宽度，双击重置"
      >
        <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
          <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* 配置面板 */}
      <div ref={panelRef} className="bg-muted/30 border-l flex flex-col" style={{ width: `${width}px` }}>
        <ConfigContent />
      </div>

      {/* 宽度指示器 */}
      {isResizing && (
        <div className="fixed top-4 right-4 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-mono z-50">
          {width}px
        </div>
      )}
    </div>
  )
}
