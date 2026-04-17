import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
      </Link>

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold text-foreground">Syarat & Ketentuan</h1>
        <p className="text-muted-foreground">Terakhir diperbarui: 19 Desember 2024</p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">1. Ketentuan Umum</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Dengan mengakses dan menggunakan platform ShakaDigital, Anda menyetujui untuk terikat dengan syarat dan
            ketentuan ini. Jika Anda tidak setuju dengan ketentuan ini, mohon untuk tidak menggunakan layanan kami.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">2. Akun Pengguna</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Anda bertanggung jawab untuk menjaga kerahasiaan akun dan password Anda</li>
            <li>Informasi yang Anda berikan harus akurat dan lengkap</li>
            <li>Anda harus berusia minimal 18 tahun untuk menggunakan layanan ini</li>
            <li>Satu orang hanya boleh memiliki satu akun</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">3. Pembelian & Pembayaran</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Semua harga yang ditampilkan sudah termasuk biaya layanan platform. Pembayaran harus dilakukan sesuai dengan
            metode yang tersedia. Produk digital akan dikirimkan setelah pembayaran dikonfirmasi.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">4. Lisensi Produk Digital</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Dengan membeli produk digital, Anda mendapatkan lisensi penggunaan sesuai ketentuan yang ditetapkan oleh
            vendor. Anda tidak diperkenankan untuk menjual kembali, mendistribusikan ulang, atau membagikan produk tanpa
            izin.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">5. Kebijakan Pengembalian Dana</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Pengembalian dana dapat dilakukan dalam 30 hari setelah pembelian jika produk tidak sesuai deskripsi atau
            terdapat masalah teknis. Pengajuan refund akan ditinjau dalam 3-5 hari kerja.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">6. Ketentuan Vendor</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Vendor bertanggung jawab penuh atas produk yang dijual</li>
            <li>Produk tidak boleh melanggar hak cipta atau hukum yang berlaku</li>
            <li>Komisi platform sebesar 10% dari setiap penjualan</li>
            <li>Pencairan dana dapat dilakukan setiap saat ke rekening terdaftar</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">7. Kontak</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami melalui email di{" "}
            <a href="mailto:support@shakadigital.com" className="text-primary hover:underline">
              support@shakadigital.com
            </a>
          </p>
        </section>
      </article>
    </main>
  )
}
