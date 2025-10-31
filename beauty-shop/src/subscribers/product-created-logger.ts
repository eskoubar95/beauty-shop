/**
 * Product Created Logger Subscriber
 * Demonstrates worker mode functionality
 * This subscriber logs when products are created and shows which mode handled it
 */

import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

export default async function productCreatedLogger({ 
  event, 
  container 
}: SubscriberArgs<{ id: string }>) {
  // Detect cluster mode
  const hasCluster = process.argv.includes('--cluster')
  const serversArg = process.argv.find(arg => arg.startsWith('--servers='))
  const servers = serversArg ? parseInt(serversArg.split('=')[1]) : 1
  const mode = (hasCluster && servers === 0) ? 'WORKER' : 'SERVER'
  
  const productId = event.data.id
  
  console.log(`📦 [${mode}] Product created event received`)
  console.log(`   Product ID: ${productId}`)
  console.log(`   Timestamp: ${new Date().toISOString()}`)
  
  // In production, this could:
  // - Send email notifications
  // - Update search index
  // - Sync to external services
  // - Generate thumbnails
  // - Update analytics
  
  try {
    const productModuleService = container.resolve("product")
    const product = await productModuleService.retrieveProduct(productId)
    
    console.log(`   Product title: ${product.title}`)
    console.log(`   ✅ Event processed successfully in ${mode} mode`)
  } catch (error) {
    console.error(`   ❌ Error processing event in ${mode} mode:`, error)
    throw error
  }
}

export const config: SubscriberConfig = {
  event: "product.created",
}

