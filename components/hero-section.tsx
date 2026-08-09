import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanvasScrollWorld } from "@/components/ui/canvas-scroll-world"

interface HeroSectionProps {
  stats?: {
    totalProducts: number
    totalVendors: number
    totalDownloads: number
  }
}

export function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="relative h-[120vh] bg-zinc-950 overflow-hidden">
      {/* 3D WebGL Background */}
      <CanvasScrollWorld />

      {/* Foreground Content */}
      <div className="relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center text-center pointer-events-none">
        
        {/* The inner content needs pointer-events-auto to be clickable */}
        <div className="pointer-events-auto flex flex-col items-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/20 px-4 py-2 text-sm font-medium text-primary backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            Platform Marketplace Produk Digital #1 Indonesia
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl max-w-4xl mx-auto mb-6 drop-shadow-lg">
            Temukan & Jual Produk Digital <br />
            <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              Berkualitas Tinggi
            </span>
          </h1>
          <p className="max-w-2xl text-lg text-zinc-300 md:text-xl mx-auto mb-10 drop-shadow-md">
            Marketplace terpercaya untuk e-book, template, software, dan kursus online. Bergabung dengan ribuan kreator dan pembeli di seluruh Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link href="/products">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(34,211,238,0.4)] border-none">
                Jelajahi Produk
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/vendor/dashboard">
              <Button size="lg" variant="outline" className="border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-black/60 hover:text-white">
                Mulai Berjualan
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-center mt-10 mb-4 bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <div>
              <p className="text-3xl font-bold text-white">
                {stats?.totalProducts ? `${stats.totalProducts.toLocaleString("id-ID")}+` : "10,000+"}
              </p>
              <p className="text-sm text-zinc-400">Produk Digital</p>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div>
              <p className="text-3xl font-bold text-white">
                {stats?.totalVendors ? `${stats.totalVendors.toLocaleString("id-ID")}+` : "5,000+"}
              </p>
              <p className="text-sm text-zinc-400">Kreator Aktif</p>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div>
              <p className="text-3xl font-bold text-white">
                {stats?.totalDownloads ? `${stats.totalDownloads.toLocaleString("id-ID")}+` : "50,000+"}
              </p>
              <p className="text-sm text-zinc-400">Transaksi Sukses</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
