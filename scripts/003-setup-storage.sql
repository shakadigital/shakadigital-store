-- Setup Supabase Storage for payment proofs
-- Requirements: 4.5, 4.6

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload payment proofs
CREATE POLICY "Authenticated users can upload payment proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-proofs');

-- Allow users to read their own payment proofs
CREATE POLICY "Users can read their own payment proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'payment-proofs');

-- Allow service role to manage all payment proofs (for admin operations)
CREATE POLICY "Service role can manage payment proofs"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'payment-proofs');
