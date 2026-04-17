import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
      </Link>

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold text-foreground">Kebijakan Privasi</h1>
        <p className="text-muted-foreground">Terakhir diperbarui: 19 Desember 2024</p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">1. Informasi yang Kami Kumpulkan</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Kami mengumpulkan informasi yang Anda berikan secara langsung, termasuk:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Nama lengkap dan alamat email</li>
            <li>Informasi pembayaran dan transaksi</li>
            <li>Data produk yang dibeli atau dijual</li>
            <li>Komunikasi dengan tim support</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">2. Penggunaan Informasi</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">Informasi yang kami kumpulkan digunakan untuk:</p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Memproses transaksi dan mengirimkan produk digital</li>
            <li>Mengirimkan notifikasi penting tentang akun Anda</li>
            <li>Meningkatkan layanan dan pengalaman pengguna</li>
            <li>Mencegah penipuan dan aktivitas ilegal</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">3. Keamanan Data</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Kami menerapkan langkah-langkah keamanan yang ketat untuk melindungi data pribadi Anda dari akses tidak sah,
            perubahan, pengungkapan, atau penghancuran. Data sensitif seperti informasi pembayaran dienkripsi
            menggunakan teknologi SSL.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">4. Berbagi Informasi</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga. Informasi hanya dibagikan kepada:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Vendor terkait untuk memproses pesanan Anda</li>
            <li>Penyedia layanan pembayaran yang terpercaya</li>
            <li>Otoritas hukum jika diwajibkan oleh undang-undang</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">5. Cookie</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Kami menggunakan cookie untuk meningkatkan pengalaman browsing Anda, mengingat preferensi, dan menganalisis
            penggunaan situs. Anda dapat mengatur browser untuk menolak cookie, namun beberapa fitur mungkin tidak
            berfungsi dengan baik.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">6. Hak Anda</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">Anda memiliki hak untuk:</p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Mengakses dan mengunduh data pribadi Anda</li>
            <li>Memperbarui atau memperbaiki informasi yang tidak akurat</li>
            <li>Menghapus akun dan data pribadi Anda</li>
            <li>Berhenti berlangganan dari email marketing</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-foreground">7. Hubungi Kami</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, hubungi kami di{" "}
            <a href="mailto:privacy@shakadigital.com" className="text-primary hover:underline">
              privacy@shakadigital.com
            </a>
          </p>
        </section>
      </article>
    </main>
  )
}
