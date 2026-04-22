"use server"

import { supabaseAdmin } from "@/lib/db"
import { createClient } from "@supabase/supabase-js"

// Server-side Supabase client with service role for storage operations
const supabaseStorage = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function uploadProductFile(
  file: FormData,
  vendorId: string,
  fileType: "product" | "thumbnail"
): Promise<{ success: boolean; url?: string; fileSize?: string; error?: string }> {
  try {
    const fileData = file.get("file") as File
    if (!fileData) return { success: false, error: "File tidak ditemukan" }

    const bucket = fileType === "thumbnail" ? "product-thumbnails" : "product-files"
    const timestamp = Date.now()
    const safeName = fileData.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const filePath = `${vendorId}/${timestamp}-${safeName}`

    const { error: uploadError } = await supabaseStorage.storage
      .from(bucket)
      .upload(filePath, fileData, { cacheControl: "3600", upsert: false })

    if (uploadError) throw uploadError

    const { data: urlData } = supabaseStorage.storage.from(bucket).getPublicUrl(filePath)

    const fileSizeMB = (fileData.size / (1024 * 1024)).toFixed(2) + " MB"

    return { success: true, url: urlData.publicUrl, fileSize: fileSizeMB }
  } catch (error) {
    console.error("Error uploading file:", error)
    return { success: false, error: "Gagal mengupload file. Silakan coba lagi." }
  }
}

export async function getVendorByUserId(
  userId: string
): Promise<{ success: boolean; vendorId?: string; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from("vendors")
      .select("id")
      .eq("user_id", userId)
      .single()

    if (error || !data) return { success: false, error: "Vendor tidak ditemukan" }

    return { success: true, vendorId: data.id }
  } catch (error) {
    console.error("Error fetching vendor:", error)
    return { success: false, error: "Gagal mengambil data vendor" }
  }
}

interface ProductInput {
  vendorId: string
  title: string
  description: string
  price: number
  category: "ebook" | "template" | "software"
  image?: string
  fileUrl?: string
  fileSize?: string
}

export async function createProduct(data: ProductInput) {
  try {
    const { data: result, error } = await supabaseAdmin
      .from("products")
      .insert({
        vendor_id: data.vendorId,
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        image: data.image ?? null,
        file_url: data.fileUrl ?? null,
        file_size: data.fileSize ?? null,
      })
      .select("id")
      .single()

    if (error || !result) throw error

    // Update jumlah produk vendor
    const { data: vendor } = await supabaseAdmin
      .from("vendors")
      .select("total_products")
      .eq("id", data.vendorId)
      .single()

    if (vendor) {
      await supabaseAdmin
        .from("vendors")
        .update({
          total_products: (vendor.total_products ?? 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.vendorId)
    }

    return { success: true, data: { productId: result.id } }
  } catch (error) {
    console.error("Error creating product:", error)
    return { success: false, error: "Failed to create product" }
  }
}

export async function updateProduct(productId: string, data: Partial<ProductInput>) {
  try {
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.price !== undefined) updateData.price = data.price
    if (data.category !== undefined) updateData.category = data.category
    if (data.image !== undefined) updateData.image = data.image
    if (data.fileUrl !== undefined) updateData.file_url = data.fileUrl
    if (data.fileSize !== undefined) updateData.file_size = data.fileSize

    const { error } = await supabaseAdmin
      .from("products")
      .update(updateData)
      .eq("id", productId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error updating product:", error)
    return { success: false, error: "Failed to update product" }
  }
}

export async function deleteProduct(productId: string, vendorId: string) {
  try {
    const { error } = await supabaseAdmin
      .from("products")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", productId)
      .eq("vendor_id", vendorId)

    if (error) throw error

    // Kurangi jumlah produk vendor
    const { data: vendor } = await supabaseAdmin
      .from("vendors")
      .select("total_products")
      .eq("id", vendorId)
      .single()

    if (vendor) {
      await supabaseAdmin
        .from("vendors")
        .update({
          total_products: Math.max(0, (vendor.total_products ?? 1) - 1),
          updated_at: new Date().toISOString(),
        })
        .eq("id", vendorId)
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: "Failed to delete product" }
  }
}
