"use server"

import { supabaseAdmin } from "@/lib/db"
import type { DbOrder, DbOrderItem } from "@/lib/db-types"

interface CartItem {
  product: {
    id: string
    title: string
    price: number
    vendorId?: string
    vendor_id?: string
  }
  quantity: number
}

export async function createOrder(data: {
  userEmail: string
  userName: string
  userId?: string
  items: CartItem[]
  totalAmount: number
  notes?: string
}) {
  try {
    // Buat order
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: data.userId ?? null,
        user_email: data.userEmail,
        user_name: data.userName,
        total_amount: data.totalAmount,
        notes: data.notes ?? null,
        status: "pending",
      })
      .select("id")
      .single()

    if (orderError || !orderData) throw orderError

    const orderId = orderData.id

    // Buat order items
    const orderItems = data.items.map((item) => ({
      order_id: orderId,
      product_id: item.product.id,
      vendor_id: item.product.vendorId ?? item.product.vendor_id ?? null,
      product_title: item.product.title,
      price: item.product.price,
    }))

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems)
    if (itemsError) throw itemsError

    return { success: true, data: { orderId } }
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, error: "Failed to create order" }
  }
}

export async function getOrdersByUser(userEmail: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_email", userEmail)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data: (data ?? []) as (DbOrder & { items: DbOrderItem[] })[] }
  } catch (error) {
    console.error("Error fetching orders:", error)
    return { success: false, error: "Failed to fetch orders" }
  }
}

export async function getOrdersByVendor(vendorId: string) {
  try {
    const { data: itemData, error: itemError } = await supabaseAdmin
      .from("order_items")
      .select("order_id")
      .eq("vendor_id", vendorId)

    if (itemError) throw itemError

    const orderIds = [...new Set((itemData ?? []).map((i: { order_id: string }) => i.order_id))]

    if (orderIds.length === 0) return { success: true, data: [] }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .in("id", orderIds)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, data: (data ?? []) as (DbOrder & { items: DbOrderItem[] })[] }
  } catch (error) {
    console.error("Error fetching vendor orders:", error)
    return { success: false, error: "Failed to fetch orders" }
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId)

    if (error) throw error

    // Jika completed, tambah download count
    if (status === "completed") {
      const { data: items } = await supabaseAdmin
        .from("order_items")
        .select("product_id")
        .eq("order_id", orderId)

      for (const item of items ?? []) {
        if (!item.product_id) continue
        const { data: product } = await supabaseAdmin
          .from("products")
          .select("downloads")
          .eq("id", item.product_id)
          .single()

        if (product) {
          await supabaseAdmin
            .from("products")
            .update({ downloads: (product.downloads ?? 0) + 1 })
            .eq("id", item.product_id)
        }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating order:", error)
    return { success: false, error: "Failed to update order" }
  }
}

export async function uploadPaymentProof(orderId: string, proofUrl: string) {
  try {
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ payment_proof: proofUrl, updated_at: new Date().toISOString() })
      .eq("id", orderId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error uploading payment proof:", error)
    return { success: false, error: "Failed to upload payment proof" }
  }
}

export async function getOrderById(orderId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single()

    if (error) throw error

    if (!data) {
      return { success: false, error: "Order not found" }
    }

    return { success: true, data: data as DbOrder & { order_items: DbOrderItem[] } }
  } catch (error) {
    console.error("Error fetching order:", error)
    return { success: false, error: "Failed to fetch order" }
  }
}
