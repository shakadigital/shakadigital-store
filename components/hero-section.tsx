import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"

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
      <ContainerScroll
        titleComponent={
          <>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Platform Marketplace Produk Digital #1 Indonesia
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl max-w-4xl mx-auto mb-6">
              Temukan & Jual Produk Digital <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Berkualitas Tinggi
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl mx-auto mb-10">
              Marketplace terpercaya untuk e-book, template, software, dan kursus online. Bergabung dengan ribuan kreator dan pembeli di seluruh Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  Jelajahi Produk
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/vendor/dashboard">
                <Button size="lg" variant="outline">
                  Mulai Berjualan
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 text-center mt-10 mb-4">
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {stats?.totalProducts ? `${stats.totalProducts.toLocaleString("id-ID")}+` : "10,000+"}
                </p>
                <p className="text-sm text-muted-foreground">Produk Digital</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {stats?.totalVendors ? `${stats.totalVendors.toLocaleString("id-ID")}+` : "5,000+"}
                </p>
                <p className="text-sm text-muted-foreground">Kreator Aktif</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {stats?.totalDownloads ? `${stats.totalDownloads.toLocaleString("id-ID")}+` : "50,000+"}
                </p>
                <p className="text-sm text-muted-foreground">Transaksi Sukses</p>
              </div>
            </div>
          </>
        }
      >
        <div className="relative w-full h-full bg-background rounded-2xl overflow-hidden border border-border">
          {/* We use scene1.png from the AI generated assets we saved earlier */}
          <img
            src="/assets/scene1.png"
            alt="Marketplace Platform Preview"
            className="w-full h-full object-cover rounded-2xl"
            draggable={false}
          />
        </div>
      </ContainerScroll>
    </section>
  )
}
