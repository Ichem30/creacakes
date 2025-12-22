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
  available?: boolean
}

export function ProductCard({ id, slug, title, description, price, category, image, available = true }: ProductCardProps) {
  // Use slug if available, fallback to id
  const href = slug ? `/products/${slug}` : `/products/${id}`
  
  return (
    <Link href={href} className="group block">
      <div className={`card-shine overflow-hidden rounded-lg border border-border/40 bg-card transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 ${!available ? 'opacity-75' : ''}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image || "/placeholder.jpg"}
            alt={title}
            fill
            className={`object-cover transition-all duration-700 group-hover:scale-110 ${!available ? 'grayscale-[30%]' : ''}`}
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-accent/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {/* Category badge */}
          <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-110">
            {category}
          </span>
          {/* Sold out badge */}
          {!available && (
            <div className="absolute left-3 top-3 rounded-full bg-accent/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground shadow-lg">
              Sur commande
            </div>
          )}
          {/* Quick view indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-accent shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              Voir le produit
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="mb-2 font-serif text-2xl font-medium text-accent transition-colors duration-300 group-hover:text-primary">{title}</h3>
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{description}</p>
          <div className="flex items-center justify-between border-t border-border/40 pt-4">
            <span className="font-serif text-xl font-semibold text-accent">À partir de {price}€</span>
            <span className="flex items-center gap-1 text-sm font-medium text-primary transition-all duration-300 group-hover:gap-2">
              {available ? 'Voir détails' : 'Commander'}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}


