"use client"

import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { mockAnalytics } from "@/lib/data"
import { formatPrice } from "@/lib/utils"

export default function VendorAnalyticsPage() {
  const router = useRouter()
  const analytics = mockAnalytics

  const categoryColors = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899"]

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Dashboard
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="mt-1 text-muted-foreground">Pantau performa penjualan produk Anda</p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pendapatan Bulan Ini</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{formatPrice(8070000)}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Penjualan Bulan Ini</p>
            <p className="mt-1 text-2xl font-bold text-foreground">42</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              +8% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Rata-rata Nilai Order</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{formatPrice(192143)}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <TrendingDown className="h-3 w-3" />
              -3% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Konversi Rate</p>
            <p className="mt-1 text-2xl font-bold text-foreground">3.2%</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              +0.5% dari bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pendapatan 6 Bulan Terakhir</CardTitle>
            <CardDescription>Trend pendapatan per bulan</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Pendapatan",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                  />
                  <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatPrice(value as number)} />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Penjualan per Kategori</CardTitle>
            <CardDescription>Distribusi penjualan berdasarkan kategori produk</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: {
                  label: "Penjualan",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.salesByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    type="category"
                    dataKey="category"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    width={80}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" radius={[0, 4, 4, 0]}>
                    {analytics.salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Produk Terlaris</CardTitle>
          <CardDescription>Produk dengan penjualan tertinggi bulan ini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Social Media Template Pack", sales: 89, revenue: 17711000 },
              { name: "UI/UX Design System Kit", sales: 67, revenue: 20033000 },
              { name: "E-Commerce Starter Template", sales: 45, revenue: 20250000 },
              { name: "Kursus Adobe Illustrator Pro", sales: 33, revenue: 13167000 },
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} terjual</p>
                  </div>
                </div>
                <p className="font-semibold text-foreground">{formatPrice(product.revenue)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
