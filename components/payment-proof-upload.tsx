"use client"

import { useState, useRef } from "react"
import { Upload, FileText, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { validateFile } from "@/lib/validation"
import { supabase } from "@/lib/db"
import { uploadPaymentProof } from "@/lib/actions/orders"

/**
 * PaymentProofUpload Component
 * 
 * Allows users to upload payment proof files (JPG, PNG, PDF) for order verification.
 * Implements client-side validation, progress tracking, and error handling.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.9, 4.10
 * 
 * @param orderId - The order ID to associate the payment proof with
 * @param onUploadSuccess - Callback function called when upload succeeds
 */
interface PaymentProofUploadProps {
  orderId: string
  onUploadSuccess: () => void
}

export function PaymentProofUpload({ orderId, onUploadSuccess }: PaymentProofUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset previous states
    setUploadError(null)
    setUploadSuccess(false)

    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      setUploadError(validation.error || "File tidak valid")
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadError(null)
    setUploadProgress(0)

    try {
      // Generate unique filename with timestamp
      const timestamp = Date.now()
      const filename = `${timestamp}-${selectedFile.name}`
      const filePath = `${orderId}/${filename}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(filePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(filePath)

      const publicUrl = urlData.publicUrl

      // Update order with payment proof URL
      const result = await uploadPaymentProof(orderId, publicUrl)

      if (!result.success) {
        throw new Error(result.error || "Gagal memperbarui pesanan")
      }

      // Success
      setUploadProgress(100)
      setUploadSuccess(true)
      onUploadSuccess()
    } catch (error) {
      console.error("Upload error:", error)
      setUploadError(
        error instanceof Error ? error.message : "Upload gagal. Silakan coba lagi."
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setUploadError(null)
    setUploadSuccess(false)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // If upload was successful, show success message
  if (uploadSuccess) {
    return (
      <div className="rounded-lg border border-primary bg-primary/5 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Check className="h-6 w-6 text-primary" />
        </div>
        <p className="mb-1 text-sm font-medium text-foreground">
          Bukti pembayaran berhasil diupload
        </p>
        <p className="text-xs text-muted-foreground">
          Pesanan Anda sedang diverifikasi. Kami akan mengirimkan email konfirmasi setelah pembayaran
          diverifikasi.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* File Input Area */}
      <div
        className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          uploadError
            ? "border-destructive bg-destructive/5"
            : "border-muted-foreground/25 bg-muted/50 hover:border-muted-foreground/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="payment-proof-input"
          disabled={isUploading}
        />

        {!selectedFile ? (
          <label htmlFor="payment-proof-input" className="cursor-pointer">
            <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="mb-1 text-sm font-medium text-foreground">Pilih file bukti transfer</p>
            <p className="text-xs text-muted-foreground">JPG, PNG, atau PDF (max 5MB)</p>
          </label>
        ) : (
          <div className="space-y-2">
            <FileText className="mx-auto h-8 w-8 text-primary" />
            <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            {!isUploading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="mt-2 h-8 text-xs"
              >
                <X className="mr-1 h-3 w-3" />
                Ganti File
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {uploadError}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Mengupload... {uploadProgress}%
          </p>
        </div>
      )}

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="w-full"
        size="lg"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Mengupload...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Bukti Pembayaran
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        Upload bukti pembayaran diperlukan untuk verifikasi pesanan Anda.
      </p>
    </div>
  )
}
