-- StyleAI Security Enhancement: CCPA Compliance
-- This script sets up functions to support CCPA compliance requirements

-- Function to export all user data (CCPA right to access)
CREATE OR REPLACE FUNCTION export_user_data(user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_data JSONB;
BEGIN
  -- Verify the requesting user is the same as the user whose data is being exported
  IF auth.uid() <> user_id AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role_id = 2 -- Admin role
  ) THEN
    RAISE EXCEPTION 'Access denied: You can only export your own data';
  END IF;

  -- Collect all user data into a JSON structure
  SELECT jsonb_build_object(
    'profile', (SELECT row_to_json(p) FROM profiles p WHERE p.id = user_id),
    'wardrobe_items', (SELECT jsonb_agg(row_to_json(w)) FROM wardrobe_items w WHERE w.user_id = user_id),
    'outfits', (SELECT jsonb_agg(row_to_json(o)) FROM outfits o WHERE o.user_id = user_id),
    'style_preferences', (SELECT row_to_json(sp) FROM style_preferences sp WHERE sp.user_id = user_id),
    'outfit_shares', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'share', row_to_json(os),
          'outfit', (SELECT row_to_json(o) FROM outfits o WHERE o.id = os.outfit_id)
        )
      )
      FROM outfit_shares os
      WHERE os.shared_by = user_id OR os.shared_with = user_id
    ),
    'recommendations', (SELECT jsonb_agg(row_to_json(r)) FROM outfit_recommendations r WHERE r.user_id = user_id),
    'mfa_logs', (SELECT jsonb_agg(row_to_json(ml)) FROM mfa_logs ml WHERE ml.user_id = user_id),
    'metadata', jsonb_build_object(
      'export_date', now(),
      'export_requested_by', auth.uid(),
      'version', '1.0'
    )
  ) INTO user_data;

  RETURN user_data;
END;
$$;

-- Function to delete all user data (CCPA right to delete)
CREATE OR REPLACE FUNCTION delete_user_data(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  storage_path TEXT;
BEGIN
  -- Verify the requesting user is the same as the user whose data is being deleted
  IF auth.uid() <> user_id AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role_id = 2 -- Admin role
  ) THEN
    RAISE EXCEPTION 'Access denied: You can only delete your own data';
  END IF;

  -- Begin transaction
  BEGIN
    -- Delete storage objects
    storage_path := user_id || '/';
    DELETE FROM storage.objects WHERE bucket_id = 'wardrobe-images' AND name LIKE storage_path || '%';

    -- Delete outfit recommendations
    DELETE FROM outfit_recommendations WHERE user_id = user_id;

    -- Delete outfit shares
    DELETE FROM outfit_shares WHERE shared_by = user_id OR shared_with = user_id;

    -- Delete style preferences
    DELETE FROM style_preferences WHERE user_id = user_id;

    -- Delete outfit items (through cascading delete from outfits)
    DELETE FROM outfits WHERE user_id = user_id;

    -- Delete wardrobe items
    DELETE FROM wardrobe_items WHERE user_id = user_id;

    -- Delete MFA logs
    DELETE FROM mfa_logs WHERE user_id = user_id;

    -- Delete profile
    DELETE FROM profiles WHERE id = user_id;

    -- Note: This doesn't delete the auth.users entry - that would need to be done through Supabase Auth API
    -- as it's not directly accessible via SQL

    RETURN TRUE;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Error deleting user data: %', SQLERRM;
      RETURN FALSE;
  END;
END;
$$;

-- Function to anonymize user data (alternative to full deletion)
CREATE OR REPLACE FUNCTION anonymize_user_data(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  anon_id TEXT;
BEGIN
  -- Verify the requesting user is the same as the user whose data is being anonymized
  IF auth.uid() <> user_id AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role_id = 2 -- Admin role
  ) THEN
    RAISE EXCEPTION 'Access denied: You can only anonymize your own data';
  END IF;

  -- Generate an anonymized identifier
  anon_id := 'anon_' || substr(md5(random()::text), 1, 16);

  -- Begin transaction
  BEGIN
    -- Anonymize profile
    UPDATE profiles
    SET 
      username = anon_id,
      full_name = 'Anonymized User',
      avatar_url = NULL,
      style_preferences = '{}'::jsonb,
      body_measurements = '{}'::jsonb
    WHERE id = user_id;

    -- Anonymize MFA logs
    UPDATE mfa_logs
    SET 
      ip_address = NULL,
      user_agent = NULL,
      device_fingerprint = NULL
    WHERE user_id = user_id;

    -- Note: We're keeping the actual data items but removing personal identifiers
    -- This allows the system to maintain referential integrity while respecting privacy

    RETURN TRUE;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Error anonymizing user data: %', SQLERRM;
      RETURN FALSE;
  END;
END;
$$;
