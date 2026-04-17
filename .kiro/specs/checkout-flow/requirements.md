# Requirements Document

## Introduction

Fitur Checkout Flow memungkinkan buyer di ShakaDigital untuk menyelesaikan pembelian produk digital melalui proses yang terdiri dari: pengisian data pembeli, pemilihan rekening tujuan transfer, pembuatan order ke database, tampilan halaman konfirmasi, dan upload bukti pembayaran. Pembayaran menggunakan metode transfer bank manual — buyer mentransfer sejumlah total tagihan lalu mengupload bukti pembayaran. Platform kemudian memverifikasi pembayaran sebelum buyer dapat mengunduh produk.

Fitur ini menghubungkan halaman checkout yang sudah ada (`app/checkout/page.tsx`) ke fungsi `createOrder()` di `lib/actions/orders.ts`, menambahkan validasi input, halaman konfirmasi order, dan kemampuan upload bukti pembayaran ke Supabase Storage.

## Glossary

- **Checkout_Form**: Komponen form di halaman `/checkout` tempat buyer mengisi data diri dan memilih bank tujuan transfer.
- **Order**: Entitas pesanan yang tersimpan di tabel `orders` di Supabase, merepresentasikan satu transaksi pembelian.
- **Order_Item**: Entitas item dalam pesanan yang tersimpan di tabel `order_items`, merepresentasikan satu produk dalam satu Order.
- **Cart**: State keranjang belanja buyer yang dikelola oleh Zustand store (`lib/store.ts`).
- **Payment_Proof**: File gambar (JPG/PNG/PDF) bukti transfer yang diupload buyer ke Supabase Storage.
- **Confirmation_Page**: Halaman yang ditampilkan setelah Order berhasil dibuat, menampilkan detail pesanan dan instruksi pembayaran.
- **Upload_Handler**: Fungsi server action yang menangani upload Payment_Proof ke Supabase Storage dan memperbarui kolom `payment_proof` di tabel `orders`.
- **Validator**: Logika validasi input pada Checkout_Form sebelum data dikirim ke server.
- **Supabase_Storage**: Layanan penyimpanan file dari Supabase yang digunakan untuk menyimpan Payment_Proof.
- **Buyer**: Pengguna dengan role buyer yang melakukan pembelian produk digital.
- **Vendor**: Pengguna dengan role vendor yang menjual produk digital di platform.

---

## Requirements

### Requirement 1: Validasi Input Form Checkout

**User Story:** Sebagai buyer, saya ingin mendapatkan umpan balik langsung ketika mengisi form checkout dengan data yang tidak valid, sehingga saya dapat memperbaiki kesalahan sebelum mengirim pesanan.

#### Acceptance Criteria

1. WHEN buyer mengklik tombol "Buat Pesanan" dengan field nama kosong, THE Validator SHALL menampilkan pesan error "Nama lengkap wajib diisi" di bawah field nama.
2. WHEN buyer mengklik tombol "Buat Pesanan" dengan field email kosong, THE Validator SHALL menampilkan pesan error "Email wajib diisi" di bawah field email.
3. WHEN buyer mengklik tombol "Buat Pesanan" dengan format email yang tidak valid, THE Validator SHALL menampilkan pesan error "Format email tidak valid" di bawah field email.
4. WHEN buyer mengklik tombol "Buat Pesanan" dengan field nama yang berisi kurang dari 2 karakter, THE Validator SHALL menampilkan pesan error "Nama minimal 2 karakter".
5. WHILE Checkout_Form menampilkan pesan error, THE Validator SHALL menghapus pesan error pada field yang bersangkutan segera setelah buyer memperbaiki input pada field tersebut.
6. IF semua field wajib terisi dan valid, THEN THE Checkout_Form SHALL mengaktifkan tombol "Buat Pesanan" dan memperbolehkan proses submit.
7. THE Validator SHALL memvalidasi input secara client-side sebelum melakukan pemanggilan ke server action `createOrder()`.

---

### Requirement 2: Pembuatan Order ke Database

**User Story:** Sebagai buyer, saya ingin pesanan saya tersimpan di database setelah saya mengklik "Buat Pesanan", sehingga platform dapat memproses dan melacak transaksi saya.

#### Acceptance Criteria

1. WHEN buyer mengklik "Buat Pesanan" dengan data valid, THE Checkout_Form SHALL memanggil server action `createOrder()` dengan parameter `userEmail`, `userName`, `userId` (jika buyer sudah login), `items` dari Cart, `totalAmount` (subtotal + biaya layanan 5%), dan `notes` (opsional).
2. WHEN `createOrder()` berhasil dieksekusi, THE Checkout_Form SHALL menyimpan `orderId` yang dikembalikan ke state lokal untuk digunakan di Confirmation_Page.
3. WHEN `createOrder()` berhasil dieksekusi, THE Checkout_Form SHALL memanggil `clearCart()` dari Zustand store untuk mengosongkan Cart.
4. IF `createOrder()` mengembalikan `success: false`, THEN THE Checkout_Form SHALL menampilkan pesan error "Gagal membuat pesanan. Silakan coba lagi." tanpa mengosongkan Cart.
5. WHILE `createOrder()` sedang dieksekusi, THE Checkout_Form SHALL menonaktifkan tombol "Buat Pesanan" dan menampilkan indikator loading.
6. THE Checkout_Form SHALL mengirimkan `totalAmount` dalam satuan integer (Rupiah), konsisten dengan tipe data kolom `total_amount` di tabel `orders`.

---

### Requirement 3: Halaman Konfirmasi Order

**User Story:** Sebagai buyer, saya ingin melihat halaman konfirmasi setelah pesanan berhasil dibuat, sehingga saya mendapatkan informasi lengkap tentang pesanan dan instruksi pembayaran.

