"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { CheckoutForm } from "@/components/checkout-form"
import { ConfirmationView } from "@/components/confirmation-view"
import { calculateOrderSummaryMemoized } from "@/lib/checkout-calculations"
import type { CartItem } from "@/lib/types"

type CheckoutView = "form" | "confirmation"

export default function CheckoutPage() {
  const router = useRouter()
  const cart = useStore((state) => state.cart)

  // View state management
  const [view, setView] = useState<CheckoutView>("form")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [selectedBank, setSelectedBank] = useState("BCA")
  const [savedOrderItems, setSavedOrderItems] = useState<CartItem[]>([])
  const [savedGrandTotal, setSavedGrandTotal] = useState(0)

  // Calculate order summary
  const { grandTotal } = calculateOrderSummaryMemoized(cart)

  // Redirect to /cart if cart is empty and no active order
  useEffect(() => {
    if (cart.length === 0 && !orderId) {
      router.push("/cart")
    }
  }, [cart.length, orderId, router])

  // Handle view transition after successful order creation
  const handleOrderCreated = (newOrderId: string, bank: string) => {
    // Save cart items and grand total before they're cleared
    setSavedOrderItems([...cart])
    setSavedGrandTotal(grandTotal)
    
    setOrderId(newOrderId)
    setSelectedBank(bank)
    setView("confirmation")
  }

  // Prevent rendering if cart is empty and no order
  if (cart.length === 0 && !orderId) {
    return null
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Back button - only show on form view */}
      {view === "form" && (
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Keranjang
        </Button>
      )}

      {/* Conditionally render CheckoutForm or ConfirmationView */}
      {view === "form" ? (
        <>
          <h1 className="mb-8 text-3xl font-bold text-foreground">Checkout</h1>
          <CheckoutForm onOrderCreated={handleOrderCreated} />
        </>
      ) : (
        <ConfirmationView
          orderId={orderId!}
          grandTotal={savedGrandTotal}
          selectedBank={selectedBank}
          orderItems={savedOrderItems}
        />
      )}
    </main>
  )
}
