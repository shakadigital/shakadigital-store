"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/actions/products"
import { getCategoryLabel } from "@/lib/utils"
import type { ProductCategory } from "@/lib/types"
import type { DbProduct } from "@/lib/db-types"

const categories: ProductCategory[] = ["ebook", "template", "software", "course"]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") as ProductCategory | null

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">(initialCategory || "all")
  const [sortBy, setSortBy] = useState("newest")
  const [products, setProducts] = useState<DbProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true)
      const result = await getProducts({
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        search: searchQuery || undefined,
        sortBy,
      })
      if (result.success && result.data) setProducts(result.data)
      setIsLoading(false)
    }
    fetchProducts()
  }, [searchQuery, selectedCategory, sortBy])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Semua Produk</h1>
        <p className="mt-2 text-muted-foreground">Temukan produk digital terbaik untuk kebutuhan Anda</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as ProductCategory | "all")}>
            <SelectTrigger className="w-[150px]">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{getCategoryLabel(cat)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="popular">Terpopuler</SelectItem>
              <SelectItem value="rating">Rating Tertinggi</SelectItem>
              <SelectItem value="price-low">Harga Terendah</SelectItem>
              <SelectItem value="price-high">Harga Tertinggi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategory !== "all" || searchQuery) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter aktif:</span>
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {getCategoryLabel(selectedCategory)}
              <button onClick={() => setSelectedCategory("all")}><X className="h-3 w-3" /></button>
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              &quot;{searchQuery}&quot;
              <button onClick={() => setSearchQuery("")}><X className="h-3 w-3" /></button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={() => { setSelectedCategory("all"); setSearchQuery("") }}>
            Hapus semua
          </Button>
        </div>
      )}

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Memuat produk..." : `Menampilkan ${products.length} produk`}
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Produk tidak ditemukan</h3>
          <p className="mt-2 text-muted-foreground">Coba ubah filter atau kata kunci pencarian Anda</p>
        </div>
      )}
    </main>
  )
}
