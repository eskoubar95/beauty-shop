/**
 * MedusaJS Instrumentation
 * Logs startup information and mode detection
 */

export function register() {
  // Detect if running in cluster mode with workers only
  const hasCluster = process.argv.includes('--cluster')
  const serversArg = process.argv.find(arg => arg.startsWith('--servers='))
  const workersArg = process.argv.find(arg => arg.startsWith('--workers='))
  
  const servers = serversArg ? parseInt(serversArg.split('=')[1]) : 1
  const workers = workersArg ? parseInt(workersArg.split('=')[1]) : 0
  
  const isWorkerMode = hasCluster && servers === 0 && workers > 0
  const mode = isWorkerMode ? '👷 WORKER' : '🌐 SERVER'
  const env = process.env.NODE_ENV || 'development'
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`🚀 Beauty Shop MedusaJS starting...`)
  console.log(`   Mode:        ${mode}`)
  console.log(`   Environment: ${env}`)
  console.log(`   Node:        ${process.version}`)
  console.log(`   Redis:       ${process.env.REDIS_URL ? '✅ Connected' : '❌ Not configured'}`)
  if (hasCluster) {
    console.log(`   Cluster:     Servers=${servers}, Workers=${workers}`)
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  if (isWorkerMode) {
    console.log('📨 Worker mode: Processing background jobs and subscribers')
  } else {
    console.log('🌐 Server mode: Handling HTTP requests (API + Admin)')
  }
}

// Uncomment below to enable OpenTelemetry instrumentation with Sentry/Zipkin
// import { registerOtel } from "@medusajs/medusa"
// import { ZipkinExporter } from "@opentelemetry/exporter-zipkin"
//
// const exporter = new ZipkinExporter({
//   serviceName: 'beauty-shop',
// })
//
// export function register() {
//   registerOtel({
//     serviceName: 'beauty-shop',
//     exporter,
//     instrument: {
//       http: true,
//       workflows: true,
//       query: true
//     },
//   })
// }