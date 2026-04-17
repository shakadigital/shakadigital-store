import { Search, MessageCircle, FileText, ShoppingBag, CreditCard, Download } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const helpCategories = [
  {
    icon: ShoppingBag,
    title: "Pembelian",
    description: "Cara membeli dan checkout produk",
    href: "#pembelian",
  },
  {
    icon: CreditCard,
    title: "Pembayaran",
    description: "Metode dan konfirmasi pembayaran",
    href: "#pembayaran",
  },
  {
    icon: Download,
    title: "Download",
    description: "Cara mengunduh produk digital",
    href: "#download",
  },
  {
    icon: FileText,
    title: "Vendor",
    description: "Panduan menjadi vendor",
    href: "#vendor",
  },
]

const faqs = [
  {
    question: "Bagaimana cara membeli produk di ShakaDigital?",
    answer:
      "Pilih produk yang Anda inginkan, klik 'Tambah ke Keranjang', lalu lanjutkan ke halaman checkout. Isi data pembeli dan pilih metode pembayaran, kemudian selesaikan pembayaran sesuai instruksi.",
  },
  {
    question: "Metode pembayaran apa saja yang tersedia?",
    answer:
      "Saat ini kami menerima pembayaran melalui transfer bank (BCA, Mandiri, BNI). Kami sedang mengembangkan integrasi dengan e-wallet dan kartu kredit.",
  },
  {
    question: "Berapa lama proses konfirmasi pembayaran?",
    answer:
      "Konfirmasi pembayaran dilakukan dalam 1x24 jam setelah Anda melakukan transfer. Setelah dikonfirmasi, produk akan langsung bisa didownload dari dashboard Anda.",
  },
  {
    question: "Apakah produk bisa di-download ulang?",
    answer:
      "Ya, semua produk yang sudah dibeli bisa didownload kapan saja dari halaman 'Produk Saya' di dashboard Anda. Akses download berlaku seumur hidup.",
  },
  {
    question: "Bagaimana cara menjadi vendor di ShakaDigital?",
    answer:
      "Klik tombol 'Jual Produk' di navbar, lalu daftar sebagai vendor. Setelah akun diverifikasi, Anda bisa mulai mengupload dan menjual produk digital Anda.",
  },
  {
    question: "Berapa komisi yang dikenakan untuk vendor?",
    answer:
      "ShakaDigital mengenakan komisi sebesar 10% dari setiap penjualan. Sisa 90% akan masuk ke saldo vendor dan bisa dicairkan setiap saat.",
  },
]

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-foreground">Pusat Bantuan</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Temukan jawaban untuk pertanyaan Anda atau hubungi tim support kami
        </p>
        <div className="mx-auto mt-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Cari bantuan..." className="h-12 pl-12 text-base" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-foreground">Kategori Bantuan</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {helpCategories.map((category) => (
            <Link key={category.title} href={category.href}>
              <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{category.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-foreground">Pertanyaan Umum (FAQ)</h2>
        <Card>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-foreground hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>

      {/* Contact */}
      <section>
        <Card className="bg-primary/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Masih butuh bantuan?</CardTitle>
            <CardDescription>Tim support kami siap membantu Anda 24/7</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button className="w-full gap-2 sm:w-auto">
              <MessageCircle className="h-4 w-4" />
              Hubungi Support
            </Button>
            <Button variant="outline" className="w-full gap-2 bg-transparent sm:w-auto">
              <FileText className="h-4 w-4" />
              Kirim Email
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
