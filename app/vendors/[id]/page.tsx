"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Star, Package, ShoppingBag, Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProductCard } from "@/components/product-card"
import { formatDate } from "@/lib/utils"
import { getVendorById } from "@/lib/actions/vendors"
import { getProductsByVendor } from "@/lib/actions/products"
import type { DbVendor, DbProduct } from "@/lib/db-types"

export default function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [vendor, setVendor] = useState<DbVendor | null>(null)
  const [products, setProducts] = useState<DbProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      // Fetch vendor data
      const vendorResult = await getVendorById(id)
      if (!vendorResult.success || !vendorResult.data) {
        setError("Vendor tidak ditemukan")
        setLoading(false)
        return
      }

      setVendor(vendorResult.data)

      // Fetch vendor products
      const productsResult = await getProductsByVendor(id)
      if (productsResult.success && productsResult.data) {
        setProducts(productsResult.data)
      }

      setLoading(false)
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="ml-4 text-muted-foreground">Memuat data vendor...</p>
        </div>
      </main>
    )
  }

  if (error || !vendor) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">Vendor tidak ditemukan</h1>
        <p className="mt-2 text-muted-foreground">Vendor yang Anda cari tidak tersedia</p>
        <Button className="mt-6" onClick={() => router.push("/vendors")}>
          Kembali ke Daftar Vendor
        </Button>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Button>

      {/* Vendor Header */}
      <div className="mb-10 rounded-xl border border-border bg-card p-6 md:p-8">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage src={vendor.avatar || "/placeholder.svg"} alt={vendor.name} />
            <AvatarFallback className="text-3xl">{vendor.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{vendor.name}</h1>
            <p className="mt-2 text-muted-foreground">{vendor.bio}</p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-6 md:justify-start">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-foreground">{vendor.rating?.toFixed(1) || "0.0"}</span>
                <span className="text-muted-foreground">(ulasan)</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>{vendor.total_products || 0} produk</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <ShoppingBag className="h-4 w-4" />
                <span>{vendor.total_sales || 0} terjual</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Bergabung {formatDate(vendor.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Products */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-foreground">Produk dari {vendor.name}</h2>

        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={{
                  id: product.id,
                  title: product.title,
                  description: product.description,
                  price: product.price,
                  category: product.category as any,
                  image: product.image,
                  vendorId: product.vendor_id,
                  vendorName: product.vendor_name || vendor.name,
                  downloads: product.downloads,
                  rating: product.rating,
                  createdAt: product.created_at,
                  fileSize: product.file_size || undefined,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Belum ada produk</h3>
            <p className="mt-1 text-muted-foreground">Vendor ini belum menambahkan produk</p>
          </div>
        )}
      </section>
    </main>
  )
}
