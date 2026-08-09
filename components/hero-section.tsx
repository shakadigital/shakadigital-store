import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  stats?: {
    totalProducts: number
    totalVendors: number
    totalDownloads: number
  }
}

export function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/assets/vid/conn1.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-green-400" />
            Platform Marketplace Produk Digital #1 Indonesia
          </div>
          <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:text-6xl">
            Temukan & Jual Produk Digital Berkualitas Tinggi
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] md:text-xl">
            Marketplace terpercaya untuk e-book, template, software, dan kursus online. Bergabung dengan ribuan kreator
            dan pembeli di seluruh Indonesia.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/products">
              <Button size="lg" className="gap-2 bg-green-600 text-white hover:bg-green-700 shadow-lg">
                Jelajahi Produk
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/vendor/dashboard">
              <Button size="lg" variant="outline" className="border-white/50 bg-black/40 text-white backdrop-blur-md hover:bg-black/60 hover:text-white shadow-lg">
                Mulai Berjualan
              </Button>
            </Link>
          </div>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <div>
              <p className="text-3xl font-bold text-white">
                {stats?.totalProducts ? `${stats.totalProducts.toLocaleString("id-ID")}+` : "10,000+"}
              </p>
              <p className="text-sm text-white/80">Produk Digital</p>
            </div>
            <div className="h-12 w-px bg-white/30" />
            <div>
              <p className="text-3xl font-bold text-white">
                {stats?.totalVendors ? `${stats.totalVendors.toLocaleString("id-ID")}+` : "5,000+"}
              </p>
              <p className="text-sm text-white/80">Kreator Aktif</p>
            </div>
            <div className="h-12 w-px bg-white/30" />
            <div>
              <p className="text-3xl font-bold text-white">
                {stats?.totalDownloads ? `${stats.totalDownloads.toLocaleString("id-ID")}+` : "50,000+"}
              </p>
              <p className="text-sm text-white/80">Transaksi Sukses</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
