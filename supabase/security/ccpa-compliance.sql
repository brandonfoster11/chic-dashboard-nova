-- StyleAI Security Enhancement: CCPA Compliance
-- This script implements CCPA compliance functions for user data management

-- Function to export user data (CCPA right to access)
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

  -- Collect all user data into a JSONB object
  SELECT jsonb_build_object(
    'user_id', user_id,
    'profile', (SELECT row_to_json(p) FROM profiles p WHERE p.id = user_id),
    'wardrobe_items', (SELECT jsonb_agg(row_to_json(w)) FROM wardrobe_items w WHERE w.user_id = user_id),
    'outfits', (SELECT jsonb_agg(row_to_json(o)) FROM outfits o WHERE o.user_id = user_id),
    'outfit_items', (
      SELECT jsonb_agg(row_to_json(oi)) 
      FROM outfit_items oi 
      JOIN outfits o ON oi.outfit_id = o.id 
      WHERE o.user_id = user_id
    ),
    'style_preferences', (SELECT row_to_json(sp) FROM style_preferences sp WHERE sp.user_id = user_id),
    'outfit_shares', (
      SELECT jsonb_agg(row_to_json(os)) 
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
    -- Delete all user data from all tables
    DELETE FROM outfit_recommendations WHERE user_id = user_id;
    DELETE FROM outfit_shares WHERE shared_by = user_id OR shared_with = user_id;
    DELETE FROM style_preferences WHERE user_id = user_id;
    
    -- Delete outfit items for user's outfits
    DELETE FROM outfit_items 
    WHERE outfit_id IN (SELECT id FROM outfits WHERE user_id = user_id);
    
    DELETE FROM outfits WHERE user_id = user_id;
    DELETE FROM wardrobe_items WHERE user_id = user_id;
    DELETE FROM mfa_logs WHERE user_id = user_id;
    
    -- Delete storage objects
    storage_path := user_id || '/';
    DELETE FROM storage.objects 
    WHERE bucket_id = 'wardrobe-images' AND name LIKE storage_path || '%';
    
    -- Finally, delete the profile
    DELETE FROM profiles WHERE id = user_id;
    
    -- Note: We don't delete from auth.users as that's handled by Supabase
    
    RETURN TRUE;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE EXCEPTION 'Error deleting user data: %', SQLERRM;
      RETURN FALSE;
  END;
END;
$$;

-- Function to anonymize user data (CCPA alternative to deletion)
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
  anon_id := 'anon_' || substr(md5(random()::text), 1, 10);

  -- Begin transaction
  BEGIN
    -- Anonymize profile
    UPDATE profiles 
    SET 
      username = anon_id,
      full_name = 'Anonymized User',
      avatar_url = NULL,
      style_preferences = '{}'::jsonb,
      body_measurements = '{}'::jsonb,
      updated_at = NOW()
    WHERE id = user_id;
    
    -- Anonymize wardrobe items
    UPDATE wardrobe_items
    SET
      name = 'Anonymized Item',
      brand = NULL,
      notes = NULL,
      updated_at = NOW()
    WHERE user_id = user_id;
    
    -- Anonymize outfits
    UPDATE outfits
    SET
      name = 'Anonymized Outfit',
      description = NULL,
      updated_at = NOW()
    WHERE user_id = user_id;
    
    -- Delete sensitive logs
    DELETE FROM mfa_logs WHERE user_id = user_id;
    
    RETURN TRUE;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE EXCEPTION 'Error anonymizing user data: %', SQLERRM;
      RETURN FALSE;
  END;
END;
$$;
