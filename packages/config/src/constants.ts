// App constants
export const APP_CONSTANTS = {
  NAME: 'Beauty Shop',
  DESCRIPTION: 'Premium beauty and skincare products',
  VERSION: '1.0.0',
  AUTHOR: 'Beauty Shop Team',
  SUPPORT_EMAIL: 'support@beautyshop.com',
  PRIVACY_POLICY_URL: '/privacy',
  TERMS_OF_SERVICE_URL: '/terms',
  COOKIE_POLICY_URL: '/cookies',
} as const

// API endpoints
export const API_ENDPOINTS = {
  // MedusaJS
  MEDUSA: {
    BASE: '/api/medusa',
    PRODUCTS: '/api/medusa/products',
    CART: '/api/medusa/cart',
    ORDERS: '/api/medusa/orders',
    CUSTOMERS: '/api/medusa/customers',
    REGIONS: '/api/medusa/regions',
    PAYMENT_COLLECTIONS: '/api/medusa/payment-collections',
    SHIPPING_OPTIONS: '/api/medusa/shipping-options',
  },
  // Payload CMS
  CMS: {
    BASE: '/api/cms',
    PAGES: '/api/cms/pages',
    CONTENT_BLOCKS: '/api/cms/content-blocks',
    MEDIA: '/api/cms/media',
    FORMS: '/api/cms/forms',
    NAVIGATION: '/api/cms/navigation',
  },
  // Custom APIs
  CUSTOM: {
    BASE: '/api/custom',
    HEALTH: '/api/custom/health',
    SUBSCRIPTIONS: '/api/custom/subscriptions',
    USER_PROFILE: '/api/custom/user-profile',
  },
} as const

// Database schemas
export const DB_SCHEMAS = {
  MEDUSA: 'medusa',
  BEAUTY_SHOP: 'beauty_shop',
  PAYLOAD: 'payload',
} as const

// Table names
export const DB_TABLES = {
  USER_PROFILES: 'user_profiles',
  SUBSCRIPTIONS: 'subscriptions',
  CONTENT_BLOCKS: 'content_blocks',
  MEDIA: 'media',
  FORMS: 'forms',
  FORM_SUBMISSIONS: 'form_submissions',
} as const

// Payment providers
export const PAYMENT_PROVIDERS = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  KLARNA: 'klarna',
} as const

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
  CANCELED: 'canceled',
  REQUIRES_ACTION: 'requires_action',
} as const

// Fulfillment statuses
export const FULFILLMENT_STATUS = {
  NOT_FULFILLED: 'not_fulfilled',
  PARTIALLY_FULFILLED: 'partially_fulfilled',
  FULFILLED: 'fulfilled',
  PARTIALLY_SHIPPED: 'partially_shipped',
  SHIPPED: 'shipped',
  PARTIALLY_RETURNED: 'partially_returned',
  RETURNED: 'returned',
  CANCELED: 'canceled',
  REQUIRES_ACTION: 'requires_action',
} as const

// Payment statuses
export const PAYMENT_STATUS = {
  NOT_PAID: 'not_paid',
  AWAITING: 'awaiting',
  CAPTURED: 'captured',
  PARTIALLY_REFUNDED: 'partially_refunded',
  REFUNDED: 'refunded',
  CANCELED: 'canceled',
  REQUIRES_ACTION: 'requires_action',
} as const

// Subscription statuses
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELED: 'canceled',
  PAST_DUE: 'past_due',
  UNPAID: 'unpaid',
  INCOMPLETE: 'incomplete',
  INCOMPLETE_EXPIRED: 'incomplete_expired',
  TRIALING: 'trialing',
} as const

// Content statuses
export const CONTENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CUSTOMER: 'customer',
  GUEST: 'guest',
} as const

// Permissions
export const PERMISSIONS = {
  // User permissions
  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  USER_DELETE: 'user:delete',
  
  // Product permissions
  PRODUCT_READ: 'product:read',
  PRODUCT_WRITE: 'product:write',
  PRODUCT_DELETE: 'product:delete',
  
  // Order permissions
  ORDER_READ: 'order:read',
  ORDER_WRITE: 'order:write',
  ORDER_DELETE: 'order:delete',
  
  // Content permissions
  CONTENT_READ: 'content:read',
  CONTENT_WRITE: 'content:write',
  CONTENT_DELETE: 'content:delete',
  
  // Admin permissions
  ADMIN_READ: 'admin:read',
  ADMIN_WRITE: 'admin:write',
  ADMIN_DELETE: 'admin:delete',
} as const

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain', 'application/msword'],
  MAX_FILES_PER_UPLOAD: 10,
} as const

// Pagination defaults
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0,
} as const

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 300,    // 5 minutes
  MEDIUM: 1800,  // 30 minutes
  LONG: 3600,    // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const

// Rate limiting
export const RATE_LIMITS = {
  API: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_ATTEMPTS: 5,
  },
  UPLOAD: {
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
    MAX_UPLOADS: 50,
  },
} as const

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: 'enable_analytics',
  ENABLE_ERROR_TRACKING: 'enable_error_tracking',
  ENABLE_FEATURE_FLAGS: 'enable_feature_flags',
  ENABLE_SUBSCRIPTIONS: 'enable_subscriptions',
  ENABLE_REVIEWS: 'enable_reviews',
  ENABLE_WISHLIST: 'enable_wishlist',
  ENABLE_NOTIFICATIONS: 'enable_notifications',
} as const

// Error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const
