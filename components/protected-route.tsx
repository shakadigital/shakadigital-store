"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireRole?: "buyer" | "vendor" | "admin"
}

export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const router = useRouter()
  const user = useStore((state) => state.user)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (requireRole && user.role !== requireRole) {
      router.push("/dashboard")
    }
  }, [user, requireRole, router])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Memuat...</p>
        </div>
      </div>
    )
  }

  if (requireRole && user.role !== requireRole) {
    return null
  }

  return <>{children}</>
}
