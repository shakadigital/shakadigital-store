import Link from "next/link"
import { BookOpen, Palette, Code, GraduationCap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { ProductCategory } from "@/lib/types"

interface CategoryCardProps {
  category: ProductCategory
  label: string
  description: string
  count: number
}

const categoryIcons = {
  ebook: BookOpen,
  template: Palette,
  software: Code,
  course: GraduationCap,
}

const categoryColors = {
  ebook: "bg-blue-500/10 text-blue-600",
  template: "bg-pink-500/10 text-pink-600",
  software: "bg-emerald-500/10 text-emerald-600",
  course: "bg-amber-500/10 text-amber-600",
}

export function CategoryCard({ category, label, description, count }: CategoryCardProps) {
  const Icon = categoryIcons[category]

  return (
    <Link href={`/products?category=${category}`}>
      <Card className="group h-full transition-all hover:shadow-md hover:border-primary/50">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <div
            className={`mb-4 rounded-full p-4 ${categoryColors[category]} transition-transform group-hover:scale-110`}
          >
            <Icon className="h-8 w-8" />
          </div>
          <h3 className="font-semibold text-foreground">{label}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          <span className="mt-3 text-sm font-medium text-primary">{count} produk</span>
        </CardContent>
      </Card>
    </Link>
  )
}
