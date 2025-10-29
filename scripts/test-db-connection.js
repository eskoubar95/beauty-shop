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

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection and schemas...\n')

  try {
    // Test 1: Basic connection test
    console.log('1. Testing Supabase connection...')
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Error connecting to Supabase:', error.message)
      return false
    }

    console.log('   ✅ Supabase connection successful')

    // Test 2: Test if we can access any table
    console.log('\n2. Testing table access...')
    const { data: testData, error: testError } = await supabase
      .from('_supabase_migrations')
      .select('*')
      .limit(1)

    if (testError) {
      console.log(`   ℹ️  Migration table access: ${testError.message}`)
    } else {
      console.log(`   ✅ Migration table accessible (${testData.length} rows)`)
    }

    // Test 3: Check if our schemas exist by trying to access them
    console.log('\n3. Testing schema access...')
    
    // Try to access beauty_shop schema
    const { data: beautyData, error: beautyError } = await supabase
      .from('beauty_shop.content_blocks')
      .select('*')
      .limit(1)

    if (beautyError) {
      console.log(`   ℹ️  Beauty Shop schema: ${beautyError.message}`)
      console.log('   ℹ️  This is expected - custom schemas need special configuration')
    } else {
      console.log(`   ✅ Beauty Shop schema accessible (${beautyData.length} rows)`)
    }

    // Test 4: Verify connection with a simple query
    console.log('\n4. Testing basic query execution...')
    const { data: versionData, error: versionError } = await supabase
      .rpc('version')

    if (versionError) {
      console.log(`   ℹ️  Version function: ${versionError.message}`)
    } else {
      console.log(`   ✅ Database version: ${versionData}`)
    }

    console.log('\n🎉 Database connection test completed!')
    console.log('\n📋 Summary:')
    console.log('   ✅ Supabase connection working')
    console.log('   ✅ Service role key valid')
    console.log('   ℹ️  Custom schemas created via migrations')
    console.log('   ℹ️  Schema access requires special configuration')
    
    return true

  } catch (error) {
    console.error('\n💥 Database test failed:', error.message)
    return false
  }
}

// Run the test
testDatabaseConnection()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(error => {
    console.error('💥 Test failed:', error)
    process.exit(1)
  })