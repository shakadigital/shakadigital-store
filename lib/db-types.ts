// Database types for Neon PostgreSQL

export interface DbVendor {
  id: string
  user_id: string | null // UUID
  name: string
  avatar: string | null
  bio: string | null
  total_products: number
  total_sales: number
  rating: number
  bank_name: string | null
  bank_account: string | null
  bank_holder: string | null
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface DbProduct {
  id: string
  vendor_id: string
  title: string
  description: string | null
  price: number
  category: "ebook" | "template" | "software"
  image: string | null
  file_url: string | null
  file_size: string | null
  downloads: number
  rating: number
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined fields
  vendor_name?: string
  vendor_avatar?: string
}

export interface DbOrder {
  id: string
  user_id: string | null
  user_email: string
  user_name: string | null
  total_amount: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  payment_proof: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface DbOrderItem {
  id: string
  order_id: string
  product_id: string | null
  vendor_id: string | null
  product_title: string
  price: number
  created_at: string
}

export interface DbReview {
  id: string
  product_id: string
  user_id: string | null
  user_name: string | null
  rating: number
  comment: string | null
  created_at: string
}
