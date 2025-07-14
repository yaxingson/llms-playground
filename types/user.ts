export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: "admin" | "user" | "guest"
  createdAt: Date
  lastLoginAt: Date
  preferences: {
    theme: "light" | "dark" | "system"
    defaultModel: string
    autoSave: boolean
  }
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
