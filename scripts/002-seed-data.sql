-- Seed data untuk vendors
INSERT INTO vendors (id, name, avatar, bio, total_products, total_sales, rating, is_verified)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Digital Studio', '/placeholder.svg?height=100&width=100', 'Spesialis template dan desain grafis berkualitas tinggi', 24, 1250, 4.8, true),
  ('22222222-2222-2222-2222-222222222222', 'Code Masters', '/placeholder.svg?height=100&width=100', 'Developer profesional dengan pengalaman 10+ tahun', 18, 890, 4.9, true),
  ('33333333-3333-3333-3333-333333333333', 'EduPro Academy', '/placeholder.svg?height=100&width=100', 'Platform edukasi terbaik untuk pembelajaran digital', 32, 2100, 4.7, true)
ON CONFLICT (id) DO NOTHING;

-- Seed data untuk products
INSERT INTO products (id, vendor_id, title, description, price, category, image, downloads, rating, file_size)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'UI/UX Design System Kit', 'Koleksi lengkap komponen UI untuk desain aplikasi modern dengan 500+ elemen siap pakai', 299000, 'template', '/placeholder.svg?height=400&width=600', 456, 4.8, '125 MB'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'E-Commerce Starter Template', 'Template Next.js lengkap untuk toko online dengan dashboard admin dan integrasi payment', 450000, 'software', '/placeholder.svg?height=400&width=600', 234, 4.9, '45 MB'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Panduan Lengkap Digital Marketing', 'E-book komprehensif tentang strategi pemasaran digital untuk pemula hingga mahir', 149000, 'ebook', '/placeholder.svg?height=400&width=600', 1890, 4.7, '8 MB'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'Kursus React & Next.js Mastery', 'Video course 40+ jam untuk menguasai React dan Next.js dari dasar hingga production', 599000, 'course', '/placeholder.svg?height=400&width=600', 567, 4.9, '12 GB'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'Social Media Template Pack', '150+ template Instagram, Facebook & TikTok dalam format Canva dan Figma', 199000, 'template', '/placeholder.svg?height=400&width=600', 2340, 4.6, '320 MB'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', 'Buku Investasi Saham Pemula', 'Panduan lengkap berinvestasi saham untuk pemula dengan strategi yang terbukti', 89000, 'ebook', '/placeholder.svg?height=400&width=600', 3456, 4.8, '5 MB'),
  ('a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5', '22222222-2222-2222-2222-222222222222', 'Laravel SaaS Boilerplate', 'Starter kit Laravel dengan multi-tenancy, billing, dan dashboard admin siap pakai', 750000, 'software', '/placeholder.svg?height=400&width=600', 178, 4.9, '85 MB'),
  ('b2c3d4e5-f6a7-4b8c-9d0e-f1a2b3c4d5e6', '11111111-1111-1111-1111-111111111111', 'Kursus Adobe Illustrator Pro', 'Masterclass lengkap Adobe Illustrator dari pemula hingga mahir dengan 50+ project', 399000, 'course', '/placeholder.svg?height=400&width=600', 892, 4.7, '8 GB')
ON CONFLICT (id) DO NOTHING;
