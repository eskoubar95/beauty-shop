#!/usr/bin/env node

require('dotenv').config()
const { Client } = require('pg')

const MEDUSA_TABLES = [
  'account_holder', 'api_key', 'application_method_buy_rules', 'application_method_target_rules',
  'auth_identity', 'capture', 'cart', 'cart_address', 'cart_line_item', 'cart_line_item_adjustment',
  'cart_line_item_tax_line', 'cart_payment_collection', 'cart_promotion', 'cart_shipping_method',
  'cart_shipping_method_adjustment', 'cart_shipping_method_tax_line', 'credit_line', 'currency',
  'customer', 'customer_account_holder', 'customer_address', 'customer_group', 'customer_group_customer',
  'fulfillment', 'fulfillment_address', 'fulfillment_item', 'fulfillment_label', 'fulfillment_provider',
  'fulfillment_set', 'geo_zone', 'image', 'inventory_item', 'inventory_level', 'invite',
  'link_module_migrations', 'location_fulfillment_provider', 'location_fulfillment_set', 
  'mikro_orm_migrations', 'notification', 'notification_provider', 'order', 'order_address',
  'order_cart', 'order_change', 'order_change_action', 'order_claim', 'order_claim_item',
  'order_claim_item_image', 'order_credit_line', 'order_exchange', 'order_exchange_item',
  'order_fulfillment', 'order_item', 'order_line_item', 'order_line_item_adjustment',
  'order_line_item_tax_line', 'order_payment_collection', 'order_promotion', 'order_shipping',
  'order_shipping_method', 'order_shipping_method_adjustment', 'order_shipping_method_tax_line',
  'order_summary', 'order_transaction', 'payment', 'payment_collection',
  'payment_collection_payment_providers', 'payment_provider', 'payment_session', 'price',
  'price_list', 'price_list_rule', 'price_preference', 'price_rule', 'price_set', 'product',
  'product_category', 'product_category_product', 'product_collection', 'product_option',
  'product_option_value', 'product_sales_channel', 'product_shipping_profile', 'product_tag',
  'product_tags', 'product_type', 'product_variant', 'product_variant_inventory_item',
  'product_variant_option', 'product_variant_price_set', 'promotion', 'promotion_application_method',
  'promotion_campaign', 'promotion_campaign_budget', 'promotion_campaign_budget_usage',
  'promotion_promotion_rule', 'promotion_rule', 'promotion_rule_value', 'provider_identity',
  'publishable_api_key_sales_channel', 'refund', 'refund_reason', 'region', 'region_country',
  'region_payment_provider', 'reservation_item', 'return', 'return_fulfillment', 'return_item',
  'return_reason', 'sales_channel', 'sales_channel_stock_location', 'script_migrations',
  'service_zone', 'shipping_option', 'shipping_option_price_set', 'shipping_option_rule',
  'shipping_option_type', 'shipping_profile', 'stock_location', 'stock_location_address', 'store',
  'store_currency', 'tax_provider', 'tax_rate', 'tax_rate_rule', 'tax_region', 'user',
  'user_preference', 'view_configuration', 'workflow_execution'
]

async function moveTablestoMedusaSchema() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })

  try {
    await client.connect()
    console.log('✅ Connected to database\n')

    console.log(`📦 Moving ${MEDUSA_TABLES.length} MedusaJS tables from 'public' to 'medusa' schema...\n`)

    // Begin transaction
    await client.query('BEGIN')

    let movedCount = 0
    let skippedCount = 0

    for (const table of MEDUSA_TABLES) {
      try {
        // Check if table exists in public schema
        const checkResult = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )
        `, [table])

        if (!checkResult.rows[0].exists) {
          console.log(`⏭️  Skipping '${table}' - not found in public schema`)
          skippedCount++
          continue
        }

        // Move table to medusa schema
        await client.query(`ALTER TABLE public.${table} SET SCHEMA medusa`)
        console.log(`✅ Moved: ${table}`)
        movedCount++
      } catch (error) {
        console.error(`❌ Error moving '${table}':`, error.message)
        throw error
      }
    }

    // Commit transaction
    await client.query('COMMIT')

    console.log(`\n🎉 Migration completed successfully!`)
    console.log(`   ✅ Moved: ${movedCount} tables`)
    console.log(`   ⏭️  Skipped: ${skippedCount} tables`)

  } catch (error) {
    await client.query('ROLLBACK')
    console.error('\n❌ Migration failed:', error.message)
    console.error('Full error:', error)
    console.error('\n🔄 Transaction rolled back - no changes made')
    process.exit(1)
  } finally {
    await client.end()
  }
}

console.log('🚀 Starting MedusaJS tables migration...\n')
console.log('⚠️  WARNING: This will move all MedusaJS tables from public to medusa schema')
console.log('⚠️  Make sure to update your MedusaJS configuration after this!')
console.log('')

moveTablestoMedusaSchema()

