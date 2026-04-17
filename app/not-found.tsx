import Link from "next/link"
import { Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <h1 className="text-8xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-foreground">Halaman Tidak Ditemukan</h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Search className="h-4 w-4" />
            Cari Produk
          </Button>
        </Link>
      </div>
    </main>
  )
}
