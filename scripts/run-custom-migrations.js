#!/usr/bin/env node

/**
 * Run Beauty Shop custom migrations via direct SQL execution
 * These migrations create beauty_shop schema and tables
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Running Beauty Shop custom migrations...\n');

// Read migrations
const migration1 = fs.readFileSync(
  path.join(__dirname, '../supabase/migrations/20250124000001_beauty_shop_tables.sql'),
  'utf8'
);

const migration2 = fs.readFileSync(
  path.join(__dirname, '../supabase/migrations/20250124000002_clerk_rls_policies.sql'),
  'utf8'
);

console.log('📋 Migration 1: beauty_shop tables');
console.log('📋 Migration 2: Clerk RLS policies');
console.log('\n✅ Migrations loaded successfully');
console.log('\n⚠️  Manual Step Required:');
console.log('   1. Go to: https://supabase.com/dashboard/project/aakjzquwftmtuzxjzxbv/sql/new');
console.log('   2. Paste the SQL from migration files and run');
console.log('   3. Or use Supabase MCP to execute SQL');
console.log('\nMigration content saved in supabase/migrations/');

