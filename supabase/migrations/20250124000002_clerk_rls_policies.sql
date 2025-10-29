-- Clerk RLS Policies Migration
-- Configures Row Level Security policies for Clerk authentication

-- Update RLS policies to work with Clerk JWT tokens
-- Clerk uses 'sub' field in JWT for user ID

-- Drop existing policies and recreate with proper Clerk integration
DROP POLICY IF EXISTS "Users can view own profile" ON beauty_shop.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON beauty_shop.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON beauty_shop.user_profiles;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON beauty_shop.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON beauty_shop.subscriptions;
DROP POLICY IF EXISTS "Anyone can view active content blocks" ON beauty_shop.content_blocks;

-- Create Clerk-compatible RLS policies
-- These policies will work once Clerk JWT tokens are properly configured

-- User profiles policies
CREATE POLICY "clerk_users_can_view_own_profile" ON beauty_shop.user_profiles
  FOR SELECT USING (
    auth.jwt() IS NOT NULL 
    AND auth.jwt() ->> 'sub' = clerk_user_id
  );

CREATE POLICY "clerk_users_can_update_own_profile" ON beauty_shop.user_profiles
  FOR UPDATE USING (
    auth.jwt() IS NOT NULL 
    AND auth.jwt() ->> 'sub' = clerk_user_id
  );

CREATE POLICY "clerk_users_can_insert_own_profile" ON beauty_shop.user_profiles
  FOR INSERT WITH CHECK (
    auth.jwt() IS NOT NULL 
    AND auth.jwt() ->> 'sub' = clerk_user_id
  );

-- Subscriptions policies
CREATE POLICY "clerk_users_can_view_own_subscriptions" ON beauty_shop.subscriptions
  FOR SELECT USING (
    auth.jwt() IS NOT NULL 
    AND user_profile_id IN (
      SELECT id FROM beauty_shop.user_profiles 
      WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "clerk_users_can_update_own_subscriptions" ON beauty_shop.subscriptions
  FOR UPDATE USING (
    auth.jwt() IS NOT NULL 
    AND user_profile_id IN (
      SELECT id FROM beauty_shop.user_profiles 
      WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "clerk_users_can_insert_own_subscriptions" ON beauty_shop.subscriptions
  FOR INSERT WITH CHECK (
    auth.jwt() IS NOT NULL 
    AND user_profile_id IN (
      SELECT id FROM beauty_shop.user_profiles 
      WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- Content blocks policies (public read, admin write)
CREATE POLICY "public_can_view_active_content_blocks" ON beauty_shop.content_blocks
  FOR SELECT USING (is_active = true);

-- Admin policies (for future Clerk admin role)
CREATE POLICY "clerk_admin_can_manage_content_blocks" ON beauty_shop.content_blocks
  FOR ALL USING (
    auth.jwt() IS NOT NULL 
    AND auth.jwt() ->> 'role' = 'admin'
  );

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION beauty_shop.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.jwt() ->> 'role' = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get current user's clerk ID
CREATE OR REPLACE FUNCTION beauty_shop.current_clerk_user_id()
RETURNS TEXT AS $$
BEGIN
  RETURN auth.jwt() ->> 'sub';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get user profile by clerk ID
CREATE OR REPLACE FUNCTION beauty_shop.get_user_profile_by_clerk_id(clerk_id TEXT)
RETURNS beauty_shop.user_profiles AS $$
DECLARE
  profile beauty_shop.user_profiles;
BEGIN
  SELECT * INTO profile 
  FROM beauty_shop.user_profiles 
  WHERE clerk_user_id = clerk_id;
  
  RETURN profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION beauty_shop.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION beauty_shop.current_clerk_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION beauty_shop.get_user_profile_by_clerk_id(TEXT) TO authenticated;

-- Create indexes for better performance with RLS
CREATE INDEX IF NOT EXISTS idx_user_profiles_clerk_id_rls ON beauty_shop.user_profiles(clerk_user_id) WHERE clerk_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_profile_rls ON beauty_shop.subscriptions(user_profile_id) WHERE user_profile_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON SCHEMA beauty_shop IS 'Beauty Shop specific tables and functions';
COMMENT ON TABLE beauty_shop.user_profiles IS 'User profiles linked to Clerk authentication';
COMMENT ON TABLE beauty_shop.subscriptions IS 'User subscription management';
COMMENT ON TABLE beauty_shop.content_blocks IS 'CMS content blocks for the website';
COMMENT ON FUNCTION beauty_shop.is_admin() IS 'Check if current user has admin role in Clerk';
COMMENT ON FUNCTION beauty_shop.current_clerk_user_id() IS 'Get current user ID from Clerk JWT';
COMMENT ON FUNCTION beauty_shop.get_user_profile_by_clerk_id(TEXT) IS 'Get user profile by Clerk user ID';