#### Acceptance Criteria

1. WHEN `createOrder()` berhasil, THE Confirmation_Page SHALL ditampilkan dengan menggantikan tampilan Checkout_Form pada halaman yang sama (`/checkout`).
2. THE Confirmation_Page SHALL menampilkan `orderId` yang dikembalikan dari `createOrder()` sebagai nomor pesanan.
3. THE Confirmation_Page SHALL menampilkan total pembayaran (`grandTotal`) yang harus ditransfer buyer.
4. THE Confirmation_Page SHALL menampilkan detail rekening bank yang dipilih buyer (nama bank, nomor rekening, nama pemilik rekening).
5. THE Confirmation_Page SHALL menampilkan daftar produk yang dibeli beserta harga masing-masing.
6. THE Confirmation_Page SHALL menyediakan tombol "Lihat Status Pesanan" yang mengarahkan buyer ke halaman `/dashboard`.
7. THE Confirmation_Page SHALL menyediakan tombol "Lanjut Belanja" yang mengarahkan buyer ke halaman `/products`.
8. IF buyer mengakses halaman `/checkout` dengan Cart kosong dan tidak ada Order aktif, THEN THE Checkout_Form SHALL mengarahkan buyer ke halaman `/cart`.

---

### Requirement 4: Upload Bukti Pembayaran

**User Story:** Sebagai buyer, saya ingin mengupload bukti transfer setelah melakukan pembayaran, sehingga platform dapat memverifikasi pembayaran saya dan mengaktifkan akses download produk.

#### Acceptance Criteria

1. THE Confirmation_Page SHALL menampilkan komponen upload file untuk Payment_Proof setelah Order berhasil dibuat.
2. WHEN buyer memilih file untuk diupload, THE Upload_Handler SHALL memvalidasi bahwa tipe file adalah JPG, JPEG, PNG, atau PDF.
3. WHEN buyer memilih file dengan tipe yang tidak didukung, THE Upload_Handler SHALL menampilkan pesan error "Format file tidak didukung. Gunakan JPG, PNG, atau PDF."
4. WHEN buyer memilih file dengan ukuran lebih dari 5MB, THE Upload_Handler SHALL menampilkan pesan error "Ukuran file maksimal 5MB."
5. WHEN buyer mengklik tombol upload dengan file yang valid, THE Upload_Handler SHALL mengupload file ke Supabase_Storage pada bucket `payment-proofs` dengan path `{orderId}/{timestamp}-{filename}`.
6. WHEN upload ke Supabase_Storage berhasil, THE Upload_Handler SHALL memanggil server action `uploadPaymentProof()` dengan `orderId` dan URL publik file yang diupload.
7. WHEN `uploadPaymentProof()` berhasil, THE Confirmation_Page SHALL menampilkan pesan sukses "Bukti pembayaran berhasil diupload. Pesanan Anda sedang diverifikasi." dan menyembunyikan komponen upload.
8. IF upload ke Supabase_Storage gagal, THEN THE Upload_Handler SHALL menampilkan pesan error "Upload gagal. Silakan coba lagi." dan mempertahankan komponen upload agar buyer dapat mencoba ulang.
9. WHILE proses upload sedang berlangsung, THE Upload_Handler SHALL menampilkan indikator progress dan menonaktifkan tombol upload.
10. WHERE buyer belum mengupload Payment_Proof, THE Confirmation_Page SHALL menampilkan instruksi bahwa upload bukti pembayaran diperlukan untuk verifikasi.

---

### Requirement 5: Integrasi State Autentikasi

**User Story:** Sebagai buyer yang sudah login, saya ingin data profil saya otomatis terisi di form checkout, sehingga saya tidak perlu mengisi ulang informasi yang sudah ada.

#### Acceptance Criteria

1. WHEN buyer yang sudah login membuka halaman `/checkout`, THE Checkout_Form SHALL mengisi field nama dan email secara otomatis dari session Supabase Auth yang aktif.
2. WHEN `createOrder()` dipanggil untuk buyer yang sudah login, THE Checkout_Form SHALL menyertakan `userId` dari session Supabase Auth pada parameter yang dikirim.
3. WHEN `createOrder()` dipanggil untuk buyer yang belum login (guest), THE Checkout_Form SHALL mengirimkan `userId` sebagai `undefined` sehingga `createOrder()` menyimpan `null` pada kolom `user_id`.
4. WHERE buyer sudah login, THE Checkout_Form SHALL memperbolehkan buyer untuk mengubah nama yang terisi otomatis sebelum submit.

---

### Requirement 6: Ringkasan Pesanan yang Akurat

**User Story:** Sebagai buyer, saya ingin melihat ringkasan pesanan yang akurat di halaman checkout, sehingga saya dapat memverifikasi produk dan total harga sebelum melakukan pembayaran.

#### Acceptance Criteria

1. THE Checkout_Form SHALL menampilkan daftar semua produk di Cart beserta nama produk, nama vendor, dan harga masing-masing.
2. THE Checkout_Form SHALL menghitung dan menampilkan subtotal sebagai jumlah harga semua produk di Cart.
3. THE Checkout_Form SHALL menghitung dan menampilkan biaya layanan sebesar 5% dari subtotal, dibulatkan ke bilangan bulat terdekat menggunakan `Math.round()`.
4. THE Checkout_Form SHALL menampilkan grand total sebagai penjumlahan subtotal dan biaya layanan.
5. WHEN Cart berubah (produk ditambah atau dihapus) sebelum checkout disubmit, THE Checkout_Form SHALL memperbarui tampilan ringkasan pesanan secara reaktif sesuai perubahan Cart.
