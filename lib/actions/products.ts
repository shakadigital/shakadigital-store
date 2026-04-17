"use server"

import { supabaseAdmin } from "@/lib/db"
import type { DbProduct } from "@/lib/db-types"

export async function getProducts(options?: {
  category?: string
  search?: string
  sortBy?: string
  limit?: number
}) {
  try {
    let query = supabaseAdmin
      .from("products")
      .select("*, vendors(name, avatar)")
      .eq("is_active", true)

    if (options?.category && options.category !== "all") {
      query = query.eq("category", options.category)
    }

    if (options?.search) {
      query = query.or(
        `title.ilike.%${options.search}%,description.ilike.%${options.search}%`,
      )
    }

    if (options?.sortBy === "price-low") {
      query = query.order("price", { ascending: true })
    } else if (options?.sortBy === "price-high") {
      query = query.order("price", { ascending: false })
    } else if (options?.sortBy === "popular") {
      query = query.order("downloads", { ascending: false })
    } else {
      query = query.order("created_at", { ascending: false })
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) throw error

    // Flatten joined vendor fields
    const products = (data ?? []).map((p: any) => ({
      ...p,
      vendor_name: p.vendors?.name ?? null,
      vendor_avatar: p.vendors?.avatar ?? null,
      vendors: undefined,
    })) as DbProduct[]

    return { success: true, data: products }
  } catch (error) {
    console.error("Error fetching products:", error)
    return { success: false, error: "Failed to fetch products" }
  }
}

export async function getProductById(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*, vendors(name, avatar, bio, total_products, total_sales, rating)")
      .eq("id", id)
      .single()

    if (error || !data) {
      return { success: false, error: "Product not found" }
    }

    const product = {
      ...data,
      vendor_name: data.vendors?.name ?? null,
      vendor_avatar: data.vendors?.avatar ?? null,
      vendor_bio: data.vendors?.bio ?? null,
      vendor_total_products: data.vendors?.total_products ?? 0,
      vendor_total_sales: data.vendors?.total_sales ?? 0,
      vendor_rating: data.vendors?.rating ?? 0,
      vendors: undefined,
    }

    return { success: true, data: product }
  } catch (error) {
    console.error("Error fetching product:", error)
    return { success: false, error: "Failed to fetch product" }
  }
}

export async function getProductsByVendor(vendorId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*, vendors(name)")
      .eq("vendor_id", vendorId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) throw error

    const products = (data ?? []).map((p: any) => ({
      ...p,
      vendor_name: p.vendors?.name ?? null,
      vendors: undefined,
    })) as DbProduct[]

    return { success: true, data: products }
  } catch (error) {
    console.error("Error fetching vendor products:", error)
    return { success: false, error: "Failed to fetch products" }
  }
}

export async function getRelatedProducts(productId: string, category: string, limit = 4) {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*, vendors(name)")
      .eq("category", category)
      .neq("id", productId)
      .eq("is_active", true)
      .order("downloads", { ascending: false })
      .limit(limit)

    if (error) throw error

    const products = (data ?? []).map((p: any) => ({
      ...p,
      vendor_name: p.vendors?.name ?? null,
      vendors: undefined,
    })) as DbProduct[]

    return { success: true, data: products }
  } catch (error) {
    console.error("Error fetching related products:", error)
    return { success: false, error: "Failed to fetch related products" }
  }
}

export async function getFeaturedProducts(limit = 4) {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*, vendors(name)")
      .eq("is_active", true)
      .order("rating", { ascending: false })
      .order("downloads", { ascending: false })
      .limit(limit)

    if (error) throw error

    const products = (data ?? []).map((p: any) => ({
      ...p,
      vendor_name: p.vendors?.name ?? null,
      vendors: undefined,
    })) as DbProduct[]

    return { success: true, data: products }
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return { success: false, error: "Failed to fetch featured products" }
  }
}

export async function getPopularProducts(limit = 4) {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*, vendors(name)")
      .eq("is_active", true)
      .order("downloads", { ascending: false })
      .limit(limit)

    if (error) throw error

    const products = (data ?? []).map((p: any) => ({
      ...p,
      vendor_name: p.vendors?.name ?? null,
      vendors: undefined,
    })) as DbProduct[]

    return { success: true, data: products }
  } catch (error) {
    console.error("Error fetching popular products:", error)
    return { success: false, error: "Failed to fetch popular products" }
  }
}
