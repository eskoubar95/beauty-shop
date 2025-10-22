import payload from 'payload'

export async function checkDatabaseHealth(): Promise<{
  healthy: boolean
  error?: string
}> {
  try {
    // Test read operation
    await payload.find({
      collection: 'users',
      limit: 1,
    })
    
    return { healthy: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Database health check failed:', errorMessage)
    return { healthy: false, error: errorMessage }
  }
}

export async function testPayloadConnection(): Promise<boolean> {
  const result = await checkDatabaseHealth()
  return result.healthy
}
