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
      <section className="bg-card py-20 md:py-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto mb-16 max-w-3xl text-center animate-fade-in-up">
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
                <div key={i} className="animate-shimmer rounded-lg bg-secondary h-80" />
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
              className="group inline-flex items-center gap-2 justify-center rounded-md border-2 border-accent bg-transparent px-8 py-3 text-sm font-medium text-accent transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:shadow-lg hover:-translate-y-1"
            >
              Voir toute la collection
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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
                <li className="group flex flex-col items-center gap-2 rounded-lg bg-card p-4 text-center md:items-start md:text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white cursor-default">
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-125 group-hover:animate-bounce-soft">✨</span>
                  <span className="text-sm font-semibold text-accent">Ingrédients Premium</span>
                </li>
                <li className="group flex flex-col items-center gap-2 rounded-lg bg-card p-4 text-center md:items-start md:text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white cursor-default">
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-125 group-hover:animate-bounce-soft">🎨</span>
                  <span className="text-sm font-semibold text-accent">Design Personnalisé</span>
                </li>
                <li className="group flex flex-col items-center gap-2 rounded-lg bg-card p-4 text-center md:items-start md:text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-white cursor-default">
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-125 group-hover:animate-bounce-soft">🚚</span>
                  <span className="text-sm font-semibold text-accent">Livraison à Domicile</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Témoignages
            </span>
            <h2 className="mb-4 font-serif text-4xl font-light text-accent md:text-5xl">
              Ce que disent <span className="font-medium text-primary">nos clients</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className="glass rounded-xl p-6 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:shadow-primary/10 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-xl text-primary transition-transform duration-300 group-hover:scale-110" style={{ transitionDelay: `${i * 50}ms` }}>★</span>
                  ))}
                </div>
                <p className="mb-4 text-muted-foreground italic leading-relaxed">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <p className="font-semibold text-accent">{testimonial.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent to-accent/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(232,180,184,0.3)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(232,180,184,0.2)_0%,transparent_40%)]" />
        
        {/* Decorative floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/10 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-10 right-20 w-16 h-16 rounded-full bg-primary/10 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-10 w-12 h-12 rounded-full bg-primary/10 animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="mb-4 font-serif text-4xl font-light text-accent-foreground md:text-5xl animate-fade-in-up">
            Envie d&apos;une <span className="font-medium text-primary">création unique</span> ?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-accent-foreground/80 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Contactez-nous pour discuter de votre projet. Nous créons des gâteaux sur mesure pour tous vos événements.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link 
              href="/quote" 
              className="group relative inline-flex items-center justify-center rounded-md bg-primary px-10 py-4 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10">Demander un devis gratuit</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center rounded-md border-2 border-accent-foreground/30 bg-transparent px-10 py-4 text-sm font-medium text-accent-foreground transition-all duration-300 hover:bg-accent-foreground/10 hover:border-accent-foreground/50 hover:-translate-y-1 hover:shadow-lg"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
