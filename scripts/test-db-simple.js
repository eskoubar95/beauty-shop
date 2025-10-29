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
    // Test 1: Check if schemas exist using raw SQL
    console.log('1. Testing schema creation...')
    const { data: schemaCheck, error: schemaError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT schema_name 
          FROM information_schema.schemata 
          WHERE schema_name IN ('medusa', 'beauty_shop', 'payload')
          ORDER BY schema_name
        `
      })

    if (schemaError) {
      console.error('❌ Error checking schemas:', schemaError.message)
      return false
    }

    const schemaNames = schemaCheck.map(s => s.schema_name)
    console.log(`   ✅ Found schemas: ${schemaNames.join(', ')}`)

    // Test 2: Check Beauty Shop tables using raw SQL
    console.log('\n2. Testing Beauty Shop tables...')
    const { data: tableCheck, error: tableError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'beauty_shop'
          ORDER BY table_name
        `
      })

    if (tableError) {
      console.error('❌ Error checking tables:', tableError.message)
      return false
    }

    const tableNames = tableCheck.map(t => t.table_name)
    console.log(`   ✅ Found tables: ${tableNames.join(', ')}`)

    // Test 3: Test RLS policies using raw SQL
    console.log('\n3. Testing RLS policies...')
    const { data: policyCheck, error: policyError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT tablename, policyname 
          FROM pg_policies 
          WHERE schemaname = 'beauty_shop'
          ORDER BY tablename, policyname
        `
      })

    if (policyError) {
      console.error('❌ Error checking policies:', policyError.message)
      return false
    }

    console.log(`   ✅ Found ${policyCheck.length} RLS policies`)
    policyCheck.forEach(policy => {
      console.log(`      - ${policy.tablename}: ${policy.policyname}`)
    })

    // Test 4: Test functions using raw SQL
    console.log('\n4. Testing Beauty Shop functions...')
    const { data: funcCheck, error: funcError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT routine_name 
          FROM information_schema.routines 
          WHERE routine_schema = 'beauty_shop' 
          AND routine_type = 'FUNCTION'
          ORDER BY routine_name
        `
      })

    if (funcError) {
      console.error('❌ Error checking functions:', funcError.message)
      return false
    }

    const functionNames = funcCheck.map(f => f.routine_name)
    console.log(`   ✅ Found functions: ${functionNames.join(', ')}`)

    // Test 5: Test basic table access using raw SQL
    console.log('\n5. Testing table access...')
    const { data: contentCheck, error: contentError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT COUNT(*) as count 
          FROM beauty_shop.content_blocks
        `
      })

    if (contentError) {
      console.error('❌ Error accessing content_blocks:', contentError.message)
      return false
    }

    console.log(`   ✅ Successfully accessed content_blocks (${contentCheck[0].count} rows)`)

    // Test 6: Test insert/delete using raw SQL
    console.log('\n6. Testing insert/delete operations...')
    const { data: insertCheck, error: insertError } = await supabase
      .rpc('exec', {
        sql: `
          INSERT INTO beauty_shop.content_blocks (title, content, block_type, position, is_active)
          VALUES ('Test Block', 'This is a test content block', 'test', 0, true)
          RETURNING id
        `
      })

    if (insertError) {
      console.error('❌ Error inserting test record:', insertError.message)
      return false
    }

    const testId = insertCheck[0].id
    console.log(`   ✅ Successfully inserted test record (ID: ${testId})`)

    // Clean up test record
    const { error: deleteError } = await supabase
      .rpc('exec', {
        sql: `DELETE FROM beauty_shop.content_blocks WHERE id = '${testId}'`
      })

    if (deleteError) {
      console.warn('⚠️  Warning: Could not clean up test record:', deleteError.message)
    } else {
      console.log('   ✅ Test record cleaned up')
    }

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
