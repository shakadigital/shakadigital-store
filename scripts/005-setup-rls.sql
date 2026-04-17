-- Row Level Security (RLS) untuk ShakaDigital Store
-- Jalankan script ini di Supabase SQL Editor

-- ============================================================
-- AKTIFKAN RLS
-- ============================================================

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- VENDORS
-- ============================================================

-- Siapa saja bisa melihat semua vendor
CREATE POLICY "vendors_select_public"
ON vendors FOR SELECT
TO public
USING (true);

-- Vendor hanya bisa update profil miliknya sendiri
CREATE POLICY "vendors_update_own"
ON vendors FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- User yang sudah login bisa mendaftar sebagai vendor
CREATE POLICY "vendors_insert_own"
ON vendors FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Service role bisa melakukan semua operasi (untuk server actions)
CREATE POLICY "vendors_all_service_role"
ON vendors FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================
-- PRODUCTS
-- ============================================================

-- Siapa saja bisa melihat produk yang aktif
CREATE POLICY "products_select_active"
ON products FOR SELECT
TO public
USING (is_active = true);

-- Vendor bisa melihat semua produknya (termasuk yang tidak aktif)
CREATE POLICY "products_select_own_vendor"
ON products FOR SELECT
TO authenticated
USING (
  vendor_id IN (
    SELECT id FROM vendors WHERE user_id = auth.uid()
  )
);

-- Vendor hanya bisa insert produk miliknya
CREATE POLICY "products_insert_own"
ON products FOR INSERT
TO authenticated
WITH CHECK (
  vendor_id IN (
    SELECT id FROM vendors WHERE user_id = auth.uid()
  )
);

-- Vendor hanya bisa update produk miliknya
CREATE POLICY "products_update_own"
ON products FOR UPDATE
TO authenticated
USING (
  vendor_id IN (
    SELECT id FROM vendors WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  vendor_id IN (
    SELECT id FROM vendors WHERE user_id = auth.uid()
  )
);

-- Vendor hanya bisa delete (soft delete) produk miliknya
CREATE POLICY "products_delete_own"
ON products FOR DELETE
TO authenticated
USING (
  vendor_id IN (
    SELECT id FROM vendors WHERE user_id = auth.uid()
  )
);

-- Service role bisa melakukan semua operasi
CREATE POLICY "products_all_service_role"
ON products FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================
-- ORDERS
-- ============================================================

-- Buyer hanya bisa melihat order miliknya (by user_id atau email)
CREATE POLICY "orders_select_own_buyer"
ON orders FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Vendor bisa melihat order yang mengandung produk miliknya
CREATE POLICY "orders_select_vendor"
ON orders FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT oi.order_id
    FROM order_items oi
    JOIN vendors v ON oi.vendor_id = v.id
    WHERE v.user_id = auth.uid()
  )
);

-- User yang login bisa membuat order
CREATE POLICY "orders_insert_authenticated"
ON orders FOR INSERT
TO authenticated
WITH CHECK (true);

-- Guest (anon) juga bisa membuat order
CREATE POLICY "orders_insert_anon"
ON orders FOR INSERT
TO anon
WITH CHECK (true);

-- Buyer bisa update order miliknya (untuk upload bukti pembayaran)
CREATE POLICY "orders_update_own_buyer"
ON orders FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
  OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
)
WITH CHECK (true);

-- Service role bisa melakukan semua operasi
CREATE POLICY "orders_all_service_role"
ON orders FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================
-- ORDER ITEMS
-- ============================================================

-- Buyer bisa melihat item dari order miliknya
CREATE POLICY "order_items_select_buyer"
ON order_items FOR SELECT
TO authenticated
USING (
  order_id IN (
    SELECT id FROM orders
    WHERE user_id = auth.uid()
    OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Vendor bisa melihat item produk miliknya
CREATE POLICY "order_items_select_vendor"
ON order_items FOR SELECT
TO authenticated
USING (
  vendor_id IN (
    SELECT id FROM vendors WHERE user_id = auth.uid()
  )
);

-- Service role bisa melakukan semua operasi
CREATE POLICY "order_items_all_service_role"
ON order_items FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
