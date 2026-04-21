"use server"

import { supabaseAdmin } from "@/lib/db"
import type { DbVendor } from "@/lib/db-types"

export async function registerVendor({
  userId,
  name,
  bio,
  bankName,
  bankAccount,
  bankHolder,
}: {
  userId: string
  name: string
  bio?: string
  bankName?: string
  bankAccount?: string
  bankHolder?: string
}): Promise<{ success: boolean; vendorId?: string; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from("vendors")
      .insert({
        user_id: userId,
        name,
        bio: bio ?? null,
        bank_name: bankName ?? null,
        bank_account: bankAccount ?? null,
        bank_holder: bankHolder ?? null,
        total_products: 0,
        total_sales: 0,
        rating: 0,
      })
      .select("id")
      .single()

    if (error || !data) throw error

    return { success: true, vendorId: data.id }
  } catch (error) {
    console.error("Error registering vendor:", error)
    return { success: false, error: "Gagal mendaftarkan vendor" }
  }
}

export async function getVendors() {
  try {
    const { data, error } = await supabaseAdmin
      .from("vendors")
      .select("*")
      .order("total_sales", { ascending: false })

    if (error) throw error

    return { success: true, data: (data ?? []) as DbVendor[] }
  } catch (error) {
    console.error("Error fetching vendors:", error)
    return { success: false, error: "Failed to fetch vendors" }
  }
}

export async function getVendorById(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("vendors")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) {
      return { success: false, error: "Vendor not found" }
    }

    return { success: true, data: data as DbVendor }
  } catch (error) {
    console.error("Error fetching vendor:", error)
    return { success: false, error: "Failed to fetch vendor" }
  }
}

export async function getVendorStats(vendorId: string) {
  try {
    // Total revenue dari completed orders
    const { data: revenueData, error: revenueError } = await supabaseAdmin
      .from("order_items")
      .select("price, orders!inner(status)")
      .eq("vendor_id", vendorId)
      .eq("orders.status", "completed")

    if (revenueError) throw revenueError

    const totalRevenue = (revenueData ?? []).reduce(
      (sum: number, item: { price: number }) => sum + (item.price ?? 0),
      0,
    )

    // Monthly revenue (6 bulan terakhir)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const { data: monthlyData, error: monthlyError } = await supabaseAdmin
      .from("order_items")
      .select("price, orders!inner(status, created_at)")
      .eq("vendor_id", vendorId)
      .eq("orders.status", "completed")
      .gte("orders.created_at", sixMonthsAgo.toISOString())

    if (monthlyError) throw monthlyError

    // Group by month
    const monthMap: Record<string, number> = {}
    for (const item of monthlyData ?? []) {
      const date = new Date((item as any).orders.created_at)
      const month = date.toLocaleString("id-ID", { month: "short" })
      monthMap[month] = (monthMap[month] ?? 0) + item.price
    }
    const revenueByMonth = Object.entries(monthMap).map(([month, revenue]) => ({ month, revenue }))

    // Sales by category
    const { data: categoryData, error: categoryError } = await supabaseAdmin
      .from("order_items")
      .select("product_id, orders!inner(status), products!inner(category)")
      .eq("vendor_id", vendorId)
      .eq("orders.status", "completed")

    if (categoryError) throw categoryError

    const categoryMap: Record<string, number> = {}
    for (const item of categoryData ?? []) {
      const cat = (item as any).products?.category ?? "unknown"
      categoryMap[cat] = (categoryMap[cat] ?? 0) + 1
    }
    const salesByCategory = Object.entries(categoryMap).map(([category, sales]) => ({ category, sales }))

    return {
      success: true,
      data: { totalRevenue, revenueByMonth, salesByCategory },
    }
  } catch (error) {
    console.error("Error fetching vendor stats:", error)
    return { success: false, error: "Failed to fetch vendor stats" }
  }
}
