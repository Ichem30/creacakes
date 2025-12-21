import Link from "next/link"
import Image from "next/image"

interface ProductCardProps {
  id: string
  slug?: string
  title: string
  description: string
  price: number
  category: string
  image: string
}

export function ProductCard({ id, slug, title, description, price, category, image }: ProductCardProps) {
  // Use slug if available, fallback to id
  const href = slug ? `/products/${slug}` : `/products/${id}`
  
  return (
    <Link href={href} className="group block">
      <div className="overflow-hidden rounded-lg border border-border/40 bg-card transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image || "/placeholder.jpg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
            {category}
          </span>
        </div>

        <div className="p-6">
          <h3 className="mb-2 font-serif text-2xl font-medium text-accent">{title}</h3>
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{description}</p>
          <div className="flex items-center justify-between border-t border-border/40 pt-4">
            <span className="font-serif text-xl font-semibold text-accent">À partir de {price}€</span>
            <span className="text-sm font-medium text-primary transition-colors group-hover:text-primary/70">
              Voir détails →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
