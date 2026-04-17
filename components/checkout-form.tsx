"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Copy, Check, CreditCard, Building2, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useStore } from "@/lib/store"
import { formatPrice } from "@/lib/utils"
import { calculateOrderSummaryMemoized } from "@/lib/checkout-calculations"
import { validateEmail, validateName } from "@/lib/validation"
import { createOrder } from "@/lib/actions/orders"
import type { ValidationErrors, BankAccount } from "@/lib/types"

const bankAccounts: BankAccount[] = [
  { bank: "BCA", number: "1234567890", name: "PT Shaka Digital Indonesia" },
  { bank: "Mandiri", number: "0987654321", name: "PT Shaka Digital Indonesia" },
  { bank: "BNI", number: "1122334455", name: "PT Shaka Digital Indonesia" },
]

interface CheckoutFormProps {
  onOrderCreated: (orderId: string, selectedBank: string) => void
}

export function CheckoutForm({ onOrderCreated }: CheckoutFormProps) {
  const cart = useStore((state) => state.cart)
  const user = useStore((state) => state.user)
  const clearCart = useStore((state) => state.clearCart)
  
  // Component state
  const [buyerName, setBuyerName] = useState("")
  const [buyerEmail, setBuyerEmail] = useState("")
  const [selectedBank, setSelectedBank] = useState("BCA")
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)
  const [orderError, setOrderError] = useState<string | null>(null)

  // Auto-fill name and email from authenticated user session
  useEffect(() => {
    if (user) {
      setBuyerName(user.name || "")
      setBuyerEmail(user.email || "")
    }
  }, [user])

  // Calculate order summary using memoized utilities
  const { subtotal, serviceFee, grandTotal } = calculateOrderSummaryMemoized(cart)

  const copyToClipboard = (text: string, accountNumber: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAccount(accountNumber)
    setTimeout(() => setCopiedAccount(null), 2000)
  }

  // Validation on blur for name field
  const handleNameBlur = () => {
    const result = validateName(buyerName)
    if (!result.valid) {
      setErrors((prev) => ({ ...prev, name: result.error }))
    }
  }

  // Validation on blur for email field
  const handleEmailBlur = () => {
    const result = validateEmail(buyerEmail)
    if (!result.valid) {
      setErrors((prev) => ({ ...prev, email: result.error }))
    }
  }

  // Clear error when user corrects name input
  const handleNameChange = (value: string) => {
    setBuyerName(value)
    if (errors.name) {
      const result = validateName(value)
      if (result.valid) {
        setErrors((prev) => ({ ...prev, name: undefined }))
      }
    }
  }

  // Clear error when user corrects email input
  const handleEmailChange = (value: string) => {
    setBuyerEmail(value)
    if (errors.email) {
      const result = validateEmail(value)
      if (result.valid) {
        setErrors((prev) => ({ ...prev, email: undefined }))
      }
    }
  }

  // Check if form has validation errors
  const hasValidationErrors = () => {
    const nameResult = validateName(buyerName)
    const emailResult = validateEmail(buyerEmail)
    return !nameResult.valid || !emailResult.valid
  }

  const handleSubmitOrder = async () => {
    // Validate all fields before submission
    const nameResult = validateName(buyerName)
    const emailResult = validateEmail(buyerEmail)

    // Set errors if validation fails
    if (!nameResult.valid || !emailResult.valid) {
      setErrors({
        name: nameResult.error,
        email: emailResult.error,
      })
      return // Prevent form submission with invalid data
    }

    // Clear any existing errors
    setErrors({})
    setOrderError(null)

    // Set loading state
    setIsSubmitting(true)
    
    try {
      // Call createOrder server action with validated data
      const result = await createOrder({
        userEmail: buyerEmail,
        userName: buyerName,
        userId: user?.id, // Include userId for authenticated users, undefined for guests
        items: cart,
        totalAmount: grandTotal,
        notes: `Transfer ke ${selectedBank}`, // Include selected bank in notes
      })

      if (result.success && result.data?.orderId) {
        // Store returned orderId and transition to confirmation view
        onOrderCreated(result.data.orderId, selectedBank)
        
        // Clear cart on successful order creation
        clearCart()
      } else {
        // Display error message if createOrder failed without clearing cart
        setOrderError(result.error || "Gagal membuat pesanan. Silakan coba lagi.")
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Error creating order:", error)
      setOrderError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Buyer Info Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Informasi Pembeli
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                placeholder="Masukkan nama lengkap"
                value={buyerName}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={handleNameBlur}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={buyerEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={handleEmailBlur}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
              <p className="text-xs text-muted-foreground">Produk akan dikirim ke email ini</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Metode Pembayaran
            </CardTitle>
            <CardDescription>Transfer ke salah satu rekening berikut</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedBank} onValueChange={setSelectedBank} className="space-y-3">
              {bankAccounts.map((account) => (
                <div
                  key={account.bank}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                    selectedBank === account.bank ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={account.bank} id={account.bank} />
                    <Label htmlFor={account.bank} className="cursor-pointer">
                      <p className="font-semibold text-foreground">{account.bank}</p>
                      <p className="text-sm text-muted-foreground">{account.name}</p>
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-foreground">{account.number}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(account.number, account.number)}
                    >
                      {copiedAccount === account.number ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Order Items Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Produk yang Dibeli
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.map((item, index) => (
              <div key={item.product.id}>
                <div className="flex gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{item.product.title}</p>
                      <p className="text-sm text-muted-foreground">{item.product.vendorName}</p>
                    </div>
                    <p className="font-semibold text-foreground">{formatPrice(item.product.price)}</p>
                  </div>
                </div>
                {index < cart.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Order Summary Card */}
      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Ringkasan Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Biaya layanan</span>
              <span className="text-foreground">{formatPrice(serviceFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-xl font-bold text-primary">{formatPrice(grandTotal)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            {orderError && (
              <div className="w-full rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                {orderError}
              </div>
            )}
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleSubmitOrder} 
              disabled={isSubmitting || hasValidationErrors()}
            >
              {isSubmitting ? "Memproses..." : "Buat Pesanan"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Setelah transfer, konfirmasi pembayaran akan diproses dalam 1x24 jam
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
