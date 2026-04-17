import { supabase } from "@/lib/db"

export interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    name?: string
    role?: string
  }
}

export async function signUp(email: string, password: string, name: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    if (!data.user) {
      return {
        success: false,
        message: "Gagal membuat akun",
      }
    }

    return {
      success: true,
      message: "Akun berhasil dibuat! Silakan cek email untuk verifikasi.",
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan saat mendaftar",
    }
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        message: "Email atau password salah",
      }
    }

    if (!data.user) {
      return {
        success: false,
        message: "Gagal masuk",
      }
    }

    return {
      success: true,
      message: "Berhasil masuk!",
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
        role: data.user.user_metadata?.role || "buyer",
      },
    }
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan saat masuk",
    }
  }
}

export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: true,
      message: "Berhasil keluar",
    }
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan saat keluar",
    }
  }
}

export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name,
      role: user.user_metadata?.role || "buyer",
      avatar: user.user_metadata?.avatar || "/placeholder-user.jpg",
    }
  } catch (error) {
    return null
  }
}
