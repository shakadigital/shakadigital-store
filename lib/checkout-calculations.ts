import type { CartItem } from "./types"

/**
 * Calculate subtotal from cart items
 * Subtotal is the sum of all item prices (price * quantity)
 * 
 * @param items - Array of cart items
 * @returns Subtotal in Rupiah (integer)
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
}

/**
 * Calculate service fee (5% of subtotal, rounded to nearest integer)
 * Uses Math.round() for rounding as per requirement 6.3
 * 
 * @param subtotal - Subtotal amount in Rupiah
 * @returns Service fee in Rupiah (integer)
 */
export function calculateServiceFee(subtotal: number): number {
  return Math.round(subtotal * 0.05)
}

/**
 * Calculate grand total (subtotal + service fee)
 * 
 * @param subtotal - Subtotal amount in Rupiah
 * @param serviceFee - Service fee amount in Rupiah
 * @returns Grand total in Rupiah (integer)
 */
export function calculateGrandTotal(subtotal: number, serviceFee: number): number {
  return subtotal + serviceFee
}

/**
 * Memoized calculation of order summary
 * Optimizes performance by caching results based on cart items
 * 
 * @param items - Array of cart items
 * @returns Object containing subtotal, serviceFee, and grandTotal
 */
export function calculateOrderSummary(items: CartItem[]): {
  subtotal: number
  serviceFee: number
  grandTotal: number
} {
  const subtotal = calculateSubtotal(items)
  const serviceFee = calculateServiceFee(subtotal)
  const grandTotal = calculateGrandTotal(subtotal, serviceFee)

  return {
    subtotal,
    serviceFee,
    grandTotal,
  }
}

// Memoization cache for order summary calculations
const orderSummaryCache = new Map<string, ReturnType<typeof calculateOrderSummary>>()

/**
 * Generate cache key from cart items
 * Uses product IDs and quantities to create a unique key
 */
function generateCacheKey(items: CartItem[]): string {
  return items
    .map((item) => `${item.product.id}:${item.quantity}`)
    .sort()
    .join("|")
}

/**
 * Memoized version of calculateOrderSummary
 * Caches results to avoid redundant calculations
 * 
 * @param items - Array of cart items
 * @returns Object containing subtotal, serviceFee, and grandTotal
 */
export function calculateOrderSummaryMemoized(items: CartItem[]): {
  subtotal: number
  serviceFee: number
  grandTotal: number
} {
  const cacheKey = generateCacheKey(items)
  
  // Check if result is already cached
  const cached = orderSummaryCache.get(cacheKey)
  if (cached) {
    return cached
  }

  // Calculate and cache the result
  const result = calculateOrderSummary(items)
  orderSummaryCache.set(cacheKey, result)

  // Limit cache size to prevent memory leaks
  if (orderSummaryCache.size > 100) {
    const firstKey = orderSummaryCache.keys().next().value
    orderSummaryCache.delete(firstKey)
  }

  return result
}

/**
 * Clear the memoization cache
 * Useful for testing or when you want to force recalculation
 */
export function clearOrderSummaryCache(): void {
  orderSummaryCache.clear()
}
