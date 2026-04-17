import { HeroSection } from "@/components/hero-section"
import { CategoryCard } from "@/components/category-card"
import { ProductCard } from "@/components/product-card"
import { getFeaturedProducts, getPopularProducts } from "@/lib/actions/products"
import { getHomeStats, getCategoryStats } from "@/lib/actions/stats"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const defaultCategories = [
  { category: "ebook" as const, label: "E-Book & PDF", description: "Buku digital & panduan", count: 0 },
  { category: "template" as const, label: "Template & Desain", description: "UI kit & grafis", count: 0 },
  { category: "software" as const, label: "Software & Kode", description: "Aplikasi & source code", count: 0 },
  { category: "course" as const, label: "Kursus Online", description: "Video pembelajaran", count: 0 },
]

export default async function HomePage() {
  // Fetch data from database
  const [featuredResult, popularResult, statsResult, categoryStatsResult] = await Promise.all([
    getFeaturedProducts(4),
    getPopularProducts(8),
    getHomeStats(),
    getCategoryStats(),
  ])

  const featuredProducts = featuredResult.success ? featuredResult.data : []
  const popularProducts = popularResult.success ? popularResult.data : []
  const stats = statsResult.success ? statsResult.data : { totalProducts: 0, totalVendors: 0, totalDownloads: 0 }
  const categoryStats = categoryStatsResult.success ? categoryStatsResult.data : []

  // Map category counts
  const categories = defaultCategories.map((cat) => {
    const stat = categoryStats.find((s) => s.category === cat.category)
    return { ...cat, count: stat ? Number.parseInt(stat.count) : 0 }
  })

  // Transform DB products to component format
  const transformProduct = (p: any) => ({
    id: p.id,
    title: p.title,
    description: p.description || "",
    price: p.price,
    category: p.category,
    image: p.image,
    vendorId: p.vendor_id,
    vendorName: p.vendor_name || "Unknown Vendor",
    downloads: p.downloads,
    rating: Number(p.rating),
    createdAt: p.created_at,
    fileSize: p.file_size,
  })

  return (
    <main>
      <HeroSection stats={stats} />

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground">Kategori Produk</h2>
          <p className="mt-2 text-muted-foreground">Pilih kategori sesuai kebutuhan Anda</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.category} {...cat} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Produk Unggulan</h2>
              <p className="mt-2 text-muted-foreground">Pilihan terbaik dari kreator kami</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="gap-2">
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={transformProduct(product)} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Produk Populer</h2>
            <p className="mt-2 text-muted-foreground">Yang paling banyak diunduh</p>
          </div>
          <Link href="/products">
            <Button variant="ghost" className="gap-2">
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={transformProduct(product)} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold">Siap Menjadi Kreator?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Bergabung dengan ribuan kreator sukses dan mulai menjual produk digital Anda. Gratis mendaftar dan komisi
            kompetitif.
          </p>
          <Link href="/vendor/register">
            <Button size="lg" variant="secondary" className="mt-8">
              Daftar Sebagai Vendor
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
