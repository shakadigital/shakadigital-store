"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowLeft, Package, Clock, CheckCircle, Search, Eye, Loader2, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice, formatDate } from "@/lib/utils"
import { supabase } from "@/lib/db"
import { getVendorByUserId } from "@/lib/actions/upload-product"
import { getOrdersByVendor, updateOrderStatus } from "@/lib/actions/orders"
import type { DbOrder, DbOrderItem } from "@/lib/db-types"

type OrderWithItems = DbOrder & { order_items: DbOrderItem[] }

const statusConfig = {
  pending: { label: "Menunggu", icon: Clock, color: "bg-amber-500/10 text-amber-600" },
  confirmed: { label: "Dikonfirmasi", icon: CheckCircle, color: "bg-blue-500/10 text-blue-600" },
  completed: { label: "Selesai", icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-600" },
  cancelled: { label: "Dibatalkan", icon: XCircle, color: "bg-red-500/10 text-red-600" },
}

export default function VendorOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.id) { setLoading(false); return }

      const vendorRes = await getVendorByUserId(session.user.id)
      if (!vendorRes.success || !vendorRes.vendorId) { setLoading(false); return }

      const result = await getOrdersByVendor(vendorRes.vendorId)
      if (result.success && result.data) {
        setOrders(result.data as OrderWithItems[])
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleConfirm = async (orderId: string) => {
    setUpdatingId(orderId)
    const result = await updateOrderStatus(orderId, "confirmed")
    if (result.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "confirmed" } : o))
      )
    } else {
      alert("Gagal mengkonfirmasi pesanan")
    }
    setUpdatingId(null)
  }

  const handleComplete = async (orderId: string) => {
    setUpdatingId(orderId)
    const result = await updateOrderStatus(orderId, "completed")
    if (result.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "completed" } : o))
      )
    } else {
      alert("Gagal menyelesaikan pesanan")
    }
    setUpdatingId(null)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user_name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_items.some((item) =>
        item.product_title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total_amount, 0)
  const pendingCount = orders.filter((o) => o.status === "pending").length

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Dashboard
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Kelola Pesanan</h1>
        <p className="mt-1 text-muted-foreground">Lihat dan kelola semua pesanan produk Anda</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pesanan</p>
                  <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-amber-500/10 p-3">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Menunggu Konfirmasi</p>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-emerald-500/10 p-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendapatan</p>
                  <p className="text-2xl font-bold text-foreground">{formatPrice(totalRevenue)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari pesanan, pembeli, atau produk..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Orders List */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pesanan</CardTitle>
              <CardDescription>Menampilkan {filteredOrders.length} pesanan</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground">Tidak ada pesanan</h3>
                  <p className="mt-1 text-muted-foreground">
                    {orders.length === 0
                      ? "Belum ada pesanan masuk"
                      : "Pesanan yang sesuai filter tidak ditemukan"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const statusKey = order.status as keyof typeof statusConfig
                    const status = statusConfig[statusKey] ?? statusConfig.pending
                    const StatusIcon = status.icon
                    const firstItem = order.order_items[0]
                    const isUpdating = updatingId === order.id

                    return (
                      <div
                        key={order.id}
                        className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center"
                      >
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src="/placeholder.svg"
                            alt={firstItem?.product_title ?? "Produk"}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-foreground">
                                {order.order_items.map((i) => i.product_title).join(", ")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.user_name ?? order.user_email}
                                {order.user_name && (
                                  <span className="ml-1 text-xs">({order.user_email})</span>
                                )}
                              </p>
                            </div>
                            <Badge className={status.color}>
                              <StatusIcon className="mr-1 h-3 w-3" />
                              {status.label}
                            </Badge>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                            <div className="text-sm text-muted-foreground">
                              <span className="font-mono text-xs">{order.id.slice(0, 8)}...</span>
                              <span className="mx-2">|</span>
                              <span>{formatDate(order.created_at)}</span>
                              {order.payment_proof && (
                                <>
                                  <span className="mx-2">|</span>
                                  <a
                                    href={order.payment_proof}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline"
                                  >
                                    Bukti Transfer
                                  </a>
                                </>
                              )}
                            </div>
                            <p className="font-semibold text-primary">{formatPrice(order.total_amount)}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <Button
                              size="sm"
                              className="gap-1"
                              disabled={isUpdating}
                              onClick={() => handleConfirm(order.id)}
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              Konfirmasi
                            </Button>
                          )}
                          {order.status === "confirmed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              disabled={isUpdating}
                              onClick={() => handleComplete(order.id)}
                            >
                              {isUpdating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                              Selesaikan
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </main>
  )
}
