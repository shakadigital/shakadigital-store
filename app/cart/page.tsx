"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { formatPrice, getCategoryLabel } from "@/lib/utils"

export default function CartPage() {
  const router = useRouter()
  const cart = useStore((state) => state.cart)
  const removeFromCart = useStore((state) => state.removeFromCart)
  const getCartTotal = useStore((state) => state.getCartTotal)

  const total = getCartTotal()
  const serviceFee = Math.round(total * 0.05) // 5% service fee

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <ShoppingCart className="mb-6 h-24 w-24 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Keranjang Kosong</h1>
          <p className="mt-2 text-muted-foreground">Belum ada produk di keranjang Anda</p>
          <Link href="/products">
            <Button className="mt-6 gap-2">
              <ShoppingBag className="h-4 w-4" />
              Mulai Belanja
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Lanjut Belanja
      </Button>

      <h1 className="mb-8 text-3xl font-bold text-foreground">Keranjang Belanja</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                {cart.length} Produk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item, index) => (
                <div key={item.product.id}>
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/products/${item.product.id}`}
                            className="font-semibold text-foreground hover:text-primary hover:underline"
                          >
                            {item.product.title}
                          </Link>
                          <p className="mt-1 text-sm text-muted-foreground">{item.product.vendorName}</p>
                          <span className="mt-2 inline-block rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                            {getCategoryLabel(item.product.category)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-auto text-lg font-bold text-primary">{formatPrice(item.product.price)}</p>
                    </div>
                  </div>
                  {index < cart.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({cart.length} produk)</span>
                <span className="text-foreground">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Biaya layanan (5%)</span>
                <span className="text-foreground">{formatPrice(serviceFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">{formatPrice(total + serviceFee)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Link href="/checkout" className="w-full">
                <Button className="w-full" size="lg">
                  Lanjut ke Pembayaran
                </Button>
              </Link>
              <p className="text-center text-xs text-muted-foreground">
                Dengan melanjutkan, Anda setuju dengan syarat dan ketentuan kami
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
