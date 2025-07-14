"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Plus, Search, Edit, Trash2, Tag, Copy, Download, Upload, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { PromptTemplate, PromptCategory } from "../types/prompt"

interface PromptManagerProps {
  onApplyPrompt: (prompt: string) => void
}

const defaultCategories: PromptCategory[] = [
  { id: "general", name: "通用", description: "通用助手提示词", color: "bg-blue-500" },
  { id: "coding", name: "编程", description: "编程相关提示词", color: "bg-green-500" },
  { id: "writing", name: "写作", description: "写作辅助提示词", color: "bg-purple-500" },
  { id: "analysis", name: "分析", description: "数据分析提示词", color: "bg-orange-500" },
  { id: "creative", name: "创意", description: "创意生成提示词", color: "bg-pink-500" },
  { id: "education", name: "教育", description: "教学辅导提示词", color: "bg-indigo-500" },
]

const builtInPrompts: PromptTemplate[] = [
  {
    id: "helpful-assistant",
    name: "通用助手",
    description: "友好、有帮助的AI助手",
    content: "你是一个友好、有帮助且知识渊博的AI助手。请以清晰、准确和有用的方式回答用户的问题。",
    category: "general",
    tags: ["通用", "友好"],
    createdAt: new Date(),
    updatedAt: new Date(),
    isBuiltIn: true,
  },
  {
    id: "code-reviewer",
    name: "代码审查专家",
    description: "专业的代码审查和优化建议",
    content:
      "你是一位经验丰富的软件工程师和代码审查专家。请仔细分析提供的代码，指出潜在问题、改进建议，并提供最佳实践建议。重点关注：\n1. 代码质量和可读性\n2. 性能优化\n3. 安全性问题\n4. 最佳实践\n5. 潜在的bug",
    category: "coding",
    tags: ["代码审查", "编程", "优化"],
    createdAt: new Date(),
    updatedAt: new Date(),
    isBuiltIn: true,
  },
  {
    id: "creative-writer",
    name: "创意写作助手",
    description: "帮助进行创意写作和内容创作",
    content:
      "你是一位富有创意的写作助手，擅长各种文体的创作。请根据用户的需求，提供有创意、引人入胜的内容。注意保持文风优美、逻辑清晰，并根据具体要求调整语调和风格。",
    category: "writing",
    tags: ["写作", "创意", "内容创作"],
    createdAt: new Date(),
    updatedAt: new Date(),
    isBuiltIn: true,
  },
  {
    id: "data-analyst",
    name: "数据分析师",
    description: "专业的数据分析和洞察",
    content:
      "你是一位专业的数据分析师，擅长从数据中提取有价值的洞察。请帮助用户：\n1. 分析数据趋势和模式\n2. 提供统计学见解\n3. 建议合适的分析方法\n4. 解释分析结果的业务含义\n5. 推荐数据可视化方案",
    category: "analysis",
    tags: ["数据分析", "统计", "洞察"],
    createdAt: new Date(),
    updatedAt: new Date(),
    isBuiltIn: true,
  },
  {
    id: "teacher",
    name: "教学导师",
    description: "耐心的教学指导",
    content:
      "你是一位耐心、专业的教学导师。请用通俗易懂的方式解释复杂概念，提供循序渐进的学习指导。在教学过程中：\n1. 使用简单明了的语言\n2. 提供具体的例子和类比\n3. 鼓励提问和互动\n4. 根据学习者水平调整难度\n5. 提供练习建议",
    category: "education",
    tags: ["教学", "指导", "解释"],
    createdAt: new Date(),
    updatedAt: new Date(),
    isBuiltIn: true,
  },
]

