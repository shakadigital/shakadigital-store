import { describe, it, expect, beforeEach } from "vitest"
import type { CartItem } from "./types"
import { calculateOrderSummaryMemoized, clearOrderSummaryCache } from "./checkout-calculations"

/**
 * Integration tests to verify checkout calculations work correctly
 * with realistic cart scenarios
 */
describe("Checkout Integration Tests", () => {
  beforeEach(() => {
    // Clear cache before each test to ensure isolation
    clearOrderSummaryCache()
  })

  it("should calculate order summary for typical single product purchase", () => {
    const cart: CartItem[] = [
      {
        product: {
          id: "prod-1",
          title: "Digital Marketing eBook",
          description: "Complete guide to digital marketing",
          price: 150000,
          category: "ebook",
          image: "/ebook.jpg",
          vendorId: "vendor-1",
          vendorName: "Marketing Pro",
          downloads: 100,
          rating: 4.5,
          createdAt: "2024-01-01T00:00:00Z",
        },
        quantity: 1,
      },
    ]

    const result = calculateOrderSummaryMemoized(cart)

    expect(result.subtotal).toBe(150000)
    expect(result.serviceFee).toBe(7500) // 5% of 150000
    expect(result.grandTotal).toBe(157500)
  })

  it("should calculate order summary for multiple products purchase", () => {
    const cart: CartItem[] = [
      {
        product: {
          id: "prod-1",
          title: "React Course",
          description: "Learn React from scratch",
          price: 500000,
          category: "course",
          image: "/course.jpg",
          vendorId: "vendor-1",
          vendorName: "Code Academy",
          downloads: 50,
          rating: 5,
          createdAt: "2024-01-01T00:00:00Z",
        },
        quantity: 1,
      },
      {
        product: {
          id: "prod-2",
          title: "UI Design Template",
          description: "Modern UI templates",
          price: 250000,
          category: "template",
          image: "/template.jpg",
          vendorId: "vendor-2",
          vendorName: "Design Studio",
          downloads: 200,
          rating: 4.8,
          createdAt: "2024-01-01T00:00:00Z",
        },
        quantity: 1,
      },
      {
        product: {
          id: "prod-3",
          title: "SEO Tools Software",
          description: "SEO optimization tools",
          price: 350000,
          category: "software",
          image: "/software.jpg",
          vendorId: "vendor-3",
          vendorName: "SEO Masters",
          downloads: 75,
          rating: 4.7,
          createdAt: "2024-01-01T00:00:00Z",
        },
        quantity: 1,
      },
    ]

    const result = calculateOrderSummaryMemoized(cart)

    expect(result.subtotal).toBe(1100000) // 500000 + 250000 + 350000
    expect(result.serviceFee).toBe(55000) // 5% of 1100000
    expect(result.grandTotal).toBe(1155000)
  })

  it("should handle service fee rounding correctly for edge case amounts", () => {
    const cart: CartItem[] = [
      {
        product: {
          id: "prod-1",
          title: "Test Product",
          description: "Test",
          price: 123456, // 5% = 6172.8 -> should round to 6173
          category: "ebook",
          image: "/test.jpg",
          vendorId: "vendor-1",
          vendorName: "Test Vendor",
          downloads: 0,
          rating: 5,
          createdAt: "2024-01-01T00:00:00Z",
        },
        quantity: 1,
      },
    ]

    const result = calculateOrderSummaryMemoized(cart)

    expect(result.subtotal).toBe(123456)
    expect(result.serviceFee).toBe(6173) // Math.round(123456 * 0.05) = Math.round(6172.8) = 6173
    expect(result.grandTotal).toBe(129629)
  })

  it("should calculate correctly for high-value purchases", () => {
    const cart: CartItem[] = [
      {
        product: {
          id: "prod-1",
          title: "Premium Software Package",
          description: "Enterprise software solution",
          price: 5000000,
          category: "software",
          image: "/software.jpg",
          vendorId: "vendor-1",
          vendorName: "Enterprise Solutions",
          downloads: 10,
          rating: 5,
          createdAt: "2024-01-01T00:00:00Z",
        },
        quantity: 1,
      },
    ]

    const result = calculateOrderSummaryMemoized(cart)

    expect(result.subtotal).toBe(5000000)
    expect(result.serviceFee).toBe(250000) // 5% of 5000000
    expect(result.grandTotal).toBe(5250000)
  })

  it("should maintain consistency across multiple calculations of same cart", () => {
    const cart: CartItem[] = [
      {
        product: {
          id: "prod-1",
          title: "Test Product",
          description: "Test",
          price: 100000,
          category: "ebook",
          image: "/test.jpg",
          vendorId: "vendor-1",
          vendorName: "Test Vendor",
          downloads: 0,
          rating: 5,
          createdAt: "2024-01-01T00:00:00Z",
        },
        quantity: 1,
      },
    ]

    // Calculate multiple times
    const result1 = calculateOrderSummaryMemoized(cart)
    const result2 = calculateOrderSummaryMemoized(cart)
    const result3 = calculateOrderSummaryMemoized(cart)

    // All results should be identical (and cached)
    expect(result2).toBe(result1)
    expect(result3).toBe(result1)
    expect(result1.grandTotal).toBe(105000)
  })

  it("should handle realistic mixed cart with various price points", () => {
    const cart: CartItem[] = [
      {
        product: {
          id: "prod-1",
          title: "Cheap eBook",
          description: "Budget friendly",
          price: 25000,
          category: "ebook",
          image: "/ebook.jpg",
          vendorId: "vendor-1",
          vendorName: "Budget Books",
          downloads: 500,
          rating: 4.2,
          createdAt: "2024-01-01T00:00:00Z",
        },
        quantity: 1,
      },
      {
        product: {
          id: "prod-2",
          title: "Mid-range Template",
          description: "Quality templates",
          price: 175000,
          category: "template",
          image: "/template.jpg",
          vendorId: "vendor-2",
          vendorName: "Template Pro",
          downloads: 150,
          rating: 4.6,
          createdAt: "2024-01-01T00:00:00Z",
        },
        quantity: 1,
      },
      {
        product: {
          id: "prod-3",
          title: "Premium Course",
          description: "Advanced training",
          price: 750000,
          category: "course",
          image: "/course.jpg",
          vendorId: "vendor-3",
          vendorName: "Expert Academy",
          downloads: 25,
          rating: 4.9,
          createdAt: "2024-01-01T00:00:00Z",
        },
        quantity: 1,
      },
    ]

    const result = calculateOrderSummaryMemoized(cart)

    expect(result.subtotal).toBe(950000) // 25000 + 175000 + 750000
    expect(result.serviceFee).toBe(47500) // 5% of 950000
    expect(result.grandTotal).toBe(997500)
  })
})
