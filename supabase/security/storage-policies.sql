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
CREATE POLICY "Users can view their own wardrobe images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'wardrobe-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can upload their own files
CREATE POLICY "Users can upload their own wardrobe images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'wardrobe-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update their own files
CREATE POLICY "Users can update their own wardrobe images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'wardrobe-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own files
CREATE POLICY "Users can delete their own wardrobe images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'wardrobe-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can view all files
CREATE POLICY "Admins can view all wardrobe images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'wardrobe-images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role_id = 2
  )
);

-- Create a function to generate a secure upload path
CREATE OR REPLACE FUNCTION get_secure_upload_path(user_id UUID, file_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  -- Format: user_id/timestamp_random_filename.ext
  RETURN user_id || '/' || 
         to_char(now(), 'YYYYMMDD_HH24MISS') || '_' || 
         substr(md5(random()::text), 1, 8) || '_' ||
         file_name;
END;
$$;
