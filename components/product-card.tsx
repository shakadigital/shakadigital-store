"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Download, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { formatPrice, getCategoryLabel } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((state) => state.addToCart)
  const cart = useStore((state) => state.cart)
  const isInCart = cart.some((item) => item.product.id === product.id)

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Badge className="absolute left-3 top-3" variant="secondary">
            {getCategoryLabel(product.category)}
          </Badge>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 font-semibold text-foreground transition-colors hover:text-primary">
            {product.title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{product.vendorName}</p>
        <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {product.rating}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            {product.downloads}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
        <Button
          size="sm"
          variant={isInCart ? "secondary" : "default"}
          onClick={() => addToCart(product)}
          disabled={isInCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isInCart ? "Di Keranjang" : "Tambah"}
        </Button>
      </CardFooter>
    </Card>
  )
}
