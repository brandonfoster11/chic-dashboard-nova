-- StyleAI Security Enhancement: Secure Storage Policies
-- This script sets up secure storage buckets and policies for user uploads

-- Create a secure storage bucket for wardrobe images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wardrobe-images',
  'wardrobe-images',
  false, -- not public, requires authentication
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']::text[] -- only allow image formats
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Users can view their own uploaded files
DO $$ BEGIN
  CREATE POLICY "Users can view their own wardrobe images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'wardrobe-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can upload their own files
DO $$ BEGIN
  CREATE POLICY "Users can upload their own wardrobe images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'wardrobe-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can update their own files
DO $$ BEGIN
  CREATE POLICY "Users can update their own wardrobe images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'wardrobe-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users can delete their own files
DO $$ BEGIN
  CREATE POLICY "Users can delete their own wardrobe images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'wardrobe-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Admins can view all files
DO $$ BEGIN
  CREATE POLICY "Admins can view all wardrobe images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'wardrobe-images' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role_id = 2
    )
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create a function to generate a secure upload path
CREATE OR REPLACE FUNCTION generate_upload_path(user_id UUID, filename TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  file_ext TEXT;
  unique_filename TEXT;
BEGIN
  -- Extract file extension
  file_ext := substring(filename from '\.([^\.]+)$');
  
  -- Generate a unique filename with UUID
  unique_filename := uuid_generate_v4()::text;
  
  -- If file extension exists, append it
  IF file_ext IS NOT NULL THEN
    unique_filename := unique_filename || '.' || file_ext;
  END IF;
  
  -- Return path in format: user_id/YYYY-MM-DD/unique_filename
  RETURN user_id::text || '/' || to_char(now(), 'YYYY-MM-DD') || '/' || unique_filename;
END;
$$;
