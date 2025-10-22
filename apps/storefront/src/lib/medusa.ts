// Note: Environment validation will be handled by the config package
// when it's properly integrated

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

export interface MedusaResponse<T = any> {
  data: T
  message?: string
  status: number
}

export class MedusaError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message)
    this.name = 'MedusaError'
  }
}

export async function medusaRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<MedusaResponse<T>> {
  const url = `${MEDUSA_BACKEND_URL}${endpoint}`
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new MedusaError(
        `MedusaJS request failed: ${response.statusText}`,
        response.status,
        response
      )
    }

    const data = await response.json()
    
    return {
      data,
      status: response.status,
    }
  } catch (error) {
    if (error instanceof MedusaError) {
      throw error
    }
    
    throw new MedusaError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0
    )
  }
}

export async function testMedusaConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/health`, { method: 'GET' })
    if (!response.ok) {
      console.error(`MedusaJS connection test failed: Status ${response.status}`)
      return false
    }
    const data = await response.text() // Health endpoint returns plain text "OK"
    return data === 'OK'
  } catch (error: any) {
    console.error('MedusaJS connection test failed:', error.message)
    return false
  }
}

// Product API functions
export async function getProducts(params?: {
  limit?: number
  offset?: number
  category_id?: string
  collection_id?: string
}) {
  const searchParams = new URLSearchParams()
  
  if (params?.limit) searchParams.set('limit', params.limit.toString())
  if (params?.offset) searchParams.set('offset', params.offset.toString())
  if (params?.category_id) searchParams.set('category_id', params.category_id)
  if (params?.collection_id) searchParams.set('collection_id', params.collection_id)

  const queryString = searchParams.toString()
  const endpoint = `/store/products${queryString ? `?${queryString}` : ''}`
  
  return medusaRequest(endpoint)
}

export async function getProduct(id: string) {
  return medusaRequest(`/store/products/${id}`)
}

export async function getCategories() {
  return medusaRequest('/store/product-categories')
}

export async function getCollections() {
  return medusaRequest('/store/collections')
}

// Cart API functions
export async function createCart() {
  return medusaRequest('/store/carts', {
    method: 'POST',
  })
}

export async function getCart(id: string) {
  return medusaRequest(`/store/carts/${id}`)
}

export async function addToCart(cartId: string, variantId: string, quantity: number = 1) {
  return medusaRequest(`/store/carts/${cartId}/line-items`, {
    method: 'POST',
    body: JSON.stringify({
      variant_id: variantId,
      quantity,
    }),
  })
}

export async function updateCartItem(cartId: string, lineItemId: string, quantity: number) {
  return medusaRequest(`/store/carts/${cartId}/line-items/${lineItemId}`, {
    method: 'POST',
    body: JSON.stringify({ quantity }),
  })
}

export async function removeFromCart(cartId: string, lineItemId: string) {
  return medusaRequest(`/store/carts/${cartId}/line-items/${lineItemId}`, {
    method: 'DELETE',
  })
}
