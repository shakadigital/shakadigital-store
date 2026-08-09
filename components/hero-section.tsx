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
    <section className="relative overflow-hidden bg-background">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-[0.15] dark:opacity-30"
      >
        <source src="/assets/vid/conn1.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Platform Marketplace Produk Digital #1 Indonesia
          </div>
          <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Temukan & Jual Produk Digital Berkualitas Tinggi
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Marketplace terpercaya untuk e-book, template, software, dan kursus online. Bergabung dengan ribuan kreator
            dan pembeli di seluruh Indonesia.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/products">
              <Button size="lg" className="gap-2">
                Jelajahi Produk
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/vendor/dashboard">
              <Button size="lg" variant="outline" className="bg-background/80 backdrop-blur-sm">
                Mulai Berjualan
              </Button>
            </Link>
          </div>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-foreground">
                {stats?.totalProducts ? `${stats.totalProducts.toLocaleString("id-ID")}+` : "10,000+"}
              </p>
              <p className="text-sm text-muted-foreground">Produk Digital</p>
            </div>
            <div className="h-12 w-px bg-border/50" />
            <div>
              <p className="text-3xl font-bold text-foreground">
                {stats?.totalVendors ? `${stats.totalVendors.toLocaleString("id-ID")}+` : "5,000+"}
              </p>
              <p className="text-sm text-muted-foreground">Kreator Aktif</p>
            </div>
            <div className="h-12 w-px bg-border/50" />
            <div>
              <p className="text-3xl font-bold text-foreground">
                {stats?.totalDownloads ? `${stats.totalDownloads.toLocaleString("id-ID")}+` : "50,000+"}
              </p>
              <p className="text-sm text-muted-foreground">Transaksi Sukses</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
