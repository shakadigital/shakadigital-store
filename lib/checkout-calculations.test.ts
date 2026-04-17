import { describe, it, expect, beforeEach } from "vitest"
import type { CartItem } from "./types"
import {
  calculateSubtotal,
  calculateServiceFee,
  calculateGrandTotal,
  calculateOrderSummary,
  calculateOrderSummaryMemoized,
  clearOrderSummaryCache,
} from "./checkout-calculations"

// Helper function to create mock cart items
function createMockCartItem(id: string, price: number, quantity: number = 1): CartItem {
  return {
    product: {
      id,
      title: `Product ${id}`,
      description: "Test product",
      price,
      category: "ebook",
      image: "/test.jpg",
      vendorId: "vendor-1",
      vendorName: "Test Vendor",
      downloads: 0,
      rating: 5,
      createdAt: new Date().toISOString(),
    },
    quantity,
  }
}

describe("Checkout Calculations", () => {
  describe("calculateSubtotal", () => {
    it("should return 0 for empty cart", () => {
      expect(calculateSubtotal([])).toBe(0)
    })

    it("should calculate subtotal for single item", () => {
      const items = [createMockCartItem("1", 100000)]
      expect(calculateSubtotal(items)).toBe(100000)
    })

    it("should calculate subtotal for multiple items", () => {
      const items = [
        createMockCartItem("1", 100000),
        createMockCartItem("2", 50000),
        createMockCartItem("3", 75000),
      ]
      expect(calculateSubtotal(items)).toBe(225000)
    })

    it("should handle quantity correctly", () => {
      const items = [createMockCartItem("1", 100000, 3)]
      expect(calculateSubtotal(items)).toBe(300000)
    })

    it("should handle mixed quantities", () => {
      const items = [
        createMockCartItem("1", 100000, 2),
        createMockCartItem("2", 50000, 1),
        createMockCartItem("3", 75000, 3),
      ]
      expect(calculateSubtotal(items)).toBe(475000)
    })
  })

  describe("calculateServiceFee", () => {
    it("should return 0 for 0 subtotal", () => {
      expect(calculateServiceFee(0)).toBe(0)
    })

    it("should calculate 5% service fee with rounding", () => {
      expect(calculateServiceFee(100000)).toBe(5000)
    })

    it("should round up when decimal is >= 0.5", () => {
      // 100001 * 0.05 = 5000.05 -> rounds to 5000
      expect(calculateServiceFee(100001)).toBe(5000)
      // 100011 * 0.05 = 5000.55 -> rounds to 5001
      expect(calculateServiceFee(100011)).toBe(5001)
    })

    it("should round down when decimal is < 0.5", () => {
      // 100009 * 0.05 = 5000.45 -> rounds to 5000
      expect(calculateServiceFee(100009)).toBe(5000)
    })

    it("should handle large amounts", () => {
      expect(calculateServiceFee(10000000)).toBe(500000)
    })

    it("should handle small amounts", () => {
      expect(calculateServiceFee(1000)).toBe(50)
    })
  })

  describe("calculateGrandTotal", () => {
    it("should return 0 when both inputs are 0", () => {
      expect(calculateGrandTotal(0, 0)).toBe(0)
    })

    it("should add subtotal and service fee correctly", () => {
      expect(calculateGrandTotal(100000, 5000)).toBe(105000)
    })

    it("should handle large amounts", () => {
      expect(calculateGrandTotal(10000000, 500000)).toBe(10500000)
    })

    it("should handle when service fee is 0", () => {
      expect(calculateGrandTotal(100000, 0)).toBe(100000)
    })
  })

  describe("calculateOrderSummary", () => {
    it("should return all zeros for empty cart", () => {
      const result = calculateOrderSummary([])
      expect(result).toEqual({
        subtotal: 0,
        serviceFee: 0,
        grandTotal: 0,
      })
    })

    it("should calculate complete order summary for single item", () => {
      const items = [createMockCartItem("1", 100000)]
      const result = calculateOrderSummary(items)
      expect(result).toEqual({
        subtotal: 100000,
        serviceFee: 5000,
        grandTotal: 105000,
      })
    })

    it("should calculate complete order summary for multiple items", () => {
      const items = [
        createMockCartItem("1", 100000),
        createMockCartItem("2", 50000),
        createMockCartItem("3", 75000),
      ]
      const result = calculateOrderSummary(items)
      expect(result).toEqual({
        subtotal: 225000,
        serviceFee: 11250,
        grandTotal: 236250,
      })
    })

    it("should handle quantities correctly", () => {
      const items = [
        createMockCartItem("1", 100000, 2),
        createMockCartItem("2", 50000, 3),
      ]
      const result = calculateOrderSummary(items)
      expect(result).toEqual({
        subtotal: 350000,
        serviceFee: 17500,
        grandTotal: 367500,
      })
    })
  })

  describe("calculateOrderSummaryMemoized", () => {
    beforeEach(() => {
      clearOrderSummaryCache()
    })

    it("should return same result as non-memoized version", () => {
      const items = [createMockCartItem("1", 100000)]
      const result1 = calculateOrderSummary(items)
      const result2 = calculateOrderSummaryMemoized(items)
      expect(result2).toEqual(result1)
    })

    it("should return cached result for same cart", () => {
      const items = [createMockCartItem("1", 100000)]
      const result1 = calculateOrderSummaryMemoized(items)
      const result2 = calculateOrderSummaryMemoized(items)
      
      // Results should be the same object (cached)
      expect(result2).toBe(result1)
    })

    it("should recalculate when cart changes", () => {
      const items1 = [createMockCartItem("1", 100000)]
      const items2 = [createMockCartItem("1", 100000), createMockCartItem("2", 50000)]
      
      const result1 = calculateOrderSummaryMemoized(items1)
      const result2 = calculateOrderSummaryMemoized(items2)
      
      expect(result1).not.toEqual(result2)
      expect(result1.subtotal).toBe(100000)
      expect(result2.subtotal).toBe(150000)
    })

    it("should handle cart with different order of items", () => {
      const items1 = [
        createMockCartItem("1", 100000),
        createMockCartItem("2", 50000),
      ]
      const items2 = [
        createMockCartItem("2", 50000),
        createMockCartItem("1", 100000),
      ]
      
      const result1 = calculateOrderSummaryMemoized(items1)
      const result2 = calculateOrderSummaryMemoized(items2)
      
      // Should return cached result since items are the same (order doesn't matter)
      expect(result2).toBe(result1)
    })

    it("should clear cache when clearOrderSummaryCache is called", () => {
      const items = [createMockCartItem("1", 100000)]
      const result1 = calculateOrderSummaryMemoized(items)
      
      clearOrderSummaryCache()
      
      const result2 = calculateOrderSummaryMemoized(items)
      
      // Results should be equal but not the same object
      expect(result2).toEqual(result1)
      expect(result2).not.toBe(result1)
    })
  })

  describe("Edge Cases", () => {
    it("should handle very large cart", () => {
      const items = Array.from({ length: 100 }, (_, i) => 
        createMockCartItem(`${i}`, 10000)
      )
      const result = calculateOrderSummary(items)
      expect(result.subtotal).toBe(1000000)
      expect(result.serviceFee).toBe(50000)
      expect(result.grandTotal).toBe(1050000)
    })

    it("should handle cart with zero-price items", () => {
      const items = [
        createMockCartItem("1", 0),
        createMockCartItem("2", 100000),
      ]
      const result = calculateOrderSummary(items)
      expect(result.subtotal).toBe(100000)
      expect(result.serviceFee).toBe(5000)
      expect(result.grandTotal).toBe(105000)
    })

    it("should handle rounding edge case (exactly 0.5)", () => {
      // Find a subtotal that results in exactly 0.5 decimal
      // 10 * 0.05 = 0.5 -> rounds to 0
      expect(calculateServiceFee(10)).toBe(1) // Math.round(0.5) = 1
    })
  })
})
