/**
 * MedusaJS Instrumentation
 * Logs startup information and mode detection
 */

export function register() {
  // Detect if running in worker mode
  const isWorkerMode = process.argv.includes('--mode=worker') || 
                       process.env.WORKER_MODE === 'true'
  
  const mode = isWorkerMode ? '👷 WORKER' : '🌐 SERVER'
  const env = process.env.NODE_ENV || 'development'
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`🚀 Beauty Shop MedusaJS starting...`)
  console.log(`   Mode:        ${mode}`)
  console.log(`   Environment: ${env}`)
  console.log(`   Node:        ${process.version}`)
  console.log(`   Redis:       ${process.env.REDIS_URL ? '✅ Connected' : '❌ Not configured'}`)
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