export interface PromptTemplate {
  id: string
  name: string
  description: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isBuiltIn: boolean
}

export interface PromptCategory {
  id: string
  name: string
  description: string
  color: string
}
