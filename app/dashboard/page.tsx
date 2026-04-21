"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  User,
  ShoppingBag,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  FileDown,
  Settings,
  Loader2,
  Upload,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatPrice, formatDate } from "@/lib/utils"
import { ProtectedRoute } from "@/components/protected-route"
import { useStore } from "@/lib/store"
import { supabase } from "@/lib/db"
import { getOrdersByUser, uploadPaymentProof } from "@/lib/actions/orders"
import { validateFile } from "@/lib/validation"
import type { DbOrder, DbOrderItem } from "@/lib/db-types"
import { useRouter } from "next/navigation"

type OrderWithItems = DbOrder & { order_items: DbOrderItem[] }

const statusConfig = {
  pending: { label: "Menunggu Pembayaran", icon: Clock, color: "bg-amber-500/10 text-amber-600" },
  confirmed: { label: "Dikonfirmasi", icon: CheckCircle, color: "bg-blue-500/10 text-blue-600" },
  completed: { label: "Selesai", icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-600" },
  cancelled: { label: "Dibatalkan", icon: XCircle, color: "bg-red-500/10 text-red-600" },
}

export default function UserDashboardPage() {
  const user = useStore((state) => state.user)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("purchases")
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<Record<string, string>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      const email = session?.user?.email ?? user?.email
      if (!email) { setLoading(false); return }

      const result = await getOrdersByUser(email)
      if (result.success && result.data) {
        setOrders(result.data as OrderWithItems[])
      }
      setLoading(false)
    }
    load()
  }, [user?.email])

  const handleUploadProof = async (orderId: string, file: File) => {
    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      setUploadError((prev) => ({ ...prev, [orderId]: validation.error ?? "File tidak valid" }))
      return
    }

    setUploadingId(orderId)
    setUploadError((prev) => { const next = { ...prev }; delete next[orderId]; return next })

    try {
      const timestamp = Date.now()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
      const filePath = `${orderId}/${timestamp}-${safeName}`

      const { error: storageError } = await supabase.storage
        .from("payment-proofs")
        .upload(filePath, file, { cacheControl: "3600", upsert: false })

      if (storageError) throw storageError

      const { data: urlData } = supabase.storage.from("payment-proofs").getPublicUrl(filePath)

      const result = await uploadPaymentProof(orderId, urlData.publicUrl)
      if (!result.success) throw new Error(result.error)

      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, payment_proof: urlData.publicUrl } : o
        )
      )
    } catch (err) {
      console.error(err)
      setUploadError((prev) => ({ ...prev, [orderId]: "Gagal mengupload. Silakan coba lagi." }))
    } finally {
      setUploadingId(null)
    }
  }

  const completedOrders = orders.filter((o) => o.status === "completed")
  const pendingOrders = orders.filter((o) => o.status === "pending")
  const totalSpent = completedOrders.reduce((sum, o) => sum + o.total_amount, 0)

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback className="text-xl">{user?.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{user?.name ?? "Pengguna"}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-muted-foreground">Member ShakaDigital</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent" onClick={() => router.push("/dashboard/settings")}>
            <Settings className="h-4 w-4" />
            Pengaturan Akun
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-primary/10 p-3">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pembelian</p>
                    <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-emerald-500/10 p-3">
                    <Download className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Produk Selesai</p>
                    <p className="text-2xl font-bold text-foreground">{completedOrders.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-blue-500/10 p-3">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Belanja</p>
                    <p className="text-2xl font-bold text-foreground">{formatPrice(totalSpent)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="purchases">Riwayat Pembelian</TabsTrigger>
                <TabsTrigger value="downloads">Produk Saya</TabsTrigger>
              </TabsList>

              <TabsContent value="purchases">
                <Card>
                  <CardHeader>
                    <CardTitle>Riwayat Pembelian</CardTitle>
                    <CardDescription>Semua transaksi pembelian Anda</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="text-lg font-semibold text-foreground">Belum ada pembelian</h3>
                        <p className="mt-1 text-muted-foreground">Mulai belanja produk digital favorit Anda</p>
                        <Link href="/products">
                          <Button className="mt-4">Jelajahi Produk</Button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        {pendingOrders.length > 0 && (
                          <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-500/10 p-3">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-700">
                              {pendingOrders.length} pesanan menunggu konfirmasi pembayaran
                            </span>
                          </div>
                        )}

                        <div className="space-y-4">
                          {orders.map((order) => {
                            const statusKey = order.status as keyof typeof statusConfig
                            const status = statusConfig[statusKey] ?? statusConfig.pending
                            const StatusIcon = status.icon
                            const firstItem = order.order_items[0]
                            const isUploading = uploadingId === order.id
                            const errMsg = uploadError[order.id]

                            return (
                              <div
                                key={order.id}
                                className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-start"
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
                                    </div>
                                    <Badge className={status.color}>
                                      <StatusIcon className="mr-1 h-3 w-3" />
                                      {status.label}
                                    </Badge>
                                  </div>

                                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                    <span className="font-mono text-xs">{order.id.slice(0, 8)}...</span>
                                    <span>•</span>
                                    <span>{formatDate(order.created_at)}</span>
                                    <span>•</span>
                                    <span className="font-semibold text-foreground">
                                      {formatPrice(order.total_amount)}
                                    </span>
                                  </div>

                                  {/* Upload bukti pembayaran untuk order pending */}
                                  {order.status === "pending" && (
                                    <div className="mt-3">
                                      {order.payment_proof ? (
                                        <div className="flex items-center gap-2 text-sm text-emerald-600">
                                          <CheckCircle className="h-4 w-4" />
                                          <span>Bukti pembayaran sudah diupload</span>
                                          <a
                                            href={order.payment_proof}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline"
                                          >
                                            Lihat
                                          </a>
                                        </div>
                                      ) : (
                                        <div className="space-y-1">
                                          <input
                                            ref={(el) => { fileInputRefs.current[order.id] = el }}
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                                            className="hidden"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0]
                                              if (file) handleUploadProof(order.id, file)
                                            }}
                                          />
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-2"
                                            disabled={isUploading}
                                            onClick={() => fileInputRefs.current[order.id]?.click()}
                                          >
                                            {isUploading ? (
                                              <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                              <Upload className="h-4 w-4" />
                                            )}
                                            {isUploading ? "Mengupload..." : "Upload Bukti Pembayaran"}
                                          </Button>
                                          {errMsg && (
                                            <p className="text-xs text-destructive">{errMsg}</p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Download button untuk completed */}
                                {order.status === "completed" && (
                                  <div className="flex gap-2">
                                    {order.order_items.map((item) => (
                                      item.product_id ? (
                                        <DownloadButton key={item.id} productId={item.product_id} />
                                      ) : null
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="downloads">
                <Card>
                  <CardHeader>
                    <CardTitle>Produk Saya</CardTitle>
                    <CardDescription>Produk yang sudah selesai dan bisa didownload</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {completedOrders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Download className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="text-lg font-semibold text-foreground">Belum ada produk</h3>
                        <p className="mt-1 text-muted-foreground">
                          Produk yang sudah dikonfirmasi vendor akan muncul di sini
                        </p>
                        <Link href="/products">
                          <Button className="mt-4">Jelajahi Produk</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {completedOrders.flatMap((order) =>
                          order.order_items.map((item) => (
                            <Card key={item.id} className="overflow-hidden">
                              <div className="relative aspect-[4/3] bg-muted">
                                <Image
                                  src="/placeholder.svg"
                                  alt={item.product_title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <CardContent className="p-4">
                                <h3 className="font-semibold text-foreground">{item.product_title}</h3>
                                <p className="mt-2 text-xs text-muted-foreground">
                                  Dibeli pada {formatDate(order.created_at)}
                                </p>
                                {item.product_id && (
                                  <DownloadButton productId={item.product_id} fullWidth />
                                )}
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </ProtectedRoute>
  )
}

// Sub-component: fetch file_url dari product dan trigger download
function DownloadButton({ productId, fullWidth }: { productId: string; fullWidth?: boolean }) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("products")
      .select("file_url, title")
      .eq("id", productId)
      .single()

    if (error || !data?.file_url) {
      alert("File tidak tersedia")
      setLoading(false)
      return
    }

    // Trigger download
    const a = document.createElement("a")
    a.href = data.file_url
    a.download = data.title ?? "produk"
    a.target = "_blank"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setLoading(false)
  }

  return (
    <Button
      size="sm"
      className={`gap-2 ${fullWidth ? "mt-4 w-full" : ""}`}
      disabled={loading}
      onClick={handleDownload}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4" />
      )}
      Download
    </Button>
  )
}
