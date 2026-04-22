import Link from "next/link"
import { Store, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">ShakaDigital</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Platform marketplace produk digital terpercaya di Indonesia. Jual beli e-book, template, dan software.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Kategori</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products?category=ebook" className="hover:text-primary">
                  E-Book & PDF
                </Link>
              </li>
              <li>
                <Link href="/products?category=template" className="hover:text-primary">
                  Template & Desain
                </Link>
              </li>
              <li>
                <Link href="/products?category=software" className="hover:text-primary">
                  Software & Kode
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Dukungan</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-primary">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/vendor/register" className="hover:text-primary">
                  Jadi Vendor
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Kontak</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@shakadigital.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ShakaDigital. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