export function PromptManager({ onApplyPrompt }: PromptManagerProps) {
  const [prompts, setPrompts] = useState<PromptTemplate[]>(builtInPrompts)
  const [categories] = useState<PromptCategory[]>(defaultCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<PromptTemplate | null>(null)

  const [newPrompt, setNewPrompt] = useState({
    name: "",
    description: "",
    content: "",
    category: "general",
    tags: "",
  })

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchesSearch =
        prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [prompts, searchTerm, selectedCategory])

  const handleCreatePrompt = () => {
    if (!newPrompt.name.trim() || !newPrompt.content.trim()) return

    const prompt: PromptTemplate = {
      id: Date.now().toString(),
      name: newPrompt.name,
      description: newPrompt.description,
      content: newPrompt.content,
      category: newPrompt.category,
      tags: newPrompt.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
      isBuiltIn: false,
    }

    setPrompts((prev) => [...prev, prompt])
    setNewPrompt({ name: "", description: "", content: "", category: "general", tags: "" })
    setIsCreateDialogOpen(false)
  }

  const handleEditPrompt = (prompt: PromptTemplate) => {
    if (prompt.isBuiltIn) return
    setEditingPrompt(prompt)
    setNewPrompt({
      name: prompt.name,
      description: prompt.description,
      content: prompt.content,
      category: prompt.category,
      tags: prompt.tags.join(", "),
    })
  }

  const handleUpdatePrompt = () => {
    if (!editingPrompt || !newPrompt.name.trim() || !newPrompt.content.trim()) return

    setPrompts((prev) =>
      prev.map((p) =>
        p.id === editingPrompt.id
          ? {
              ...p,
              name: newPrompt.name,
              description: newPrompt.description,
              content: newPrompt.content,
              category: newPrompt.category,
              tags: newPrompt.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
              updatedAt: new Date(),
            }
          : p,
      ),
    )

    setEditingPrompt(null)
    setNewPrompt({ name: "", description: "", content: "", category: "general", tags: "" })
  }

  const handleDeletePrompt = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleCopyPrompt = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const exportPrompts = () => {
    const userPrompts = prompts.filter((p) => !p.isBuiltIn)
    const blob = new Blob([JSON.stringify(userPrompts, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `prompts-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importPrompts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedPrompts = JSON.parse(e.target?.result as string)
        setPrompts((prev) => [
          ...prev,
          ...importedPrompts.map((p: any) => ({
            ...p,
            id: Date.now().toString() + Math.random(),
            isBuiltIn: false,
          })),
        ])
      } catch (error) {
        console.error("导入失败:", error)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Prompt 管理</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={exportPrompts}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <label>
                <Upload className="h-4 w-4" />
                <input type="file" accept=".json" onChange={importPrompts} className="hidden" />
              </label>
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  新建
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingPrompt ? "编辑" : "创建"} Prompt</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>名称</Label>
                      <Input
                        value={newPrompt.name}
                        onChange={(e) => setNewPrompt((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Prompt名称"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>分类</Label>
                      <Select
                        value={newPrompt.category}
                        onValueChange={(value) => setNewPrompt((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>描述</Label>
                    <Input
                      value={newPrompt.description}
                      onChange={(e) => setNewPrompt((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="简短描述这个Prompt的用途"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>标签</Label>
                    <Input
                      value={newPrompt.tags}
                      onChange={(e) => setNewPrompt((prev) => ({ ...prev, tags: e.target.value }))}
                      placeholder="用逗号分隔多个标签"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prompt内容</Label>
                    <Textarea
                      value={newPrompt.content}
                      onChange={(e) => setNewPrompt((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="输入完整的Prompt内容..."
                      className="min-h-[200px]"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreateDialogOpen(false)
                        setEditingPrompt(null)
                        setNewPrompt({ name: "", description: "", content: "", category: "general", tags: "" })
                      }}
                    >
                      取消
                    </Button>
                    <Button onClick={editingPrompt ? handleUpdatePrompt : handleCreatePrompt}>
                      {editingPrompt ? "更新" : "创建"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索Prompt..."
              className="pl-10"
            />
          </div>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
              <TabsTrigger value="all" className="text-xs">
                全部
              </TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Prompt列表 */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-sm">{prompt.name}</CardTitle>
                      {prompt.isBuiltIn && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          内置
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          backgroundColor: categories.find((c) => c.id === prompt.category)?.color + "20",
                          borderColor: categories.find((c) => c.id === prompt.category)?.color,
                        }}
                      >
                        {categories.find((c) => c.id === prompt.category)?.name}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{prompt.description}</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      {prompt.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button variant="ghost" size="sm" onClick={() => onApplyPrompt(prompt.content)}>
                      应用
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleCopyPrompt(prompt.content)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                    {!prompt.isBuiltIn && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => handleEditPrompt(prompt)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeletePrompt(prompt.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded max-h-20 overflow-y-auto">
                  {prompt.content}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPrompts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>没有找到匹配的Prompt</p>
              <p className="text-xs mt-1">尝试调整搜索条件或创建新的Prompt</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 编辑对话框 */}
      {editingPrompt && (
        <Dialog open={!!editingPrompt} onOpenChange={() => setEditingPrompt(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>编辑 Prompt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>名称</Label>
                  <Input
                    value={newPrompt.name}
                    onChange={(e) => setNewPrompt((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Prompt名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label>分类</Label>
                  <Select
                    value={newPrompt.category}
                    onValueChange={(value) => setNewPrompt((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>描述</Label>
                <Input
                  value={newPrompt.description}
                  onChange={(e) => setNewPrompt((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="简短描述这个Prompt的用途"
                />
              </div>
              <div className="space-y-2">
                <Label>标签</Label>
                <Input
                  value={newPrompt.tags}
                  onChange={(e) => setNewPrompt((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="用逗号分隔多个标签"
                />
              </div>
              <div className="space-y-2">
                <Label>Prompt内容</Label>
                <Textarea
                  value={newPrompt.content}
                  onChange={(e) => setNewPrompt((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="输入完整的Prompt内容..."
                  className="min-h-[200px]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingPrompt(null)
                    setNewPrompt({ name: "", description: "", content: "", category: "general", tags: "" })
                  }}
                >
                  取消
                </Button>
                <Button onClick={handleUpdatePrompt}>更新</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
