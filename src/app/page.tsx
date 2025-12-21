"use client"

import { useEffect, useState } from "react"
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Hero } from "@/components/hero"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  slug?: string
}

const testimonials = [
  {
    id: "1",
    name: "Marie L.",
    text: "Un gâteau de mariage absolument magnifique ! Tous nos invités étaient émerveillés. Merci infiniment !",
    rating: 5
  },
  {
    id: "2",
    name: "Sophie D.",
    text: "Le fraisier était divin. Fraîcheur et finesse au rendez-vous. Je recommande à 100% !",
    rating: 5
  },
  {
    id: "3",
    name: "Thomas B.",
    text: "Commande pour l'anniversaire de ma fille, elle était aux anges ! Gâteau licorne parfait.",
    rating: 5
  }
]

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(
          collection(db, "products"),
          where("available", "==", true),
          orderBy("order", "asc"),
          limit(6)
        )
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product))
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
        // Fallback: try without orderBy (in case index doesn't exist)
        try {
          const q = query(
            collection(db, "products"),
            where("available", "==", true),
            limit(6)
          )
          const snapshot = await getDocs(q)
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Product))
          setProducts(data)
        } catch (e) {
          console.error("Fallback error:", e)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <>
      <Hero />

      {/* Featured Products */}
      <section className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Nos Créations
            </span>
            <h2 className="mb-4 font-serif text-4xl font-light text-accent md:text-5xl">
              Nos Gâteaux <span className="font-medium text-primary">Incontournables</span>
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Une sélection de nos créations les plus appréciées, alliant finesse et gourmandise.
            </p>
          </div>

          {loading ? (
            <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse rounded-lg bg-secondary h-80" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  title={product.name}
                  description={product.description}
                  price={product.price}
                  category={product.category}
                  image={product.image}
                  slug={product.slug}
                />
              ))}
            </div>
          ) : (
            <div className="mb-12 text-center text-muted-foreground">
              <p>Découvrez bientôt nos créations...</p>
            </div>
          )}

          <div className="text-center">
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center rounded-md border-2 border-accent bg-transparent px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Voir toute la collection
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-secondary py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <div className="relative mx-auto max-w-md">
              <div className="flex items-center justify-center">
                <Image
                  src="/images/image.png"
                  alt="D&S Créa'Cakes Logo"
                  width={400}
                  height={400}
                  className="h-auto w-full max-w-sm animate-float drop-shadow-2xl"
                />
              </div>
            </div>

            <div className="space-y-6 text-center md:text-left">
              <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Notre Histoire
              </span>
              <h2 className="font-serif text-4xl font-light text-accent md:text-5xl">
                La passion du <span className="font-medium text-primary">goût et du beau</span>
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  Chez D&S Créa&apos;Cakes, nous croyons que chaque gâteau raconte une histoire. Fondée par une passionnée
                  de pâtisserie fine, notre maison s&apos;engage à utiliser des produits frais et de saison pour créer des
                  desserts qui sont aussi beaux que bons.
                </p>
                <p>
                  Que ce soit pour un mariage, un anniversaire ou simplement pour le plaisir, nous mettons tout notre
                  savoir-faire au service de vos envies les plus gourmandes.
                </p>
              </div>
              <ul className="grid gap-4 pt-4 sm:grid-cols-3">
                <li className="flex flex-col items-center gap-2 rounded-lg bg-card p-4 text-center md:items-start md:text-left">
                  <span className="text-2xl">✨</span>
                  <span className="text-sm font-semibold text-accent">Ingrédients Premium</span>
                </li>
                <li className="flex flex-col items-center gap-2 rounded-lg bg-card p-4 text-center md:items-start md:text-left">
                  <span className="text-2xl">🎨</span>
                  <span className="text-sm font-semibold text-accent">Design Personnalisé</span>
                </li>
                <li className="flex flex-col items-center gap-2 rounded-lg bg-card p-4 text-center md:items-start md:text-left">
                  <span className="text-2xl">🚚</span>
                  <span className="text-sm font-semibold text-accent">Livraison à Domicile</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Témoignages
            </span>
            <h2 className="mb-4 font-serif text-4xl font-light text-accent md:text-5xl">
              Ce que disent <span className="font-medium text-primary">nos clients</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="rounded-lg border border-border/40 bg-secondary p-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-xl text-primary">★</span>
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground italic">&quot;{testimonial.text}&quot;</p>
                <p className="font-semibold text-accent">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-serif text-4xl font-light text-accent-foreground md:text-5xl">
            Envie d&apos;une <span className="font-medium text-primary">création unique</span> ?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-accent-foreground/80">
            Contactez-nous pour discuter de votre projet. Nous créons des gâteaux sur mesure pour tous vos événements.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/quote" className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Demander un devis gratuit
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-md border-2 border-accent-foreground/20 bg-transparent px-8 py-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-foreground/10">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
