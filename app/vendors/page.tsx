"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Star, Package, ShoppingBag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { getVendors } from "@/lib/actions/vendors"
import type { DbVendor } from "@/lib/db-types"
export default function VendorsPage() {
  const [vendors, setVendors] = useState<DbVendor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVendors() {
      const result = await getVendors()
      if (result.success && result.data) {
        setVendors(result.data)
      }
      setLoading(false)
    }

    fetchVendors()
  }, [])

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="ml-4 text-muted-foreground">Memuat vendor...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Vendor Kami</h1>
        <p className="mt-2 text-muted-foreground">Temukan kreator berbakat dan produk digital berkualitas</p>
      </div>

      {vendors.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Belum ada vendor</h3>
          <p className="mt-1 text-muted-foreground">Vendor akan muncul di sini setelah terdaftar</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <Card key={vendor.id} className="overflow-hidden transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-20 w-20 overflow-hidden rounded-full bg-muted border border-border">
                    {vendor.avatar ? (
                      <img src={vendor.avatar} alt={vendor.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-muted-foreground">
                        {vendor.name[0]}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">{vendor.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{vendor.bio}</p>

                  <div className="mt-4 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">{vendor.rating?.toFixed(1) || "0.0"}</span>
                  </div>

                  <div className="mt-4 flex w-full justify-center gap-6 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>{vendor.total_products || 0} produk</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ShoppingBag className="h-4 w-4" />
                      <span>{vendor.total_sales || 0} terjual</span>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground">
                    Bergabung sejak {formatDate(vendor.created_at)}
                  </p>

                  <Link href={`/vendors/${vendor.id}`} className="mt-4 w-full">
                    <Button variant="outline" className="w-full bg-transparent">
                      Lihat Toko
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
