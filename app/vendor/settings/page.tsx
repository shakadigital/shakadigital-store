"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProtectedRoute } from "@/components/protected-route"
import { supabase } from "@/lib/db"
import { getVendorByUserId } from "@/lib/actions/upload-product"
import { supabaseAdmin } from "@/lib/db"

export default function VendorSettingsPage() {
  const router = useRouter()
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [vendorId, setVendorId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [avatarKey, setAvatarKey] = useState(Date.now())
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.id) { setLoading(false); return }

      const vendorRes = await getVendorByUserId(session.user.id)
      if (!vendorRes.success || !vendorRes.vendorId) { setLoading(false); return }

      const { data } = await supabase
        .from("vendors")
        .select("id, name, bio, avatar")
        .eq("id", vendorRes.vendorId)
        .single()

      if (data) {
        setVendorId(data.id)
        setName(data.name ?? "")
        setBio(data.bio ?? "")
        setAvatarUrl(data.avatar ?? "")
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !vendorId) return

    if (!file.type.startsWith("image/")) {
      setMsg({ type: "error", text: "File harus berupa gambar" })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setMsg({ type: "error", text: "Ukuran foto maksimal 2MB" })
      return
    }

    setIsUploadingAvatar(true)
    setMsg(null)

    try {
      const ext = file.name.split(".").pop()
      const filePath = `vendor-${vendorId}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true, cacheControl: "3600" })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath)
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`

      // Update tabel vendors
      const { error: updateError } = await supabase
        .from("vendors")
        .update({ avatar: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", vendorId)

      if (updateError) throw updateError

      setAvatarUrl(publicUrl)
      setAvatarKey(Date.now())
      setMsg({ type: "success", text: "Foto profil toko berhasil diperbarui" })
    } catch (err: any) {
      setMsg({ type: "error", text: err.message ?? "Gagal mengupload foto" })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleSave = async () => {
    if (!vendorId || !name.trim()) return
    setIsSaving(true)
    setMsg(null)

    const { error } = await supabase
      .from("vendors")
      .update({ name, bio, updated_at: new Date().toISOString() })
      .eq("id", vendorId)

    if (error) {
      setMsg({ type: "error", text: error.message })
    } else {
      setMsg({ type: "success", text: "Profil toko berhasil diperbarui" })
    }
    setIsSaving(false)
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    )
  }

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>

        <h1 className="mb-6 text-2xl font-bold text-foreground">Pengaturan Toko</h1>

        <Card>
          <CardHeader>
            <CardTitle>Profil Toko</CardTitle>
            <CardDescription>Foto dan informasi toko Anda yang tampil di marketplace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-border bg-muted">
                  {avatarUrl ? (
                    <img
                      key={avatarKey}
                      src={avatarUrl}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-muted-foreground">
                      {name?.[0]?.toUpperCase() ?? "V"}
                    </div>
                  )}
                </div>
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
                <p className="font-medium text-foreground">{name || "Nama Toko"}</p>
                <p className="text-sm text-muted-foreground">Klik ikon kamera untuk ganti foto</p>
                <p className="mt-1 text-xs text-muted-foreground">PNG, JPG maks 2MB</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-name">Nama Toko *</Label>
              <Input
                id="store-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama toko Anda"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Deskripsi Toko</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Ceritakan tentang toko Anda..."
                rows={4}
              />
            </div>

            {msg && (
              <p className={`text-sm ${msg.type === "success" ? "text-emerald-600" : "text-destructive"}`}>
                {msg.text}
              </p>
            )}

            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Perubahan
            </Button>
          </CardContent>
        </Card>
      </main>
    </ProtectedRoute>
  )
}
