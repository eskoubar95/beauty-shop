// User types
export interface User {
  id: string
  clerk_user_id: string
  email: string
  first_name?: string
  last_name?: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  clerk_user_id: string
  email: string
  first_name?: string
  last_name?: string
  created_at: string
}

// Product types
export interface Product {
  id: string
  title: string
  description?: string
  handle: string
  status: 'draft' | 'proposed' | 'published' | 'rejected'
  thumbnail?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  metadata?: Record<string, any>
  type_id?: string
  collection_id?: string
  category_id?: string
  discountable: boolean
  external_id?: string
  sales_channels?: any[]
  variants?: ProductVariant[]
  options?: any[]
  tags?: any[]
  type?: any
  collection?: any
  categories?: any[]
}

export interface ProductVariant {
  id: string
  title: string
  product_id: string
  prices?: MoneyAmount[]
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  variant_rank?: number
  inventory_quantity: number
  allow_backorder: boolean
  manage_inventory: boolean
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  created_at: string
  updated_at: string
  deleted_at?: string
  metadata?: Record<string, any>
  product?: Product
  options?: any[]
}

// Order types
export interface Order {
  id: string
  status: 'pending' | 'completed' | 'archived' | 'canceled' | 'requires_action'
  fulfillment_status: 'not_fulfilled' | 'partially_fulfilled' | 'fulfilled' | 'partially_shipped' | 'shipped' | 'partially_returned' | 'returned' | 'canceled' | 'requires_action'
  payment_status: 'not_paid' | 'awaiting' | 'captured' | 'partially_refunded' | 'refunded' | 'canceled' | 'requires_action'
  display_id: number
  cart_id?: string
  customer_id?: string
  email?: string
  billing_address_id?: string
  shipping_address_id?: string
  region_id: string
  currency_code: string
  tax_rate?: number
  discounts?: any[]
  gift_cards?: any[]
  shipping_methods?: any[]
  payments?: any[]
  fulfillments?: any[]
  returns?: any[]
  claims?: any[]
  refunds?: any[]
  swaps?: any[]
  draft_order_id?: string
  items?: any[]
  edits?: any[]
  gift_card_transactions?: any[]
  canceled_at?: string
  metadata?: Record<string, any>
  sales_channel_id?: string
  shipping_total?: number
  discount_total?: number
  tax_total?: number
  refunded_total?: number
  total?: number
  subtotal?: number
  paid_total?: number
  refundable_amount?: number
  gift_card_total?: number
  gift_card_tax_total?: number
  returnable_items?: any[]
  created_at: string
  updated_at: string
  region?: Region
  customer?: any
  billing_address?: Address
  shipping_address?: Address
  sales_channel?: any
}

// Subscription types
export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'trialing'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  canceled_at?: string
  created_at: string
  updated_at: string
}

// Content types
export interface ContentBlock {
  id: string
  title: string
  content: Record<string, any>
  block_type: string
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Common types
export interface MoneyAmount {
  id: string
  currency_code: string
  amount: number
  min_quantity?: number
  max_quantity?: number
  price_list_id?: string
  variant_id?: string
  region_id?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Address {
  id: string
  customer_id?: string
  company?: string
  first_name?: string
  last_name?: string
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  province?: string
  postal_code?: string
  phone?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Region {
  id: string
  name: string
  currency_code: string
  tax_rate: number
  tax_code?: string
  gift_cards_taxable: boolean
  automatic_taxes: boolean
  countries?: Country[]
  tax_providers?: any[]
  payment_providers?: any[]
  fulfillment_providers?: any[]
  created_at: string
  updated_at: string
  deleted_at?: string
  metadata?: Record<string, any>
}

export interface Country {
  id: string
  iso_2: string
  iso_3: string
  num_code: number
  name: string
  display_name: string
  region_id?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  offset: number
  limit: number
}

// Error types
export interface ApiError {
  message: string
  code?: string
  status: number
  details?: Record<string, any>
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

// Theme types
export interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    destructive: string
  }
  fonts: {
    sans: string[]
    serif: string[]
    mono: string[]
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
}

// Export all types
export * from './api'
export * from './auth'
export * from './cms'
