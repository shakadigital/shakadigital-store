import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: {
    default: "ShakaDigital - Marketplace Produk Digital Indonesia",
    template: "%s | ShakaDigital",
  },
  description:
    "Platform marketplace produk digital terpercaya di Indonesia. Jual beli e-book, template, software, dan kursus online dengan mudah dan aman.",
  keywords: [
    "marketplace digital",
    "produk digital",
    "e-book indonesia",
    "template desain",
    "software",
    "kursus online",
    "jual produk digital",
  ],
  authors: [{ name: "ShakaDigital" }],
  creator: "ShakaDigital",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://shakadigital.com",
    siteName: "ShakaDigital",
    title: "ShakaDigital - Marketplace Produk Digital Indonesia",
    description:
      "Platform marketplace produk digital terpercaya. Jual beli e-book, template, software, dan kursus online.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShakaDigital - Marketplace Produk Digital Indonesia",
    description:
      "Platform marketplace produk digital terpercaya. Jual beli e-book, template, software, dan kursus online.",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/logo.png",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <Navbar />
            {children}
            <Footer />
            <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
