#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '../supabase/migrations')
  const files = fs.readdirSync(migrationsDir).sort()

  console.log(`📁 Found ${files.length} migration files`)

  for (const file of files) {
    if (!file.endsWith('.sql')) continue

    console.log(`\n🔄 Running migration: ${file}`)
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql })
      
      if (error) {
        console.error(`❌ Migration failed: ${file}`)
        console.error(error)
        // Try direct query instead
        console.log(`🔄 Trying direct query...`)
        const pg = require('pg')
        const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
        await client.connect()
        await client.query(sql)
        await client.end()
        console.log(`✅ Migration succeeded via direct connection: ${file}`)
      } else {
        console.log(`✅ Migration succeeded: ${file}`)
      }
    } catch (err) {
      console.error(`❌ Error running migration: ${file}`)
      console.error(err.message)
      process.exit(1)
    }
  }

  console.log('\n🎉 All migrations completed successfully!')
}

runMigrations().catch(console.error)

