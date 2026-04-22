export type ProductCategory = "ebook" | "template" | "software"

export interface Product {
  id: string
  title: string
  description: string
  price: number
  category: ProductCategory
  image: string
  vendorId: string
  vendorName: string
  downloads: number
  rating: number
  createdAt: string
  fileUrl?: string
  fileSize?: string
}

export interface Vendor {
  id: string
  name: string
  avatar: string
  bio: string
  totalProducts: number
  totalSales: number
  rating: number
  joinedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: "buyer" | "vendor" | "admin"
  purchases: Purchase[]
}

export interface Purchase {
  id: string
  productId: string
  productTitle: string
  price: number
  status: "pending" | "confirmed" | "completed"
  paymentProof?: string
  purchasedAt: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface AnalyticsData {
  totalRevenue: number
  totalSales: number
  totalProducts: number
  totalViews: number
  revenueByMonth: { month: string; revenue: number }[]
  salesByCategory: { category: string; sales: number }[]
}

// Checkout Flow Types
export interface ValidationErrors {
  name?: string
  email?: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface BankAccount {
  bank: string
  number: string
  name: string
}
