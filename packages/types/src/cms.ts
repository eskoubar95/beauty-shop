// CMS Content types
export interface Content {
  id: string
  title: string
  slug: string
  content: Record<string, any>
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  created_at: string
  updated_at: string
  author_id: string
  tags: string[]
  metadata?: Record<string, any>
}

export interface ContentBlock {
  id: string
  title: string
  content: Record<string, any>
  block_type: 'text' | 'image' | 'video' | 'gallery' | 'cta' | 'form' | 'custom'
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
  page_id?: string
  metadata?: Record<string, any>
}

export interface Page {
  id: string
  title: string
  slug: string
  content: ContentBlock[]
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  created_at: string
  updated_at: string
  author_id: string
  seo_title?: string
  seo_description?: string
  metadata?: Record<string, any>
}

export interface Media {
  id: string
  filename: string
  original_name: string
  mime_type: string
  size: number
  url: string
  alt_text?: string
  caption?: string
  created_at: string
  updated_at: string
  uploaded_by: string
  metadata?: Record<string, any>
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface Tag {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  created_at: string
  updated_at: string
}

// Form types
export interface Form {
  id: string
  name: string
  title: string
  description?: string
  fields: FormField[]
  settings: FormSettings
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
  submissions_count: number
}

export interface FormField {
  id: string
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file'
  required: boolean
  placeholder?: string
  help_text?: string
  validation?: FieldValidation
  options?: FormFieldOption[]
  position: number
}

export interface FormFieldOption {
  id: string
  label: string
  value: string
  position: number
}

export interface FieldValidation {
  min_length?: number
  max_length?: number
  min_value?: number
  max_value?: number
  pattern?: string
  message?: string
}

export interface FormSettings {
  submit_button_text: string
  success_message: string
  redirect_url?: string
  email_notifications: boolean
  notification_emails: string[]
  auto_responder: boolean
  auto_responder_subject?: string
  auto_responder_message?: string
}

export interface FormSubmission {
  id: string
  form_id: string
  data: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
  status: 'new' | 'read' | 'replied' | 'archived'
}

// Navigation types
export interface Navigation {
  id: string
  name: string
  items: NavigationItem[]
  created_at: string
  updated_at: string
}

export interface NavigationItem {
  id: string
  label: string
  url?: string
  page_id?: string
  external: boolean
  position: number
  parent_id?: string
  children?: NavigationItem[]
}

// Settings types
export interface SiteSettings {
  id: string
  site_name: string
  site_description?: string
  logo_url?: string
  favicon_url?: string
  theme: string
  primary_color: string
  secondary_color: string
  font_family: string
  created_at: string
  updated_at: string
}

// Search types
export interface SearchQuery {
  q: string
  type?: 'page' | 'content' | 'media' | 'all'
  category?: string
  tags?: string[]
  author?: string
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
}

export interface SearchResult {
  id: string
  type: 'page' | 'content' | 'media'
  title: string
  description?: string
  url: string
  score: number
  highlights?: Record<string, string[]>
  metadata?: Record<string, any>
}
