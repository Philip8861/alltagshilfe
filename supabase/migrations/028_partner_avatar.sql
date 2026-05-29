-- Partner-Profilbilder (Storage + Metadaten in partner_profiles)

ALTER TABLE public.partner_profiles
  ADD COLUMN IF NOT EXISTS avatar_path text;

COMMENT ON COLUMN public.partner_profiles.avatar_path IS
  'Relativer Pfad im Bucket partner-avatars, z. B. {user_id}/avatar.jpg';

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'partner-avatars',
  'partner-avatars',
  true,
  512000,
  ARRAY['image/jpeg', 'image/png']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "partner_avatars_public_read" ON storage.objects;
DROP POLICY IF EXISTS "partner_avatars_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "partner_avatars_update_own" ON storage.objects;
DROP POLICY IF EXISTS "partner_avatars_delete_own" ON storage.objects;

CREATE POLICY "partner_avatars_public_read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'partner-avatars');

CREATE POLICY "partner_avatars_insert_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'partner-avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "partner_avatars_update_own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'partner-avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'partner-avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "partner_avatars_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'partner-avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
