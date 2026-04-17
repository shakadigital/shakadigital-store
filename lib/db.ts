import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client (anon key) - untuk auth dan client operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (service role key — hanya dipakai di server actions)
export const supabaseAdmin = typeof window === "undefined" 
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  : supabase

// Helper function to format price in Rupiah
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
