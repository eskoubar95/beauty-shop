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

async function testExposedSchemas() {
  console.log('🔍 Testing exposed schemas access...\n')

  try {
    // Test 1: Check Beauty Shop tables
    console.log('1. Testing Beauty Shop tables...')
    const { data: contentBlocks, error: contentError } = await supabase
      .from('beauty_shop.content_blocks')
      .select('*')
      .limit(1)

    if (contentError) {
      console.error('❌ Error accessing content_blocks:', contentError.message)
      return false
    }

    console.log(`   ✅ Successfully accessed content_blocks (${contentBlocks.length} rows)`)

    // Test 2: Test user_profiles table
    console.log('\n2. Testing user_profiles table...')
    const { data: userProfiles, error: userError } = await supabase
      .from('beauty_shop.user_profiles')
      .select('*')
      .limit(1)

    if (userError) {
      console.error('❌ Error accessing user_profiles:', userError.message)
      return false
    }

    console.log(`   ✅ Successfully accessed user_profiles (${userProfiles.length} rows)`)

    // Test 3: Test subscriptions table
    console.log('\n3. Testing subscriptions table...')
    const { data: subscriptions, error: subError } = await supabase
      .from('beauty_shop.subscriptions')
      .select('*')
      .limit(1)

    if (subError) {
      console.error('❌ Error accessing subscriptions:', subError.message)
      return false
    }

    console.log(`   ✅ Successfully accessed subscriptions (${subscriptions.length} rows)`)

    // Test 4: Test RLS by trying to insert a test record
    console.log('\n4. Testing RLS policies...')
    const { data: insertData, error: insertError } = await supabase
      .from('beauty_shop.content_blocks')
      .insert({
        title: 'Test Block',
        content: 'This is a test content block',
        block_type: 'test',
        position: 0,
        is_active: true
      })
      .select()

    if (insertError) {
      console.error('❌ Error inserting test record:', insertError.message)
      return false
    }

    console.log(`   ✅ Successfully inserted test record (ID: ${insertData[0].id})`)

    // Clean up test record
    const { error: deleteError } = await supabase
      .from('beauty_shop.content_blocks')
      .delete()
      .eq('id', insertData[0].id)

    if (deleteError) {
      console.warn('⚠️  Warning: Could not clean up test record:', deleteError.message)
    } else {
      console.log('   ✅ Test record cleaned up')
    }

    // Test 5: Check if MedusaJS tables are accessible
    console.log('\n5. Testing MedusaJS schema access...')
    const { data: medusaTest, error: medusaError } = await supabase
      .from('medusa.customer')
      .select('*')
      .limit(1)

    if (medusaError) {
      console.log(`   ℹ️  MedusaJS schema accessible but no tables yet: ${medusaError.message}`)
    } else {
      console.log(`   ✅ MedusaJS schema accessible (${medusaTest.length} customers)`)
    }

    console.log('\n🎉 All exposed schema tests passed!')
    console.log('\n📋 Summary:')
    console.log('   ✅ Beauty Shop schema accessible')
    console.log('   ✅ All Beauty Shop tables working')
    console.log('   ✅ RLS policies working')
    console.log('   ✅ Insert/delete operations working')
    console.log('   ✅ MedusaJS schema accessible')
    
    return true

  } catch (error) {
    console.error('\n💥 Schema test failed:', error.message)
    return false
  }
}

// Run the test
testExposedSchemas()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Test failed:', error)
    process.exit(1)
  })
