#!/usr/bin/env node

const https = require('https')
const http = require('http')

async function checkService(url, name, timeout = 5000) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http
    
    const req = client.get(url, (res) => {
      resolve({ 
        name, 
        status: 'ok', 
        code: res.statusCode,
        responseTime: Date.now() - startTime
      })
    })
    
    const startTime = Date.now()
    
    req.on('error', (err) => {
      resolve({ 
        name, 
        status: 'error', 
        error: err.message,
        responseTime: Date.now() - startTime
      })
    })
    
    req.setTimeout(timeout, () => {
      req.destroy()
      resolve({ 
        name, 
        status: 'timeout',
        responseTime: timeout
      })
    })
  })
}

async function checkDatabase() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    return { name: 'Database', status: 'skipped', reason: 'DATABASE_URL not set' }
  }
  
  // Basic URL validation
  if (!dbUrl.startsWith('postgresql://')) {
    return { name: 'Database', status: 'error', reason: 'Invalid DATABASE_URL format' }
  }
  
  return { name: 'Database', status: 'ok', reason: 'URL format valid' }
}

async function checkRedis() {
  const redisUrl = process.env.REDIS_URL
  if (!redisUrl) {
    return { name: 'Redis', status: 'skipped', reason: 'REDIS_URL not set' }
  }
  
  // Basic URL validation
  if (!redisUrl.startsWith('redis://')) {
    return { name: 'Redis', status: 'error', reason: 'Invalid REDIS_URL format' }
  }
  
  return { name: 'Redis', status: 'ok', reason: 'URL format valid' }
}

async function healthCheck() {
  console.log('🔍 Running environment health check...\n')
  
  const checks = []
  
  // Database check
  checks.push(await checkDatabase())
  
  // Redis check
  checks.push(await checkRedis())
  
  // API health checks
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (apiUrl) {
    checks.push(await checkService(`${apiUrl}/health`, 'Backend API'))
  } else {
    checks.push({ name: 'Backend API', status: 'skipped', reason: 'NEXT_PUBLIC_API_URL not set' })
  }
  
  // Frontend health check
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (siteUrl) {
    checks.push(await checkService(siteUrl, 'Frontend'))
  } else {
    checks.push({ name: 'Frontend', status: 'skipped', reason: 'NEXT_PUBLIC_SITE_URL not set' })
  }
  
  // Display results
  let allOk = true
  
  checks.forEach(check => {
    const status = check.status === 'ok' ? '✅' : 
                  check.status === 'skipped' ? '⏭️ ' : '❌'
    
    if (check.status !== 'ok' && check.status !== 'skipped') {
      allOk = false
    }
    
    console.log(`${status} ${check.name}: ${check.status}`)
    
    if (check.reason) {
      console.log(`   ${check.reason}`)
    }
    
    if (check.error) {
      console.log(`   Error: ${check.error}`)
    }
    
    if (check.responseTime) {
      console.log(`   Response time: ${check.responseTime}ms`)
    }
  })
  
  console.log('')
  
  if (allOk) {
    console.log('🎉 All health checks passed!')
  } else {
    console.log('⚠️  Some health checks failed')
    console.log('   Check the errors above and ensure services are running')
  }
  
  return allOk
}

// Run health check
healthCheck().catch(error => {
  console.error('💥 Health check failed:', error.message)
  process.exit(1)
})
