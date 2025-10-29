#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabaseSchemas() {
  console.log('🔍 Testing database schemas and permissions...\n')

  try {
    // Test 1: Check if schemas exist
    console.log('1. Checking schemas...')
    const { data: schemas, error: schemaError } = await supabase.rpc('exec_sql', {
      query: `
        SELECT schema_name 
        FROM information_schema.schemata 
        WHERE schema_name IN ('medusa', 'beauty_shop', 'payload')
      `
    })

    if (schemaError) {
      console.error('❌ Error checking schemas:', schemaError.message)
      return false
    }

    const schemaNames = schemas.map(s => s.schema_name)
    console.log(`   ✅ Found schemas: ${schemaNames.join(', ')}`)

    // Test 2: Check Beauty Shop tables
    console.log('\n2. Checking Beauty Shop tables...')
    const { data: tables, error: tableError } = await supabase.rpc('exec_sql', {
      query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'beauty_shop'
      `
    })

    if (tableError) {
      console.error('❌ Error checking tables:', tableError.message)
      return false
    }

    const tableNames = tables.map(t => t.table_name)
    console.log(`   ✅ Found tables: ${tableNames.join(', ')}`)

    // Test 3: Test RLS policies
    console.log('\n3. Testing RLS policies...')
    const { data: policies, error: policyError } = await supabase.rpc('exec_sql', {
      query: `
        SELECT tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'beauty_shop'
      `
    })

    if (policyError) {
      console.error('❌ Error checking policies:', policyError.message)
      return false
    }

    console.log(`   ✅ Found ${policies.length} RLS policies`)
    policies.forEach(policy => {
      console.log(`      - ${policy.tablename}: ${policy.policyname}`)
    })

    // Test 4: Test functions
    console.log('\n4. Testing Beauty Shop functions...')
    const { data: functions, error: funcError } = await supabase.rpc('exec_sql', {
      query: `
        SELECT routine_name 
        FROM information_schema.routines 
        WHERE routine_schema = 'beauty_shop' 
        AND routine_type = 'FUNCTION'
      `
    })

    if (funcError) {
      console.error('❌ Error checking functions:', funcError.message)
      return false
    }

    const functionNames = functions.map(f => f.routine_name)
    console.log(`   ✅ Found functions: ${functionNames.join(', ')}`)

    // Test 5: Test basic table access
    console.log('\n5. Testing basic table access...')
    const { data: contentBlocks, error: contentError } = await supabase
      .from('beauty_shop.content_blocks')
      .select('*')
      .limit(1)

    if (contentError) {
      console.error('❌ Error accessing content_blocks:', contentError.message)
      return false
    }

    console.log(`   ✅ Successfully accessed content_blocks (${contentBlocks.length} rows)`)

    // Test 6: Check MedusaJS schema
    console.log('\n6. Checking MedusaJS schema...')
    const { data: medusaTables, error: medusaError } = await supabase.rpc('exec_sql', {
      query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'medusa'
      `
    })

    if (medusaError) {
      console.error('❌ Error checking MedusaJS tables:', medusaError.message)
      return false
    }

    console.log(`   ✅ MedusaJS schema ready (${medusaTables.length} tables)`)

    console.log('\n🎉 All database tests passed!')
    return true

  } catch (error) {
    console.error('\n💥 Database test failed:', error.message)
    return false
  }
}

// Run the test
testDatabaseSchemas()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Test failed:', error)
    process.exit(1)
  })
