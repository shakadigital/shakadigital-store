# Panduan Halaman Vendor

## Fitur yang Sudah Diimplementasikan ✅

### 1. Halaman Vendors List (`/vendors`)
- Menampilkan semua vendor yang terdaftar
- Fetch data dari Supabase dengan sorting berdasarkan total sales
- Menampilkan informasi vendor:
  - Avatar dan nama
  - Bio/deskripsi
  - Rating
  - Total produk
  - Total penjualan
  - Tanggal bergabung
- Loading state saat fetch data
- Empty state jika belum ada vendor
- Link ke halaman detail vendor

### 2. Halaman Vendor Detail (`/vendors/[id]`)
- Menampilkan profil lengkap vendor
- Fetch data vendor dan produk dari Supabase
- Informasi yang ditampilkan:
  - Avatar besar
  - Nama dan bio vendor
  - Rating dengan bintang
  - Statistik (total produk, total penjualan, tanggal bergabung)
- Grid produk dari vendor tersebut
- Loading state saat fetch data
- Error handling jika vendor tidak ditemukan
- Tombol kembali ke halaman sebelumnya
- Empty state jika vendor belum punya produk

## Struktur File

```
app/
├── vendors/
│   ├── page.tsx              # List semua vendor
│   └── [id]/
│       └── page.tsx          # Detail vendor + produknya
```

## API Actions yang Digunakan

### `lib/actions/vendors.ts`
- `getVendors()` - Fetch semua vendor, sorted by total_sales
- `getVendorById(id)` - Fetch vendor by ID

### `lib/actions/products.ts`
- `getProductsByVendor(vendorId)` - Fetch produk milik vendor tertentu

## Cara Menggunakan

### Akses Halaman Vendors List
1. Klik menu "Vendor" di navbar
2. Atau akses langsung `/vendors`
3. Lihat daftar semua vendor
4. Klik "Lihat Toko" untuk ke detail vendor

### Akses Halaman Vendor Detail
1. Dari vendors list, klik "Lihat Toko"
2. Atau akses langsung `/vendors/{vendor-id}`
3. Lihat profil vendor dan produk-produknya
4. Klik produk untuk ke halaman detail produk

## Integrasi dengan Supabase

### Tabel yang Digunakan
- `vendors` - Data vendor (nama, bio, rating, stats)
- `products` - Produk milik vendor (dengan vendor_id)

### Query yang Dilakukan
```sql
-- Get all vendors
SELECT * FROM vendors 
ORDER BY total_sales DESC

-- Get vendor by ID
SELECT * FROM vendors 
WHERE id = {vendor_id}

-- Get vendor products
SELECT *, vendors(name) FROM products 
WHERE vendor_id = {vendor_id} 
AND is_active = true
ORDER BY created_at DESC
```

## Fitur Tambahan yang Bisa Dikembangkan

1. **Filter & Search**
   - Filter vendor by rating
   - Search vendor by name
   - Sort by different criteria

2. **Pagination**
   - Load more vendors
   - Infinite scroll

3. **Vendor Reviews**
   - Tampilkan review dari buyer
   - Rating breakdown

4. **Follow Vendor**
   - Fitur follow/unfollow vendor
   - Notifikasi produk baru

5. **Vendor Contact**
   - Form kontak vendor
   - Chat dengan vendor

## Testing

### Test Vendors List
1. Akses `/vendors`
2. Pastikan vendor muncul dari database
3. Check loading state
4. Check empty state (jika belum ada vendor)

### Test Vendor Detail
1. Akses `/vendors/{vendor-id}` dengan ID yang valid
2. Pastikan profil vendor muncul
3. Pastikan produk vendor muncul
4. Test dengan ID yang tidak valid (404 handling)
5. Test vendor tanpa produk (empty state)

## Troubleshooting

### Vendor tidak muncul
- Pastikan ada data di tabel `vendors` di Supabase
- Check console untuk error
- Pastikan Supabase connection berfungsi

### Produk vendor tidak muncul
- Pastikan produk memiliki `vendor_id` yang benar
- Pastikan `is_active = true`
- Check foreign key relationship

### Error 404
- Pastikan vendor ID valid
- Check apakah vendor ada di database
