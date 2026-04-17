"use server"

import { supabaseAdmin } from "@/lib/db"

export async function getHomeStats() {
  try {
    const [productRes, vendorRes, downloadsRes] = await Promise.all([
      supabaseAdmin.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabaseAdmin.from("vendors").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("products").select("downloads").eq("is_active", true),
    ])

    if (productRes.error) throw productRes.error
    if (vendorRes.error) throw vendorRes.error
    if (downloadsRes.error) throw downloadsRes.error

    const totalDownloads = (downloadsRes.data ?? []).reduce(
      (sum: number, p: { downloads: number }) => sum + (p.downloads ?? 0),
      0,
    )

    return {
      success: true,
      data: {
        totalProducts: productRes.count ?? 0,
        totalVendors: vendorRes.count ?? 0,
        totalDownloads,
      },
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return { success: false, error: "Failed to fetch stats" }
  }
}

export async function getCategoryStats() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("category")
      .eq("is_active", true)

    if (error) throw error

    // Group by category manually
    const counts: Record<string, number> = {}
    for (const row of data ?? []) {
      counts[row.category] = (counts[row.category] ?? 0) + 1
    }

    const stats = Object.entries(counts).map(([category, count]) => ({
      category,
      count: String(count),
    }))

    return { success: true, data: stats }
  } catch (error) {
    console.error("Error fetching category stats:", error)
    return { success: false, error: "Failed to fetch category stats" }
  }
}
