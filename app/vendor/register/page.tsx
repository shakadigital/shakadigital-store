"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Store, User, Mail, Lock, FileText, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/db"
import { registerVendor } from "@/lib/actions/vendors"

const benefits = [
  "Jangkau ribuan pembeli potensial di seluruh Indonesia",
  "Komisi kompetitif hanya 10% per penjualan",
  "Dashboard lengkap dengan analytics real-time",
  "Pencairan dana cepat ke rekening bank Anda",
  "Support 24/7 dari tim ShakaDigital",
]

export default function VendorRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    storeName: "",
    name: "",
    email: "",
    password: "",
    bio: "",
    bankName: "",
    bankAccount: "",
    bankHolder: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!agreed) {
      alert("Anda harus menyetujui syarat dan ketentuan")
      return
    }

    setIsLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { name: formData.name, role: "vendor" } },
      })

      if (authError || !authData.user) {
        setError(authError?.message ?? "Gagal membuat akun")
        return
      }

      const result = await registerVendor({
        userId: authData.user.id,
        name: formData.storeName,
        bio: formData.bio,
        bankName: formData.bankName,
        bankAccount: formData.bankAccount,
        bankHolder: formData.bankHolder,
      })

      if (!result.success) {
        setError(result.error ?? "Gagal mendaftarkan toko vendor")
        return
      }

      setStep(3)
    } catch (err) {
      console.error(err)
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 3) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Pendaftaran Berhasil!</CardTitle>
            <CardDescription>
              Akun vendor Anda sedang ditinjau. Kami akan mengirimkan email konfirmasi dalam 1-2 hari kerja.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sementara itu, Anda bisa mulai menyiapkan produk digital yang akan dijual.
            </p>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button onClick={() => router.push("/vendor/dashboard")} className="w-full">
              Ke Dashboard Vendor
            </Button>
            <Button variant="outline" onClick={() => router.push("/")} className="w-full bg-transparent">
              Kembali ke Beranda
            </Button>
          </CardFooter>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left Side - Benefits */}
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Store className="h-4 w-4" />
            Gabung sebagai Vendor
          </div>

          <h1 className="text-4xl font-bold text-foreground">Mulai Jual Produk Digital Anda</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Bergabung dengan ribuan kreator sukses dan monetisasi karya digital Anda di platform marketplace terbesar
            Indonesia.
          </p>

          <div className="mt-8 space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-primary">Rp 45M+</div>
              <div className="text-sm text-muted-foreground">
                Total pendapatan
                <br />
                vendor kami
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Daftar Sebagai Vendor</CardTitle>
              <CardDescription>
                {step === 1 ? "Langkah 1: Informasi Toko" : "Langkah 2: Informasi Pembayaran"}
              </CardDescription>
              <div className="mt-4 flex gap-2">
                <div className={`h-2 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
                <div className={`h-2 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
              </div>
            </CardHeader>

            <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                {step === 1 ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Nama Toko *</Label>
                      <div className="relative">
                        <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="storeName"
                          name="storeName"
                          placeholder="Nama toko Anda"
                          className="pl-10"
                          value={formData.storeName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          placeholder="Nama lengkap Anda"
                          className="pl-10"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="email@example.com"
                          className="pl-10"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Minimal 8 karakter"
                          className="pl-10"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Deskripsi Toko</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="bio"
                          name="bio"
                          placeholder="Ceritakan tentang toko dan produk yang akan Anda jual..."
                          className="min-h-[100px] pl-10"
                          value={formData.bio}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Nama Bank *</Label>
                      <Input
                        id="bankName"
                        name="bankName"
                        placeholder="Contoh: BCA, Mandiri, BNI"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bankAccount">Nomor Rekening *</Label>
                      <Input
                        id="bankAccount"
                        name="bankAccount"
                        placeholder="Nomor rekening bank Anda"
                        value={formData.bankAccount}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bankHolder">Nama Pemilik Rekening *</Label>
                      <Input
                        id="bankHolder"
                        name="bankHolder"
                        placeholder="Nama sesuai buku tabungan"
                        value={formData.bankHolder}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="flex items-start space-x-2 pt-4">
                      <Checkbox
                        id="terms"
                        checked={agreed}
                        onCheckedChange={(checked) => setAgreed(checked as boolean)}
                      />
                      <label htmlFor="terms" className="text-sm leading-relaxed text-muted-foreground">
                        Saya menyetujui{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          Syarat & Ketentuan
                        </Link>{" "}
                        dan{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Kebijakan Privasi
                        </Link>{" "}
                        ShakaDigital
                      </label>
                    </div>
                  </>
                )}
              </CardContent>

              <CardFooter className="flex gap-3">
                {step === 2 && (
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="bg-transparent">
                    Kembali
                  </Button>
                )}
                {step === 1 ? (
                  <Button
                    type="button"
                    className="flex-1 gap-2"
                    onClick={() => setStep(2)}
                    disabled={!formData.storeName || !formData.name || !formData.email || !formData.password}
                  >
                    Lanjutkan
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1" disabled={isLoading || !agreed}>
                    {isLoading ? "Mendaftar..." : "Daftar Sekarang"}
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Sudah punya akun vendor?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
