"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Product, Purchase, User } from "./types"

interface StoreState {
  cart: CartItem[]
  user: User | null
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  getCartTotal: () => number
  setUser: (user: User | null) => void
  addPurchase: (purchase: Purchase) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      user: null,
      addToCart: (product) => {
        const cart = get().cart
        const existingItem = cart.find((item) => item.product.id === product.id)
        if (existingItem) {
          return
        }
        set({ cart: [...cart, { product, quantity: 1 }] })
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.product.id !== productId) })
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
      },
      setUser: (user) => set({ user }),
      addPurchase: (purchase) => {
        const user = get().user
        if (user) {
          set({
            user: {
              ...user,
              purchases: [...user.purchases, purchase],
            },
          })
        }
      },
    }),
    {
      name: "shaka-store",
    },
  ),
)
