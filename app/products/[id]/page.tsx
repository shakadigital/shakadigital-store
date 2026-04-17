"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Star, Download, ShoppingCart, ArrowLeft, FileText, Clock, Shield, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStore } from "@/lib/store"
import { formatPrice, getCategoryLabel, formatDate } from "@/lib/utils"
import { mockProducts, mockVendors } from "@/lib/data"
import { ProductCard } from "@/components/product-card"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const addToCart = useStore((state) => state.addToCart)
  const cart = useStore((state) => state.cart)

  const product = mockProducts.find((p) => p.id === id)
  const vendor = product ? mockVendors.find((v) => v.id === product.vendorId) : null
  const isInCart = cart.some((item) => item.product.id === id)
  const relatedProducts = mockProducts.filter((p) => p.category === product?.category && p.id !== id).slice(0, 4)

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">Produk tidak ditemukan</h1>
        <p className="mt-2 text-muted-foreground">Produk yang Anda cari tidak tersedia</p>
        <Button className="mt-6" onClick={() => router.push("/products")}>
          Kembali ke Katalog
        </Button>
      </main>
    )
  }

  const handleAddToCart = () => {
    addToCart(product)
  }

  const handleBuyNow = () => {
    addToCart(product)
    router.push("/cart")
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border">
          <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
          <Badge className="absolute left-4 top-4" variant="secondary">
            {getCategoryLabel(product.category)}
          </Badge>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1 text-sm">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">(128 ulasan)</span>
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Download className="h-4 w-4" />
              {product.downloads} downloads
            </span>
          </div>

          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Ukuran File</p>
                <p className="font-medium text-foreground">{product.fileSize}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Terakhir Update</p>
                <p className="font-medium text-foreground">{formatDate(product.createdAt)}</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1 gap-2" onClick={handleBuyNow}>
              Beli Sekarang
            </Button>
            <Button
              size="lg"
              variant={isInCart ? "secondary" : "outline"}
              className="flex-1 gap-2"
              onClick={handleAddToCart}
              disabled={isInCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {isInCart ? "Di Keranjang" : "Tambah ke Keranjang"}
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Garansi 30 hari uang kembali</span>
          </div>

          {/* Vendor Card */}
          {vendor && (
            <Card className="mt-6">
              <CardContent className="flex items-center gap-4 p-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={vendor.avatar || "/placeholder.svg"} alt={vendor.name} />
                  <AvatarFallback>{vendor.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Link
                    href={`/vendors/${vendor.id}`}
                    className="font-semibold text-foreground hover:text-primary hover:underline"
                  >
                    {vendor.name}
                  </Link>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {vendor.rating}
                    </span>
                    <span>{vendor.totalProducts} produk</span>
                    <span>{vendor.totalSales} terjual</span>
                  </div>
                </div>
                <Link href={`/vendors/${vendor.id}`}>
                  <Button variant="outline" size="sm">
                    Lihat Toko
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Features */}
      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-foreground">Yang Anda Dapatkan</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Akses seumur hidup",
            "Update gratis selamanya",
            "Dokumentasi lengkap",
            "Support via email",
            "File original berkualitas tinggi",
            "Lisensi komersial",
            "Source files included",
            "Tutorial penggunaan",
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <span className="text-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Produk Serupa</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
