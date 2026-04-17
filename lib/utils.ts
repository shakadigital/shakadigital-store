import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ProductCategory } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function getCategoryLabel(category: ProductCategory): string {
  const labels: Record<ProductCategory, string> = {
    ebook: "E-Book",
    template: "Template",
    software: "Software",
    course: "Kursus",
  }
  return labels[category]
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString))
}

export function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
}
