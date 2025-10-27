-- Beauty Shop Custom Tables Migration
-- MedusaJS already created 'medusa' schema, we only create beauty_shop and payload

-- Create schemas (medusa already exists from MedusaJS)
CREATE SCHEMA IF NOT EXISTS beauty_shop;
CREATE SCHEMA IF NOT EXISTS payload;

-- beauty_shop.user_profiles table
CREATE TABLE IF NOT EXISTS beauty_shop.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,
  customer_id UUID,  -- Will reference medusa.customer(id)
  phone VARCHAR(20),
  skin_type VARCHAR(50),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- beauty_shop.subscriptions table
CREATE TABLE IF NOT EXISTS beauty_shop.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id UUID REFERENCES beauty_shop.user_profiles(id) ON DELETE CASCADE,
  subscription_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- beauty_shop.content_blocks table
CREATE TABLE IF NOT EXISTS beauty_shop.content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  block_type VARCHAR(50) NOT NULL,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_clerk_id ON beauty_shop.user_profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_customer_id ON beauty_shop.user_profiles(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_profile_id ON beauty_shop.subscriptions(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON beauty_shop.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_content_blocks_type ON beauty_shop.content_blocks(block_type);
CREATE INDEX IF NOT EXISTS idx_content_blocks_active ON beauty_shop.content_blocks(is_active);

-- Enable RLS on all Beauty Shop tables
ALTER TABLE beauty_shop.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE beauty_shop.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE beauty_shop.content_blocks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for Clerk authentication
-- User profiles policies
CREATE POLICY "Users can view own profile" ON beauty_shop.user_profiles
  FOR SELECT USING (auth.jwt() ->> 'sub' = clerk_user_id);

CREATE POLICY "Users can update own profile" ON beauty_shop.user_profiles
  FOR UPDATE USING (auth.jwt() ->> 'sub' = clerk_user_id);

CREATE POLICY "Users can insert own profile" ON beauty_shop.user_profiles
  FOR INSERT WITH CHECK (auth.jwt() ->> 'sub' = clerk_user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON beauty_shop.subscriptions
  FOR SELECT USING (
    user_profile_id IN (
      SELECT id FROM beauty_shop.user_profiles 
      WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can update own subscriptions" ON beauty_shop.subscriptions
  FOR UPDATE USING (
    user_profile_id IN (
      SELECT id FROM beauty_shop.user_profiles 
      WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- Content blocks policies (public read, admin write)
CREATE POLICY "Anyone can view active content blocks" ON beauty_shop.content_blocks
  FOR SELECT USING (is_active = true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA beauty_shop TO authenticated;
GRANT USAGE ON SCHEMA beauty_shop TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON beauty_shop.user_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON beauty_shop.subscriptions TO authenticated;
GRANT SELECT ON beauty_shop.content_blocks TO authenticated;
GRANT SELECT ON beauty_shop.content_blocks TO anon;

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION beauty_shop.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON beauty_shop.user_profiles 
  FOR EACH ROW EXECUTE FUNCTION beauty_shop.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON beauty_shop.subscriptions 
  FOR EACH ROW EXECUTE FUNCTION beauty_shop.update_updated_at_column();

CREATE TRIGGER update_content_blocks_updated_at 
  BEFORE UPDATE ON beauty_shop.content_blocks 
  FOR EACH ROW EXECUTE FUNCTION beauty_shop.update_updated_at_column();

