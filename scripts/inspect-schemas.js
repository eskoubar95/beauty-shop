#!/usr/bin/env node

require('dotenv').config()
const { Client } = require('pg')

async function inspectSchemas() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment')
    process.exit(1)
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL
  })

  try {
    await client.connect()
    console.log('✅ Connected to database\n')

    // Check which schemas exist
    const schemasResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name IN ('public', 'medusa', 'beauty_shop', 'payload')
      ORDER BY schema_name;
    `)
    
    console.log('📂 Existing Schemas:')
    schemasResult.rows.forEach(row => {
      console.log(`   - ${row.schema_name}`)
    })
    console.log('')

    // List tables in public schema
    const publicTablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `)
    
    console.log(`📊 Tables in 'public' schema (${publicTablesResult.rows.length} tables):`)
    publicTablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`)
    })
    console.log('')

    // List tables in medusa schema
    const medusaTablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'medusa' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `)
    
    console.log(`📊 Tables in 'medusa' schema (${medusaTablesResult.rows.length} tables):`)
    if (medusaTablesResult.rows.length === 0) {
      console.log('   (no tables yet)')
    } else {
      medusaTablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`)
      })
    }
    console.log('')

    // List tables in beauty_shop schema
    const beautyShopTablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'beauty_shop' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `)
    
    console.log(`📊 Tables in 'beauty_shop' schema (${beautyShopTablesResult.rows.length} tables):`)
    if (beautyShopTablesResult.rows.length === 0) {
      console.log('   (no tables yet)')
    } else {
      beautyShopTablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`)
      })
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

inspectSchemas()

