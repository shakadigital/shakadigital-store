"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Check, Copy, CreditCard, Building2, Upload, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import type { CartItem, BankAccount } from "@/lib/types"
import { PaymentProofUpload } from "@/components/payment-proof-upload"

interface ConfirmationViewProps {
  orderId: string
  grandTotal: number
  selectedBank: string
  orderItems: CartItem[]
}

const bankAccounts: BankAccount[] = [
  { bank: "BCA", number: "1234567890", name: "PT Shaka Digital Indonesia" },
  { bank: "Mandiri", number: "0987654321", name: "PT Shaka Digital Indonesia" },
  { bank: "BNI", number: "1122334455", name: "PT Shaka Digital Indonesia" },
]

export function ConfirmationView({ orderId, grandTotal, selectedBank, orderItems }: ConfirmationViewProps) {
  const router = useRouter()
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)
  const [paymentProofUploaded, setPaymentProofUploaded] = useState(false)

  // Find the selected bank account details
  const selectedBankAccount = bankAccounts.find((account) => account.bank === selectedBank)

  const handleUploadSuccess = () => {
    setPaymentProofUploaded(true)
  }

  const copyToClipboard = (text: string, accountNumber: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAccount(accountNumber)
    setTimeout(() => setCopiedAccount(null), 2000)
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* Success Header */}
      <Card className="mb-6 text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Pesanan Berhasil Dibuat!</CardTitle>
          <CardDescription className="text-base">
            Nomor Pesanan: <span className="font-mono font-semibold text-foreground">{orderId}</span>
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Payment Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Instruksi Pembayaran
              </CardTitle>
              <CardDescription>
                Silakan transfer ke rekening berikut untuk menyelesaikan pembayaran
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedBankAccount && (
                <div className="rounded-lg border border-primary bg-primary/5 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Bank Tujuan</p>
                      <p className="text-xl font-bold text-foreground">{selectedBankAccount.bank}</p>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Nomor Rekening</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-lg font-semibold text-foreground">
                          {selectedBankAccount.number}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(selectedBankAccount.number, selectedBankAccount.number)}
                        >
                          {copiedAccount === selectedBankAccount.number ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Atas Nama</p>
                      <p className="font-medium text-foreground">{selectedBankAccount.name}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-muted p-4">
                <p className="mb-2 text-sm font-medium text-foreground">Total Pembayaran</p>
                <p className="text-3xl font-bold text-primary">{formatPrice(grandTotal)}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-8 gap-2"
                  onClick={() => copyToClipboard(grandTotal.toString(), "total")}
                >
                  {copiedAccount === "total" ? (
                    <>
                      <Check className="h-3 w-3" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Salin Jumlah
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Langkah-langkah:</p>
                <ol className="list-inside list-decimal space-y-1">
                  <li>Transfer sejumlah total pembayaran ke rekening di atas</li>
                  <li>Simpan bukti transfer Anda</li>
                  <li>Upload bukti transfer di bawah ini</li>
                  <li>Tunggu konfirmasi pembayaran (maksimal 1x24 jam)</li>
                  <li>Produk akan dikirim ke email Anda setelah pembayaran dikonfirmasi</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Produk yang Dibeli
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderItems.map((item, index) => (
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
                  {index < orderItems.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Upload Payment Proof & Navigation */}
        <div className="space-y-6">
          {/* Payment Proof Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Upload className="h-5 w-5" />
                Upload Bukti Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentProofUpload orderId={orderId} onUploadSuccess={handleUploadSuccess} />
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Card>
            <CardContent className="space-y-3 pt-6">
              <Button onClick={() => router.push("/dashboard")} className="w-full" size="lg">
                Lihat Status Pesanan
              </Button>
              <Button variant="outline" onClick={() => router.push("/products")} className="w-full" size="lg">
                Lanjut Belanja
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
