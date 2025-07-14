"use client"

import { RotateCcw, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ModelConfig {
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  systemPrompt: string
}

interface RightConfigPanelProps {
  selectedModel: string
  onModelChange: (model: string) => void
  config: ModelConfig
  onConfigChange: (config: ModelConfig) => void
  onResetConfig: () => void
  models: Array<{ id: string; name: string; provider: string }>
}

export function RightConfigPanel({
  selectedModel,
  onModelChange,
  config,
  onConfigChange,
  onResetConfig,
  models,
}: RightConfigPanelProps) {
  const updateConfig = (updates: Partial<ModelConfig>) => {
    onConfigChange({ ...config, ...updates })
  }

  return (
    <div className="w-80 border-l bg-muted/30 p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* 标题和重置按钮 */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            模型配置
          </h2>
          <Button variant="ghost" size="sm" onClick={onResetConfig} title="重置配置">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

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
      </div>
    </div>
  )
}
