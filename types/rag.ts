export interface Document {
  id: string
  name: string
  content: string
  type: "text" | "pdf" | "docx" | "md"
  size: number
  uploadedAt: Date
  userId: string
  chunks: DocumentChunk[]
  metadata: Record<string, any>
}

export interface DocumentChunk {
  id: string
  content: string
  embedding?: number[]
  metadata: Record<string, any>
  documentId: string
}

export interface KnowledgeBase {
  id: string
  name: string
  description: string
  documents: Document[]
  createdAt: Date
  userId: string
  isPublic: boolean
}

export interface RAGQuery {
  query: string
  knowledgeBaseId: string
  topK: number
  threshold: number
}

export interface RAGResult {
  answer: string
  sources: DocumentChunk[]
  confidence: number
}
