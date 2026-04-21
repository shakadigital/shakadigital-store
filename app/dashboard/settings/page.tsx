"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, Eye, EyeOff, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProtectedRoute } from "@/components/protected-route"
import { useStore } from "@/lib/store"
import { supabase } from "@/lib/db"

export default function AccountSettingsPage() {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const setUser = useStore((state) => state.setUser)

  const [name, setName] = useState(user?.name ?? "")
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar ?? "")
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setProfileMsg({ type: "error", text: "File harus berupa gambar (PNG, JPG, dll)" })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setProfileMsg({ type: "error", text: "Ukuran foto maksimal 2MB" })
      return
    }

    setIsUploadingAvatar(true)
    setProfileMsg(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id
      if (!userId) throw new Error("Tidak terautentikasi")

      const ext = file.name.split(".").pop()
      const filePath = `${userId}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true, cacheControl: "3600" })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath)
      const publicUrl = urlData.publicUrl + `?t=${Date.now()}` // bust cache

      // Simpan ke auth metadata
      await supabase.auth.updateUser({ data: { avatar: publicUrl } })

      setAvatarUrl(publicUrl)
      if (user) setUser({ ...user, avatar: publicUrl })
      setProfileMsg({ type: "success", text: "Foto profil berhasil diperbarui" })
    } catch (err: any) {
      console.error(err)
      setProfileMsg({ type: "error", text: err.message ?? "Gagal mengupload foto" })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) return
    setIsSavingProfile(true)
    setProfileMsg(null)

    const { error } = await supabase.auth.updateUser({ data: { name } })

    if (error) {
      setProfileMsg({ type: "error", text: error.message })
    } else {
      if (user) setUser({ ...user, name })
      setProfileMsg({ type: "success", text: "Profil berhasil diperbarui" })
    }
    setIsSavingProfile(false)
  }

  const handleChangePassword = async () => {
    setPasswordMsg(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: "error", text: "Mohon isi semua field password" })
      return
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "Password minimal 8 karakter" })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Konfirmasi password tidak cocok" })
      return
    }

    setIsSavingPassword(true)

    // Verifikasi password lama
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email ?? "",
      password: currentPassword,
    })

    if (signInError) {
      setPasswordMsg({ type: "error", text: "Password saat ini salah" })
      setIsSavingPassword(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setPasswordMsg({ type: "error", text: error.message })
    } else {
      setPasswordMsg({ type: "success", text: "Password berhasil diubah" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
    setIsSavingPassword(false)
  }

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>

        <h1 className="mb-6 text-2xl font-bold text-foreground">Pengaturan Akun</h1>

        {/* Profil */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
            <CardDescription>Perbarui foto dan nama tampilan akun Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl || "/placeholder-user.jpg"} alt={name} />
                  <AvatarFallback className="text-2xl">{name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50"
                >
                  {isUploadingAvatar
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Camera className="h-3.5 w-3.5" />
                  }
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div>
                <p className="font-medium text-foreground">{name || "Pengguna"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">PNG, JPG maks 2MB</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap Anda"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email ?? ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
            </div>

            {profileMsg && (
              <p className={`text-sm ${profileMsg.type === "success" ? "text-emerald-600" : "text-destructive"}`}>
                {profileMsg.text}
              </p>
            )}
            <Button onClick={handleSaveProfile} disabled={isSavingProfile} className="gap-2">
              {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Perubahan
            </Button>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Ganti Password */}
        <Card>
          <CardHeader>
            <CardTitle>Ganti Password</CardTitle>
            <CardDescription>Pastikan password baru minimal 8 karakter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Password Saat Ini</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Password Baru</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {passwordMsg && (
              <p className={`text-sm ${passwordMsg.type === "success" ? "text-emerald-600" : "text-destructive"}`}>
                {passwordMsg.text}
              </p>
            )}
            <Button onClick={handleChangePassword} disabled={isSavingPassword} variant="outline" className="gap-2">
              {isSavingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Ganti Password
            </Button>
          </CardContent>
        </Card>
      </main>
    </ProtectedRoute>
  )
}
