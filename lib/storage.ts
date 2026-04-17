/**
 * Supabase Storage utilities for payment proof uploads
 * Requirements: 4.5, 4.6, 4.7
 */

import { supabase } from "@/lib/db"

export interface UploadResult {
  success: boolean
  publicUrl?: string
  error?: string
}

/**
 * Upload payment proof file to Supabase Storage
 * @param orderId - The order ID to associate the file with
 * @param file - The file to upload
 * @returns Upload result with public URL or error
 */
export async function uploadPaymentProofFile(
  orderId: string,
  file: File
): Promise<UploadResult> {
  try {
    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    const filePath = `${orderId}/${filename}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("payment-proofs")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (error) {
      console.error("Storage upload error:", error)
      return { success: false, error: "Upload gagal. Silakan coba lagi." }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(filePath)

    return { success: true, publicUrl: urlData.publicUrl }
  } catch (error) {
    console.error("Unexpected upload error:", error)
    return { success: false, error: "Upload gagal. Silakan coba lagi." }
  }
}
