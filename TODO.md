# ShakaDigital - Todo List

## 🔴 Prioritas Tinggi

### 1. Autentikasi (Login / Register)
- [x] Hubungkan form login ke `supabase.auth.signInWithPassword()`
- [x] Hubungkan form register ke `supabase.auth.signUp()`
- [x] Simpan session user ke store (Zustand)
- [x] Proteksi halaman dashboard & vendor dengan redirect jika belum login
- [x] Tombol logout

### 2. Halaman Vendor Detail (`/vendors/[id]`)
- [x] Buat file `app/vendors/[id]/page.tsx`
- [x] Fetch data vendor dari Supabase by ID
- [x] Tampilkan profil vendor + daftar produknya

### 3. Checkout Flow
- [x] Hubungkan form checkout ke `createOrder()` di `lib/actions/orders.ts`
- [x] Validasi input (nama, email, catatan)
- [x] Tampilkan halaman konfirmasi setelah order berhasil
- [x] Upload bukti pembayaran ke Supabase Storage

---

## 🟡 Prioritas Sedang

### 4. Upload File Produk (Vendor)
- [x] Integrasi Supabase Storage untuk upload file digital
- [x] Integrasi upload thumbnail/gambar produk
- [x] Simpan `file_url` dan `file_size` ke tabel products

### 5. Dashboard Vendor
- [x] Ganti data mock dengan fetch dari Supabase
- [x] Tampilkan statistik real (revenue, total produk, total penjualan)
- [x] Daftar order masuk untuk vendor
- [x] Manajemen produk (tambah, edit, hapus)

### 6. Dashboard Buyer
- [x] Ganti data mock dengan fetch riwayat order dari Supabase
- [x] Tampilkan status order (pending, confirmed, completed)
- [x] Tombol upload bukti pembayaran per order
- [x] Tombol download produk jika order completed

---

## 🟢 Nice to Have

### 7. Halaman Vendors List (`/vendors`)
- [x] Buat file `app/vendors/page.tsx`
- [x] Fetch semua vendor dari Supabase
- [x] Tampilkan kartu vendor dengan rating dan jumlah produk

### 8. Row Level Security (RLS) Supabase
- [x] Aktifkan RLS di tabel `vendors`, `products`, `orders`, `order_items`
- [x] Buat policy: vendor hanya bisa edit produk miliknya
- [x] Buat policy: buyer hanya bisa lihat order miliknya

### 9. Deploy ke Vercel
- [ ] Push project ke GitHub
- [ ] Connect repo ke Vercel
- [ ] Set environment variables di Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Test production build

---

## Progress
- [x] Setup project & fix bugs awal
- [x] Migrasi database dari Neon ke Supabase
- [x] Fix SQL schema (001-create-tables.sql)
- [x] Fix seed data (002-seed-data.sql)
- [x] Ganti logo navbar & favicon
