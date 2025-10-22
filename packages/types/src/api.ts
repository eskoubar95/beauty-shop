// API Configuration types
export interface ApiConfig {
  baseUrl: string
  timeout: number
  retries: number
  headers?: Record<string, string>
}

// Request types
export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  data?: any
  params?: Record<string, any>
  headers?: Record<string, string>
}

// Response types
export interface ApiResponse<T = any> {
  data: T
  message?: string
  status: number
  success: boolean
}

export interface PaginatedResponse<T = any> {
  data: T[]
  count: number
  offset: number
  limit: number
  has_more: boolean
}

// Error types
export interface ApiError {
  message: string
  code?: string
  status: number
  details?: Record<string, any>
  field_errors?: Record<string, string[]>
}

// Query types
export interface QueryParams {
  limit?: number
  offset?: number
  sort?: string
  order?: 'asc' | 'desc'
  search?: string
  filter?: Record<string, any>
}

// Webhook types
export interface WebhookEvent {
  id: string
  event: string
  data: any
  created_at: string
}

export interface WebhookConfig {
  url: string
  secret: string
  events: string[]
  active: boolean
}
