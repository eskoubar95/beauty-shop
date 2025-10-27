#!/usr/bin/env node

/**
 * Run Beauty Shop custom migrations via direct SQL execution
 * Uses Node.js to execute SQL against Supabase database
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Read .env file
const envContent = fs.readFileSync('beauty-shop/.env', 'utf8');
const databaseUrl = envContent.match(/DATABASE_URL=(.+)/)?.[1];

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not found in beauty-shop/.env');
  process.exit(1);
}

// Parse extra config
const extraMatch = envContent.match(/DATABASE_EXTRA=(.+)/)?.[1];
let databaseExtra = {};
if (extraMatch) {
  try {
    databaseExtra = JSON.parse(extraMatch);
  } catch (e) {
    console.error('⚠️  Could not parse DATABASE_EXTRA');
  }
}

async function runMigration() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: databaseExtra.ssl || false,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Read migration files
    const migration1 = fs.readFileSync(
      path.join(__dirname, '../supabase/migrations/20250124000001_beauty_shop_tables.sql'),
      'utf8'
    );

    const migration2 = fs.readFileSync(
      path.join(__dirname, '../supabase/migrations/20250124000002_clerk_rls_policies.sql'),
      'utf8'
    );

    console.log('\n🚀 Running migration 1: beauty_shop tables...');
    await client.query(migration1);
    console.log('✅ Migration 1 completed');

    console.log('\n🚀 Running migration 2: Clerk RLS policies...');
    await client.query(migration2);
    console.log('✅ Migration 2 completed');

    console.log('\n✅ All migrations completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();

