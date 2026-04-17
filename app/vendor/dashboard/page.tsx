"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Package,
  Plus,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  BarChart3,
  ShoppingBag,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatPrice, getCategoryLabel, formatDate } from "@/lib/utils"
import { ProtectedRoute } from "@/components/protected-route"
import { supabase } from "@/lib/db"
import { getVendorByUserId } from "@/lib/actions/upload-product"
import { getVendorStats } from "@/lib/actions/vendors"
import { deleteProduct } from "@/lib/actions/upload-product"
import type { DbProduct } from "@/lib/db-types"

export default function VendorDashboardPage() {
  const [products, setProducts] = useState<DbProduct[]>([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalProducts: 0,
  })
  const [loading, setLoading] = useState(true)
  const [vendorId, setVendorId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.id) { setLoading(false); return }

      const vendorRes = await getVendorByUserId(session.user.id)
      if (!vendorRes.success || !vendorRes.vendorId) { setLoading(false); return }

      const vid = vendorRes.vendorId
      setVendorId(vid)

      const [productsRes, statsRes] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .eq("vendor_id", vid)
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
        getVendorStats(vid),
      ])

      if (productsRes.data) setProducts(productsRes.data as DbProduct[])

      if (statsRes.success && statsRes.data) {
        // Count completed order items for this vendor
        const { count: salesCount } = await supabase
          .from("order_items")
          .select("id", { count: "exact", head: true })
          .eq("vendor_id", vid)

        setStats({
          totalRevenue: statsRes.data.totalRevenue,
          totalSales: salesCount ?? 0,
          totalProducts: productsRes.data?.length ?? 0,
        })
      }

      setLoading(false)
    }
    load()
  }, [])

  const handleDelete = async (productId: string) => {
    if (!vendorId) return
    if (!confirm("Yakin ingin menghapus produk ini?")) return
    setDeletingId(productId)
    const result = await deleteProduct(productId, vendorId)
    if (result.success) {
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      setStats((prev) => ({ ...prev, totalProducts: prev.totalProducts - 1 }))
    } else {
      alert("Gagal menghapus produk")
    }
    setDeletingId(null)
  }

  const statCards = [
    {
      title: "Total Pendapatan",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
    },
    {
      title: "Total Penjualan",
      value: stats.totalSales.toString(),
      icon: TrendingUp,
    },
    {
      title: "Total Produk",
      value: stats.totalProducts.toString(),
      icon: Package,
    },
  ]

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vendor Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Kelola produk dan pantau penjualan Anda</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/vendor/orders">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ShoppingBag className="h-4 w-4" />
                Pesanan
              </Button>
            </Link>
            <Link href="/vendor/analytics">
              <Button variant="outline" className="gap-2 bg-transparent">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
            </Link>
            <Link href="/vendor/upload">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah Produk
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              {statCards.map((stat) => (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <div className="rounded-full bg-primary/10 p-3">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>Produk Saya</CardTitle>
                <CardDescription>Kelola semua produk digital Anda</CardDescription>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-foreground">Belum ada produk</h3>
                    <p className="mt-1 text-muted-foreground">Mulai upload produk pertama Anda</p>
                    <Link href="/vendor/upload" className="mt-4">
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Upload Produk
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left text-sm text-muted-foreground">
                          <th className="pb-3 font-medium">Produk</th>
                          <th className="hidden pb-3 font-medium md:table-cell">Kategori</th>
                          <th className="pb-3 font-medium">Harga</th>
                          <th className="hidden pb-3 font-medium sm:table-cell">Downloads</th>
                          <th className="hidden pb-3 font-medium lg:table-cell">Tanggal</th>
                          <th className="pb-3 font-medium">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b border-border last:border-0">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                                  <Image
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate font-medium text-foreground">{product.title}</p>
                                  <p className="text-xs text-muted-foreground md:hidden">
                                    {getCategoryLabel(product.category)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="hidden py-4 md:table-cell">
                              <Badge variant="secondary">{getCategoryLabel(product.category)}</Badge>
                            </td>
                            <td className="py-4 font-medium text-foreground">{formatPrice(product.price)}</td>
                            <td className="hidden py-4 text-muted-foreground sm:table-cell">{product.downloads}</td>
                            <td className="hidden py-4 text-muted-foreground lg:table-cell">
                              {formatDate(product.created_at)}
                            </td>
                            <td className="py-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" disabled={deletingId === product.id}>
                                    {deletingId === product.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <MoreVertical className="h-4 w-4" />
                                    )}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/products/${product.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Lihat
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDelete(product.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </ProtectedRoute>
  )
}
