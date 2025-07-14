"use client"

import { useState, useRef } from "react"
import { Upload, FileText, Search, Database, Trash2, Plus, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import type { Document, KnowledgeBase, RAGQuery, RAGResult } from "../types/rag"

interface RAGManagerProps {
  onRAGQuery: (query: RAGQuery) => Promise<RAGResult>
  userId: string
}

export function RAGManager({ onRAGQuery, userId }: RAGManagerProps) {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([])
  const [selectedKB, setSelectedKB] = useState<string>("")
  const [documents, setDocuments] = useState<Document[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [ragQuery, setRagQuery] = useState("")
  const [ragResults, setRagResults] = useState<RAGResult | null>(null)
  const [isQuerying, setIsQuerying] = useState(false)
  const [queryParams, setQueryParams] = useState({
    topK: 5,
    threshold: 0.7,
  })
  const [isCreateKBOpen, setIsCreateKBOpen] = useState(false)
  const [newKB, setNewKB] = useState({ name: "", description: "" })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 模拟知识库数据
  const mockKnowledgeBases: KnowledgeBase[] = [
    {
      id: "kb1",
      name: "技术文档",
      description: "编程和技术相关文档",
      documents: [],
      createdAt: new Date(),
      userId,
      isPublic: false,
    },
    {
      id: "kb2",
      name: "产品手册",
      description: "产品使用说明和FAQ",
      documents: [],
      createdAt: new Date(),
      userId,
      isPublic: true,
    },
  ]

  useState(() => {
    setKnowledgeBases(mockKnowledgeBases)
    setSelectedKB(mockKnowledgeBases[0]?.id || "")
  })

  const handleFileUpload = async (files: FileList) => {
    if (!selectedKB) return

    setIsUploading(true)
    setUploadProgress(0)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // 模拟文件上传和处理
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 10
        })
      }, 200)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newDocument: Document = {
        id: Date.now().toString() + i,
        name: file.name,
        content: `这是 ${file.name} 的模拟内容。在实际应用中，这里会是文件的实际内容。`,
        type: (file.name.split(".").pop() as any) || "text",
        size: file.size,
        uploadedAt: new Date(),
        userId,
        chunks: [
          {
            id: `chunk-${Date.now()}-${i}`,
            content: `${file.name} 的第一个文档块内容...`,
            metadata: { page: 1, section: "introduction" },
            documentId: Date.now().toString() + i,
          },
        ],
        metadata: { source: "upload" },
      }

      setDocuments((prev) => [...prev, newDocument])
    }

    setIsUploading(false)
    setUploadProgress(0)
  }

  const handleRAGQuery = async () => {
    if (!ragQuery.trim() || !selectedKB) return

    setIsQuerying(true)

    try {
      // 模拟RAG查询
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockResult: RAGResult = {
        answer: `基于知识库中的文档，我找到了以下相关信息来回答您的问题："${ragQuery}"。\n\n根据检索到的文档内容，这个问题的答案是...（这里是模拟的RAG生成回答）`,
        sources: documents.slice(0, queryParams.topK).flatMap((doc) => doc.chunks),
        confidence: 0.85,
      }

      setRagResults(mockResult)
    } catch (error) {
      console.error("RAG查询失败:", error)
    } finally {
      setIsQuerying(false)
    }
  }

  const handleCreateKB = () => {
    if (!newKB.name.trim()) return

    const kb: KnowledgeBase = {
      id: Date.now().toString(),
      name: newKB.name,
      description: newKB.description,
      documents: [],
      createdAt: new Date(),
      userId,
      isPublic: false,
    }

    setKnowledgeBases((prev) => [...prev, kb])
    setSelectedKB(kb.id)
    setNewKB({ name: "", description: "" })
    setIsCreateKBOpen(false)
  }

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5" />
            RAG 检索增强生成
          </h2>
          <Dialog open={isCreateKBOpen} onOpenChange={setIsCreateKBOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                新建知识库
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建知识库</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>知识库名称</Label>
                  <Input
                    value={newKB.name}
                    onChange={(e) => setNewKB((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="输入知识库名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label>描述</Label>
                  <Textarea
                    value={newKB.description}
                    onChange={(e) => setNewKB((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="描述知识库的用途和内容"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateKBOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleCreateKB}>创建</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 知识库选择 */}
        <div className="space-y-2">
          <Label>选择知识库</Label>
          <div className="flex gap-2 flex-wrap">
            {knowledgeBases.map((kb) => (
              <Button
                key={kb.id}
                variant={selectedKB === kb.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedKB(kb.id)}
              >
                <Database className="h-3 w-3 mr-1" />
                {kb.name}
                {kb.isPublic && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    公开
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="query" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="query">智能问答</TabsTrigger>
          <TabsTrigger value="documents">文档管理</TabsTrigger>
          <TabsTrigger value="settings">检索设置</TabsTrigger>
        </TabsList>

        <TabsContent value="query" className="flex-1 p-4 space-y-4">
          {/* RAG查询界面 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">智能问答</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  value={ragQuery}
                  onChange={(e) => setRagQuery(e.target.value)}
                  placeholder="输入您的问题，系统将基于知识库内容为您回答..."
                  className="min-h-[80px]"
                />
                <Button onClick={handleRAGQuery} disabled={!ragQuery.trim() || isQuerying} className="px-6">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {isQuerying && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  正在检索相关文档并生成回答...
                </div>
              )}

              {ragResults && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">AI 回答</h4>
                      <Badge variant="outline">置信度: {(ragResults.confidence * 100).toFixed(1)}%</Badge>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{ragResults.answer}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">参考来源</h4>
                    <div className="space-y-2">
                      {ragResults.sources.map((source, index) => (
                        <Card key={source.id} className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Badge variant="outline" className="mb-2">
                                来源 {index + 1}
                              </Badge>
                              <p className="text-sm text-muted-foreground">{source.content}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="flex-1 p-4 space-y-4">
          {/* 文档上传 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">文档管理</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".txt,.pdf,.docx,.md"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="hidden"
                />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">拖拽文件到此处或点击上传</p>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  选择文件
                </Button>
                <p className="text-xs text-muted-foreground mt-2">支持 TXT, PDF, DOCX, MD 格式</p>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>上传进度</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {/* 文档列表 */}
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(doc.size / 1024).toFixed(1)} KB • {doc.uploadedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {doc.chunks.length} 块
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {documents.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p>暂无文档</p>
                      <p className="text-xs">上传文档开始构建知识库</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="flex-1 p-4 space-y-4">
          {/* 检索参数设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">检索参数</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>检索数量 (Top K)</Label>
                  <span className="text-sm text-muted-foreground">{queryParams.topK}</span>
                </div>
                <Slider
                  value={[queryParams.topK]}
                  onValueChange={([value]) => setQueryParams((prev) => ({ ...prev, topK: value }))}
                  max={20}
                  min={1}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">返回最相关的文档块数量</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>相似度阈值</Label>
                  <span className="text-sm text-muted-foreground">{queryParams.threshold}</span>
                </div>
                <Slider
                  value={[queryParams.threshold]}
                  onValueChange={([value]) => setQueryParams((prev) => ({ ...prev, threshold: value }))}
                  max={1}
                  min={0}
                  step={0.1}
                />
                <p className="text-xs text-muted-foreground">过滤低相似度的文档块</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
