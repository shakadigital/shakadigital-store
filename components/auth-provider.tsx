"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { supabase } from "@/lib/db"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useStore((state) => state.setUser)

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || "User",
          avatar: session.user.user_metadata?.avatar || "/placeholder-user.jpg",
          role: session.user.user_metadata?.role || "buyer",
          purchases: [],
        })
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || "User",
          avatar: session.user.user_metadata?.avatar || "/placeholder-user.jpg",
          role: session.user.user_metadata?.role || "buyer",
          purchases: [],
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return <>{children}</>
}
