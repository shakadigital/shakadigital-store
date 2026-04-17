-- Setup Supabase Storage untuk file produk dan thumbnail
-- Jalankan script ini di Supabase SQL Editor

-- Bucket untuk file produk digital
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-files', 'product-files', false)
ON CONFLICT (id) DO NOTHING;

-- Bucket untuk thumbnail produk (public agar bisa ditampilkan di UI)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-thumbnails', 'product-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: vendor bisa upload file produk
CREATE POLICY "Vendors can upload product files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-files');

-- Policy: vendor bisa baca file produk miliknya
CREATE POLICY "Vendors can read their product files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'product-files');

-- Policy: service role bisa manage semua file produk
CREATE POLICY "Service role manages product files"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'product-files');

-- Policy: siapa saja bisa baca thumbnail (public)
CREATE POLICY "Anyone can view product thumbnails"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-thumbnails');

-- Policy: vendor bisa upload thumbnail
CREATE POLICY "Vendors can upload thumbnails"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-thumbnails');

-- Policy: service role bisa manage semua thumbnail
CREATE POLICY "Service role manages thumbnails"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'product-thumbnails');
