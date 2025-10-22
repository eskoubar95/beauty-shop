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
    // Test 1: Simple connection test
    console.log('1. Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .limit(1)

    if (testError) {
      console.error('❌ Error connecting to Supabase:', testError.message)
      return false
    }

    console.log('   ✅ Supabase connection successful')

    // Test 2: Check if we can access the public schema
    console.log('\n2. Testing public schema access...')
    const { data: publicTables, error: publicError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .limit(5)

    if (publicError) {
      console.error('❌ Error accessing public schema:', publicError.message)
      return false
    }

    console.log(`   ✅ Public schema accessible (${publicTables.length} tables found)`)

    // Test 3: Try to access beauty_shop schema directly
    console.log('\n3. Testing Beauty Shop schema access...')
    try {
      const { data: beautyTables, error: beautyError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'beauty_shop')

      if (beautyError) {
        console.log(`   ℹ️  Beauty Shop schema not accessible via Supabase client: ${beautyError.message}`)
        console.log('   ℹ️  This is expected - custom schemas need special configuration')
      } else {
        console.log(`   ✅ Beauty Shop schema accessible (${beautyTables.length} tables)`)
      }
    } catch (err) {
      console.log(`   ℹ️  Beauty Shop schema access test: ${err.message}`)
    }

    // Test 4: Test if we can run a simple query
    console.log('\n4. Testing basic SQL execution...')
    const { data: versionData, error: versionError } = await supabase
      .rpc('version')

    if (versionError) {
      console.log(`   ℹ️  Version function not available: ${versionError.message}`)
    } else {
      console.log(`   ✅ Database version: ${versionData}`)
    }

    // Test 5: Check if migrations were applied by looking for our tables
    console.log('\n5. Checking if migrations were applied...')
    const { data: allTables, error: allError } = await supabase
      .from('pg_tables')
      .select('schemaname, tablename')
      .in('schemaname', ['beauty_shop', 'medusa', 'payload'])
      .order('schemaname')
      .order('tablename')

    if (allError) {
      console.error('❌ Error checking all tables:', allError.message)
      return false
    }

    const schemaGroups = allTables.reduce((acc, table) => {
      if (!acc[table.schemaname]) {
        acc[table.schemaname] = []
      }
      acc[table.schemaname].push(table.tablename)
      return acc
    }, {})

    console.log('   ✅ Schema analysis:')
    Object.entries(schemaGroups).forEach(([schema, tables]) => {
      console.log(`      - ${schema}: ${tables.length} tables (${tables.join(', ')})`)
    })

    // Test 6: Verify our specific tables exist
    console.log('\n6. Verifying Beauty Shop tables...')
    const beautyShopTables = schemaGroups['beauty_shop'] || []
    const expectedTables = ['user_profiles', 'subscriptions', 'content_blocks']
    
    const missingTables = expectedTables.filter(table => !beautyShopTables.includes(table))
    const foundTables = expectedTables.filter(table => beautyShopTables.includes(table))

    if (missingTables.length > 0) {
      console.error(`   ❌ Missing tables: ${missingTables.join(', ')}`)
      return false
    }

    console.log(`   ✅ All expected tables found: ${foundTables.join(', ')}`)

    console.log('\n🎉 Database schema verification completed!')
    console.log('\n📋 Summary:')
    console.log('   ✅ Supabase connection working')
    console.log('   ✅ Public schema accessible')
    console.log('   ✅ Beauty Shop schema created')
    console.log('   ✅ All expected tables present')
    console.log('   ℹ️  Custom schema access requires special configuration')
    
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
