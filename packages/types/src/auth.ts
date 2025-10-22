// Authentication types
export interface AuthUser {
  id: string
  email: string
  first_name?: string
  last_name?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface AuthSession {
  user: AuthUser
  access_token: string
  refresh_token?: string
  expires_at: number
  created_at: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember_me?: boolean
}

export interface RegisterData {
  email: string
  password: string
  first_name?: string
  last_name?: string
  terms_accepted: boolean
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  password: string
}

export interface AuthProvider {
  id: string
  name: string
  enabled: boolean
  config: Record<string, any>
}

// Clerk specific types
export interface ClerkUser {
  id: string
  email_addresses: Array<{
    id: string
    email_address: string
    verification: {
      status: string
    }
  }>
  first_name?: string
  last_name?: string
  image_url?: string
  created_at: number
  updated_at: number
}

export interface ClerkSession {
  id: string
  user: ClerkUser
  status: string
  last_active_at: number
  expire_at: number
  abandon_at: number
}

// Permission types
export interface Permission {
  id: string
  name: string
  description?: string
  resource: string
  action: string
}

export interface Role {
  id: string
  name: string
  description?: string
  permissions: Permission[]
  created_at: string
  updated_at: string
}

export interface UserRole {
  user_id: string
  role_id: string
  assigned_at: string
  assigned_by: string
}

// JWT types
export interface JwtPayload {
  sub: string
  email: string
  iat: number
  exp: number
  iss?: string
  aud?: string
  jti?: string
}

// OAuth types
export interface OAuthProvider {
  id: string
  name: string
  client_id: string
  client_secret: string
  redirect_uri: string
  scopes: string[]
  enabled: boolean
}

export interface OAuthCallback {
  code: string
  state?: string
  error?: string
  error_description?: string
}
