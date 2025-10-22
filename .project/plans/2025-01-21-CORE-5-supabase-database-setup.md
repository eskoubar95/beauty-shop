# ⚠️ CANCELLED - Supabase Database Setup Implementation Plan

## ⚠️ PLAN CANCELLED

**Dato:** 2025-01-21  
**Årsag:** Arkitektur ændring - Monorepo struktur påkrævet

**Linear Issue:** [CORE-5 - Supabase Database Setup](https://linear.app/beauty-shop/issue/CORE-5)  
**Status:** Cancelled  
**Erstattet af:** [CORE-16 - Monorepo Setup with MedusaJS, Next.js, and Payload CMS](https://linear.app/beauty-shop/issue/CORE-16)

**Ny Plan:** `.project/plans/2025-01-21-CORE-16-monorepo-setup.md`

### Hvorfor Cancelled?

Denne plan blev cancelled grundet fundamental arkitektur konflikt opdaget under implementering:

1. **Manglende Monorepo Struktur:**
   - Vi har både Next.js frontend, Payload CMS, og MedusaJS backend
   - Ingen koordineret monorepo struktur defineret
   - Risk for konflikter mellem forskellige apps' node_modules, configs, osv.

2. **MedusaJS Admin Misforståelse:**
   - MedusaJS 2.0 inkluderer Admin Dashboard i samme applikation som backend
   - Vores antagelse om separate backend/admin var forkert

3. **Projektstruktur Ikke Defineret:**
   - Ingen dokumentation for monorepo strategi
   - Ingen clear separation mellem apps
   - Manglende shared packages definition

### Partial Work Salvaged

Fra CORE-5 implementation:
- ✅ Supabase CLI installed
- ✅ Supabase project linked
- ✅ Environment credentials known

---

# ORIGINAL PLAN (OUTDATED)

## Overview
Implementere Supabase database setup med komplet schema, RLS policies, og MedusaJS integration. Supabase projekt er allerede oprettet og vi skal integrere MedusaJS direkte på Supabase PostgreSQL database.

## Linear Issue
**Issue:** CORE-5 - Supabase Database Setup
**Status:** Cancelled  
**Priority:** Urgent  
**Assignee:** Nicklas Eskou  
**Labels:** high-risk, human-required, Infra

## Current State Analysis

### What Exists:
- ✅ Supabase projekt oprettet: `https://aakjzquwftmtuzxjzxbv.supabase.co/`
- ✅ API keys tilgængelige (anon + service role)
- ✅ Detaljeret database schema i `.project/04-Database_Schema.md`
- ✅ CORE-15 environment configuration setup

### What's Missing:
- ❌ Supabase CLI installation og konfiguration
- ❌ MedusaJS integration på Supabase
- ❌ Database migration scripts
- ❌ RLS policies konfiguration
- ❌ Sample data
- ❌ Supabase client setup

### Key Discoveries:
- MedusaJS understøtter direkte Supabase integration via `--db-url` parameter
- MedusaJS opretter sine egne pre-definerede tabeller (ikke vores custom schema)
- Clerk authentication bruger string-based IDs, ikke UUIDs som Supabase
- RLS policies skal bruge `auth.jwt()` funktion i stedet for `auth.uid()` for Clerk integration
- Vi skal oprette separat schema for MedusaJS og vores custom tabeller

## Desired End State
- MedusaJS backend kører mod Supabase PostgreSQL database
- Alle MedusaJS tabeller er oprettet og funktionelle
- RLS policies er aktive for sikkerhed
- Sample data er indsat for testing
- Database connection er testet og dokumenteret

## What We're NOT Doing
- Oprette MedusaJS backend (det er CORE-6)
- Konfigurere Clerk authentication (det kommer senere)
- Setup environment variabler (det er CORE-15)
- Implementere custom business logic (kun database setup)

## Implementation Approach
Bruge MedusaJS CLI til at oprette projekt med direkte Supabase integration, derefter konfigurere RLS policies og indsætte sample data.

## Phase 1: MedusaJS Integration Setup

### Overview
Oprette MedusaJS projekt med direkte Supabase database integration ved hjælp af `--db-url` parameter.

### Changes Required:

#### 1. Install Supabase CLI
**File:** `package.json`
**Changes:** Tilføj Supabase CLI som dev dependency
```bash
# Install Supabase CLI globally
npm install -g supabase

# Or install locally as dev dependency
npm install --save-dev supabase
```

**Rationale:** Supabase CLI er nødvendig for at køre migration scripts og administrere database lokalt.

#### 2. Initialize Supabase Project
**File:** `supabase/` (ny mappe)
**Changes:** Initialiser Supabase projekt med eksisterende remote database
```bash
# Initialize Supabase project
supabase init

# Link to existing Supabase project
supabase link --project-ref aakjzquwftmtuzxjzxbv
```

**Rationale:** Linker lokalt Supabase projekt til din eksisterende Supabase database.

#### 3. Create MedusaJS Project
**File:** `backend/` (ny mappe)
**Changes:** Opret MedusaJS projekt med Supabase integration
```bash
# Fra projekt root
npx create-medusa-app@latest backend \
  --db-url "postgresql://postgres:6swY4T5vVR4KpxdM@db.aakjzquwftmtuzxjzxbv.supabase.co:5432/postgres" \
  --no-browser
```

**Database URL Format:**
```
postgresql://postgres:6swY4T5vVR4KpxdM@db.aakjzquwftmtuzxjzxbv.supabase.co:5432/postgres
```

**Rationale:** MedusaJS CLI håndterer automatisk database setup og migrationer når vi bruger `--db-url` parameter. MedusaJS vil oprette sine egne tabeller i `public` schema, som vi senere kan flytte til `medusa` schema for bedre organisation.

**⚠️ IPv4 Compatibility Note:** Supabase Direct Connection bruger IPv6 og kan have problemer på IPv4-only platforms som Vercel, GitHub Actions, eller Render. Hvis du oplever connection fejl, kan du skifte til Session Pooler URL i stedet:
```
postgresql://postgres:6swY4T5vVR4KpxdM@db.aakjzquwftmtuzxjzxbv.supabase.co:6543/postgres?pgbouncer=true
```

#### 4. Configure Environment Variables
**File:** `backend/.env`
**Changes:** Tilføj Supabase konfiguration
```env
# Supabase Configuration
SUPABASE_URL=https://aakjzquwftmtuzxjzxbv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFha2p6cXV3ZnRtdHV6eGp6eGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMTU3NjYsImV4cCI6MjA3NTg5MTc2Nn0.q54hfo6i1g4TI0GJ3ZQc7XE32lfFHzyj7Vkgbsuj6rk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFha2p6cXV3ZnRtdHV6eGp6eGJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDMxNTc2NiwiZXhwIjoyMDc1ODkxNzY2fQ.dl9mteOo3VfcbLeuhxCSLUCZELDPYhollFid_ijRslw

# MedusaJS Configuration
DATABASE_URL=postgresql://postgres:6swY4T5vVR4KpxdM@db.aakjzquwftmtuzxjzxbv.supabase.co:5432/postgres
```

**Rationale:** Environment variabler er nødvendige for MedusaJS til at connecte til Supabase.

#### 5. Test Database Connection
**File:** `scripts/test-db-connection.js`
**Changes:** Opret script til at teste database connection
```javascript
const { createConnection } = require('typeorm');

async function testConnection() {
  try {
    const connection = await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL,
    });
    
    console.log('✅ Database connection successful');
    await connection.close();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
```

**Rationale:** Verificer at MedusaJS kan connecte til Supabase database.

### Success Criteria:

#### Automated Verification:
- [ ] Supabase CLI installeret: `supabase --version` returnerer version
- [ ] Supabase projekt linket: `supabase status` viser remote connection
- [ ] MedusaJS projekt oprettet: `npm run build` i backend/
- [ ] Environment variabler konfigureret: `npm run dev` starter uden fejl
- [ ] Database connection testet: `node scripts/test-db-connection.js` returnerer success

#### Manual Verification:
- [ ] MedusaJS admin panel tilgængelig på http://localhost:9000
- [ ] Database tabeller er oprettet i Supabase dashboard
- [ ] Ingen connection fejl i MedusaJS logs

**⚠️ PAUSE HERE** - Manual approval before Phase 2

---

## Phase 2: RLS Policies Configuration

### Overview
Konfigurere Row Level Security policies i Supabase for at sikre data adgang baseret på MedusaJS authentication.

### Changes Required:

#### 1. Create Schema Separation
**File:** `migrations/001_schema_separation.sql`
**Changes:** Opret separate schemaer for MedusaJS og custom tabeller
```sql
-- Create separate schema for MedusaJS tables
CREATE SCHEMA IF NOT EXISTS medusa;

-- Move MedusaJS tables to medusa schema (after MedusaJS creates them)
-- This will be done after MedusaJS installation in CORE-6
-- For now, we'll work with MedusaJS tables in public schema

-- Create custom schema for Beauty Shop specific tables
CREATE SCHEMA IF NOT EXISTS beauty_shop;

-- Custom tables for Beauty Shop (from .project/04-Database_Schema.md)
CREATE TABLE beauty_shop.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id TEXT NOT NULL,
    customer_id UUID NULL, -- Will reference medusa.customer(id) after MedusaJS setup
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    skin_type VARCHAR(50),
    preferences JSONB DEFAULT '{}',
    marketing_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for custom tables
CREATE INDEX idx_user_profiles_clerk_user_id ON beauty_shop.user_profiles(clerk_user_id);
CREATE INDEX idx_user_profiles_customer_id ON beauty_shop.user_profiles(customer_id);
CREATE INDEX idx_user_profiles_skin_type ON beauty_shop.user_profiles(skin_type);
```

#### 2. Create RLS Migration Script
**File:** `migrations/002_rls_policies.sql`
**Changes:** Opret RLS policies for Clerk integration
```sql
-- Enable RLS on custom Beauty Shop tables
ALTER TABLE beauty_shop.user_profiles ENABLE ROW LEVEL SECURITY;

-- Custom table policies using Clerk JWT
CREATE POLICY "Users can view own profile" ON beauty_shop.user_profiles
    FOR SELECT USING (auth.jwt() ->> 'sub' = clerk_user_id);

CREATE POLICY "Users can update own profile" ON beauty_shop.user_profiles
    FOR UPDATE USING (auth.jwt() ->> 'sub' = clerk_user_id);

CREATE POLICY "Users can insert own profile" ON beauty_shop.user_profiles
    FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = clerk_user_id);

-- Service role bypass (for backend operations)
CREATE POLICY "Service role full access" ON beauty_shop.user_profiles
    FOR ALL USING (auth.role() = 'service_role');

-- Note: MedusaJS tables will have their own RLS policies
-- We'll configure those after MedusaJS installation
```

**Rationale:** RLS policies sikrer at brugere kun kan tilgå deres egen data, mens service role kan tilgå alt for backend operations.

#### 3. Apply Schema and RLS Policies
**File:** `scripts/apply-database-setup.js`
**Changes:** Script til at anvende schema separation og RLS policies med enhanced error handling
```javascript
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Enhanced error handling with context and rollback instructions
class DatabaseSetupError extends Error {
  constructor(message, context = {}, originalError = null) {
    super(message);
    this.name = 'DatabaseSetupError';
    this.context = context;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }

  getDetailedMessage() {
    let details = `❌ ${this.name}: ${this.message}`;
    if (this.context.phase) details += `\n   Phase: ${this.context.phase}`;
    if (this.context.file) details += `\n   File: ${this.context.file}`;
    if (this.context.sql) details += `\n   SQL: ${this.context.sql.substring(0, 100)}...`;
    if (this.timestamp) details += `\n   Time: ${this.timestamp}`;
    return details;
  }
}

async function validateEnvironment() {
  const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new DatabaseSetupError(
      `Missing required environment variables: ${missing.join(', ')}`,
      { phase: 'validation', variables: missing }
    );
  }
}

async function validateFiles() {
  const requiredFiles = [
    './migrations/001_schema_separation.sql',
    './migrations/002_rls_policies.sql'
  ];
  
  const missing = requiredFiles.filter(file => !fs.existsSync(file));
  if (missing.length > 0) {
    throw new DatabaseSetupError(
      `Missing required migration files: ${missing.join(', ')}`,
      { phase: 'validation', files: missing }
    );
  }
}

async function applySchemaSeparation(supabase) {
  console.log('📋 Applying schema separation...');
  
  try {
    const schemaPath = './migrations/001_schema_separation.sql';
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    if (!schemaSql.trim()) {
      throw new DatabaseSetupError(
        'Schema separation file is empty',
        { phase: 'schema_separation', file: schemaPath }
      );
    }

    const { error: schemaError } = await supabase.rpc('exec_sql', { sql: schemaSql });
    
    if (schemaError) {
      throw new DatabaseSetupError(
        `Schema separation failed: ${schemaError.message}`,
        { 
          phase: 'schema_separation', 
          file: schemaPath,
          sql: schemaSql,
          supabaseError: schemaError
        },
        schemaError
      );
    }
    
    console.log('✅ Schema separation applied successfully');
    return true;
  } catch (error) {
    if (error instanceof DatabaseSetupError) throw error;
    throw new DatabaseSetupError(
      `Unexpected error during schema separation: ${error.message}`,
      { phase: 'schema_separation' },
      error
    );
  }
}

async function applyRLSPolicies(supabase) {
  console.log('🔒 Applying RLS policies...');
  
  try {
    const rlsPath = './migrations/002_rls_policies.sql';
    const rlsSql = fs.readFileSync(rlsPath, 'utf8');
    
    if (!rlsSql.trim()) {
      throw new DatabaseSetupError(
        'RLS policies file is empty',
        { phase: 'rls_policies', file: rlsPath }
      );
    }

    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: rlsSql });
    
    if (rlsError) {
      throw new DatabaseSetupError(
        `RLS policies failed: ${rlsError.message}`,
        { 
          phase: 'rls_policies', 
          file: rlsPath,
          sql: rlsSql,
          supabaseError: rlsError
        },
        rlsError
      );
    }
    
    console.log('✅ RLS policies applied successfully');
    return true;
  } catch (error) {
    if (error instanceof DatabaseSetupError) throw error;
    throw new DatabaseSetupError(
      `Unexpected error during RLS policies: ${error.message}`,
      { phase: 'rls_policies' },
      error
    );
  }
}

async function verifySetup(supabase) {
  console.log('🔍 Verifying database setup...');
  
  try {
    // Check if schemas exist
    const { data: schemas, error: schemaError } = await supabase
      .from('information_schema.schemata')
      .select('schema_name')
      .in('schema_name', ['medusa', 'beauty_shop']);

    if (schemaError) {
      throw new DatabaseSetupError(
        `Failed to verify schemas: ${schemaError.message}`,
        { phase: 'verification' },
        schemaError
      );
    }

    const schemaNames = schemas.map(s => s.schema_name);
    if (!schemaNames.includes('beauty_shop')) {
      throw new DatabaseSetupError(
        'beauty_shop schema not found after setup',
        { phase: 'verification', foundSchemas: schemaNames }
      );
    }

    console.log('✅ Database setup verification successful');
    return true;
  } catch (error) {
    if (error instanceof DatabaseSetupError) throw error;
    throw new DatabaseSetupError(
      `Verification failed: ${error.message}`,
      { phase: 'verification' },
      error
    );
  }
}

function printRollbackInstructions(error) {
  console.log('\n🔄 ROLLBACK INSTRUCTIONS:');
  console.log('If you need to rollback this setup:');
  console.log('1. Connect to your Supabase database');
  console.log('2. Run the following SQL commands:');
  console.log('   DROP SCHEMA IF EXISTS beauty_shop CASCADE;');
  console.log('   DROP SCHEMA IF EXISTS medusa CASCADE;');
  console.log('3. Re-run this script after fixing the issues');
  console.log('\n💡 TROUBLESHOOTING TIPS:');
  console.log('- Check your Supabase project is active');
  console.log('- Verify your service role key has correct permissions');
  console.log('- Ensure migration files exist and are valid SQL');
  console.log('- Check Supabase dashboard for any error logs');
}

async function applyDatabaseSetup() {
  console.log('🚀 Starting database setup...');
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  
  try {
    // Validate environment and files
    await validateEnvironment();
    await validateFiles();
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Test connection
    console.log('🔗 Testing Supabase connection...');
    const { error: connectionError } = await supabase.from('information_schema.schemata').select('schema_name').limit(1);
    if (connectionError) {
      throw new DatabaseSetupError(
        `Failed to connect to Supabase: ${connectionError.message}`,
        { phase: 'connection' },
        connectionError
      );
    }
    console.log('✅ Supabase connection successful');

    // Apply changes
    await applySchemaSeparation(supabase);
    await applyRLSPolicies(supabase);
    await verifySetup(supabase);

    console.log('\n🎉 Database setup completed successfully!');
    console.log('📋 Summary:');
    console.log('   ✅ Schema separation applied');
    console.log('   ✅ RLS policies configured');
    console.log('   ✅ Setup verified');
    
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('💥 DATABASE SETUP FAILED');
    console.error('='.repeat(60));
    
    if (error instanceof DatabaseSetupError) {
      console.error(error.getDetailedMessage());
    } else {
      console.error(`❌ Unexpected error: ${error.message}`);
    }
    
    printRollbackInstructions(error);
    
    console.error('\n🔗 For more help:');
    console.error('- Check Supabase documentation: https://supabase.com/docs');
    console.error('- Review migration files for SQL syntax errors');
    console.error('- Contact support if issues persist');
    
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

applyDatabaseSetup();
```

**Rationale:** Automatiseret script til at anvende RLS policies via Supabase service role.

### Success Criteria:

#### Automated Verification:
- [ ] Database setup script kører: `node scripts/apply-database-setup.js`
- [ ] Ingen SQL fejl i schema separation eller RLS policies
- [ ] Custom Beauty Shop schema er oprettet
- [ ] RLS policies er aktive på custom tabeller

#### Manual Verification:
- [ ] RLS policies vises i Supabase dashboard
- [ ] Test data access med forskellige roller
- [ ] Service role kan tilgå alle data

**⚠️ PAUSE HERE** - Manual approval before Phase 3

---

## Phase 3: Sample Data & Testing

### Overview
Indsætte sample data der er kompatibel med MedusaJS struktur og teste database funktionalitet.

### Changes Required:

#### 1. Create Sample Data Script
**File:** `migrations/003_sample_data.sql`
**Changes:** Sample data for custom Beauty Shop tables
```sql
-- Sample data for Beauty Shop custom tables
-- Note: MedusaJS will create its own sample data during installation

-- Sample user profiles (connected to Clerk)
INSERT INTO beauty_shop.user_profiles (clerk_user_id, phone, skin_type, preferences, marketing_consent) VALUES
('user_2abc123def456ghi789', '+45 12345678', 'combination', 
 '{"newsletter": true, "sms_updates": false, "language": "da"}', true),
('user_2xyz789uvw456rst123', '+45 87654321', 'normal', 
 '{"newsletter": false, "sms_updates": true, "language": "da"}', false);

-- Note: customer_id will be populated after MedusaJS creates customers
-- This will be done in a separate step after MedusaJS installation
```

**Rationale:** Sample data tilpasset MedusaJS's interne struktur og ID format.

#### 2. Create Data Testing Script
**File:** `scripts/test-sample-data.js`
**Changes:** Test script til at verificere custom Beauty Shop data
```javascript
const { createClient } = require('@supabase/supabase-js');

async function testSampleData() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Test custom Beauty Shop tables
    console.log('🧪 Testing Beauty Shop custom tables...');
    
    const { data: userProfiles, error: profilesError } = await supabase
      .from('beauty_shop.user_profiles')
      .select('*')
      .limit(5);

    if (profilesError) throw profilesError;
    console.log('✅ User profiles query successful:', userProfiles.length, 'profiles found');

    // Test schema separation
    console.log('🧪 Testing schema separation...');
    
    // Verify medusa schema exists (will be created by MedusaJS)
    const { data: schemas, error: schemaError } = await supabase
      .from('information_schema.schemata')
      .select('schema_name')
      .eq('schema_name', 'medusa');

    if (schemaError) throw schemaError;
    console.log('✅ Schema separation verified');

    // Test RLS policies (should work with service role)
    console.log('🧪 Testing RLS policies...');
    
    const { data: rlsTest, error: rlsError } = await supabase
      .from('beauty_shop.user_profiles')
      .select('clerk_user_id, skin_type')
      .limit(1);

    if (rlsError) throw rlsError;
    console.log('✅ RLS policies working correctly');

    console.log('✅ All sample data tests passed');
  } catch (error) {
    console.error('❌ Sample data test failed:', error.message);
    process.exit(1);
  }
}

testSampleData();
```

**Rationale:** Verificer at sample data er indsat korrekt og at queries fungerer som forventet.

### Success Criteria:

#### Automated Verification:
- [ ] Sample data script kører: `node scripts/test-sample-data.js`
- [ ] Custom Beauty Shop tables returnerer data
- [ ] Schema separation verificeret
- [ ] RLS policies fungerer korrekt

#### Manual Verification:
- [ ] Sample data vises i Supabase dashboard
- [ ] MedusaJS admin panel viser produkter og kunder
- [ ] Database performance er acceptable (< 100ms for simple queries)

**⚠️ PAUSE HERE** - Manual approval before Phase 4

---

## Phase 4: Integration & Documentation

### Overview
Færdiggøre integration med MedusaJS og dokumentere setup processen.

### Changes Required:

#### 1. Create Supabase Client
**File:** `lib/supabase/client.ts`
**Changes:** Supabase client til brug i frontend
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Rationale:** Centraliseret Supabase client til brug i frontend applikationer.

#### 2. Create Database Types
**File:** `lib/supabase/types.ts`
**Changes:** TypeScript types for database
```typescript
export interface Database {
  public: {
    Tables: {
      product: {
        Row: {
          id: string
          title: string
          handle: string
          description: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          handle: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          handle?: string
          description?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      // ... other tables
    }
  }
}
```

**Rationale:** TypeScript types sikrer type safety når vi arbejder med Supabase data.

#### 3. Create Migration Documentation
**File:** `docs/database-setup.md`
**Changes:** Dokumentation af database setup process
```markdown
# Database Setup Documentation

## Overview
This document describes the Supabase database setup process for Beauty Shop.

## Prerequisites
- Supabase project created
- MedusaJS CLI installed
- Environment variables configured

## Setup Process

### 1. MedusaJS Integration
```bash
npx create-medusa-app@latest backend \
  --db-url "postgresql://postgres:6swY4T5vVR4KpxdM@db.aakjzquwftmtuzxjzxbv.supabase.co:5432/postgres" \
  --no-browser
```

### 2. RLS Policies
Apply RLS policies using the migration script:
```bash
node scripts/apply-database-setup.js
```

### 3. Sample Data
Insert sample data:
```bash
node scripts/test-sample-data.js
```

## Verification
- MedusaJS admin panel accessible
- Database queries working
- RLS policies active
```

**Rationale:** Dokumentation sikrer at setup processen kan gentages og forstås af andre udviklere.

### Success Criteria:

#### Automated Verification:
- [ ] Supabase client oprettet: TypeScript compilation successful
- [ ] Database types oprettet: No TypeScript errors
- [ ] Documentation oprettet: All setup steps documented

#### Manual Verification:
- [ ] MedusaJS backend fungerer med Supabase
- [ ] Frontend kan connecte til Supabase
- [ ] Alle database operationer fungerer som forventet
- [ ] Documentation er komplet og forståelig

**⚠️ PAUSE HERE** - Manual approval before completion

---

## Testing Strategy

### Unit Tests
- Database connection tests
- RLS policy tests
- Sample data validation tests

### Integration Tests
- MedusaJS ↔ Supabase integration
- Frontend ↔ Supabase integration
- End-to-end database operations

### Manual Tests
- MedusaJS admin panel functionality
- Database performance under load
- RLS policy enforcement
- Data integrity checks

## References
- Linear: CORE-5
- Database Schema: `.project/04-Database_Schema.md`
- MedusaJS Docs: https://docs.medusajs.com/resources/create-medusa-app
- Supabase Project: https://aakjzquwftmtuzxjzxbv.supabase.co/
