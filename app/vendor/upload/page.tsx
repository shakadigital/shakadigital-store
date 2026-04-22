"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, ImageIcon, FileText, X, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { supabase } from "@/lib/db"
import { uploadProductFile, getVendorByUserId } from "@/lib/actions/upload-product"
import { createProduct } from "@/lib/actions/upload-product"
import type { ProductCategory } from "@/lib/types"

const categories: { value: ProductCategory; label: string }[] = [
  { value: "ebook", label: "E-Book & PDF" },
  { value: "template", label: "Template & Desain" },
  { value: "software", label: "Software & Kode" },
]

export default function UploadProductPage() {
  const router = useRouter()
  const user = useStore((state) => state.user)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadStep, setUploadStep] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "" as ProductCategory | "",
  })

  const [productFile, setProductFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setProductFile(file)
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate image type
      if (!file.type.startsWith("image/")) {
        setError("Thumbnail harus berupa file gambar (PNG, JPG, dll)")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran thumbnail maksimal 5MB")
        return
      }
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setThumbnailPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      setError("Mohon lengkapi semua field yang diperlukan")
      return
    }
    if (!productFile) {
      setError("Mohon upload file produk")
      return
    }

    // Get authenticated user from Supabase session
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id ?? user?.id

    if (!userId) {
      setError("Anda harus login sebagai vendor untuk mengupload produk")
      return
    }

    setIsSubmitting(true)

    try {
      // Step 1: Get vendor ID from user ID
      setUploadStep("Memverifikasi akun vendor...")
      const vendorResult = await getVendorByUserId(userId)
      if (!vendorResult.success || !vendorResult.vendorId) {
        setError(vendorResult.error ?? "Akun vendor tidak ditemukan. Daftar sebagai vendor terlebih dahulu.")
        return
      }
      const vendorId = vendorResult.vendorId

      // Step 2: Upload thumbnail (optional)
      let thumbnailUrl: string | undefined
      if (thumbnailFile) {
        setUploadStep("Mengupload thumbnail...")
        const thumbForm = new FormData()
        thumbForm.append("file", thumbnailFile)
        const thumbResult = await uploadProductFile(thumbForm, vendorId, "thumbnail")
        if (!thumbResult.success) {
          setError(thumbResult.error ?? "Gagal mengupload thumbnail")
          return
        }
        thumbnailUrl = thumbResult.url
      }

      // Step 3: Upload product file
      setUploadStep("Mengupload file produk...")
      const productForm = new FormData()
      productForm.append("file", productFile)
      const fileResult = await uploadProductFile(productForm, vendorId, "product")
      if (!fileResult.success) {
        setError(fileResult.error ?? "Gagal mengupload file produk")
        return
      }

      // Step 4: Save product to database
      setUploadStep("Menyimpan data produk...")
      const createResult = await createProduct({
        vendorId,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category as ProductCategory,
        image: thumbnailUrl,
        fileUrl: fileResult.url,
        fileSize: fileResult.fileSize,
      })

      if (!createResult.success) {
        setError(createResult.error ?? "Gagal menyimpan produk")
        return
      }

      setUploadSuccess(true)
    } catch (err) {
      console.error(err)
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
      setUploadStep("")
    }
  }

  if (uploadSuccess) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Produk Berhasil Diupload!</CardTitle>
            <CardDescription>Produk Anda telah tersimpan dan akan segera tampil di marketplace</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={() => router.push("/vendor/dashboard")}>Kembali ke Dashboard</Button>
            <Button
              variant="outline"
              onClick={() => {
                setUploadSuccess(false)
                setError(null)
                setFormData({ title: "", description: "", price: "", category: "" })
                setProductFile(null)
                setThumbnailFile(null)
                setThumbnailPreview(null)
              }}
            >
              Upload Produk Lain
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Upload Produk Baru</h1>
        <p className="mt-1 text-muted-foreground">Bagikan produk digital Anda ke ribuan pembeli</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Produk</CardTitle>
            <CardDescription>Detail dasar tentang produk Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nama Produk *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Contoh: UI Kit Modern Dashboard"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Jelaskan detail produk Anda, fitur-fitur yang disertakan, dan manfaatnya bagi pembeli..."
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value as ProductCategory }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Harga (IDR) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="299000"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thumbnail Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Thumbnail Produk</CardTitle>
            <CardDescription>Gambar cover yang menarik akan meningkatkan penjualan (opsional)</CardDescription>
          </CardHeader>
          <CardContent>
            {thumbnailPreview ? (
              <div className="relative">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="h-48 w-full rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => { setThumbnailFile(null); setThumbnailPreview(null) }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary hover:bg-primary/5">
                <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Klik untuk upload thumbnail</p>
                <p className="mt-1 text-xs text-muted-foreground">PNG, JPG hingga 5MB (Rekomendasi: 1200x900px)</p>
                <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
              </label>
            )}
          </CardContent>
        </Card>

        {/* Product File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>File Produk *</CardTitle>
            <CardDescription>Upload file produk digital yang akan dijual</CardDescription>
          </CardHeader>
          <CardContent>
            {productFile ? (
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{productFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(productFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => setProductFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary hover:bg-primary/5">
                <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Klik untuk upload file produk</p>
                <p className="mt-1 text-xs text-muted-foreground">ZIP, RAR, PDF, atau format lainnya hingga 500MB</p>
                <input type="file" className="hidden" onChange={handleProductFileChange} />
              </label>
            )}
          </CardContent>
        </Card>

        {/* Upload progress indicator */}
        {isSubmitting && uploadStep && (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            {uploadStep}
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Produk
              </>
            )}
          </Button>
        </div>
      </form>
    </main>
  )
}
