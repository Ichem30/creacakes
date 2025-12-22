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

      {/* How It Works */}
      <section className="bg-card py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Simple & Rapide
            </span>
            <h2 className="mb-4 font-serif text-4xl font-light text-accent md:text-5xl">
              Comment <span className="font-medium text-primary">ça marche</span> ?
            </h2>
            <p className="text-muted-foreground text-lg">
              Commander votre gâteau de rêve n&apos;a jamais été aussi simple
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              { step: "1", icon: "🎂", title: "Choisissez", desc: "Parcourez notre collection ou imaginez votre création" },
              { step: "2", icon: "✨", title: "Personnalisez", desc: "Taille, saveur, décoration... tout est possible !" },
              { step: "3", icon: "📅", title: "Réservez", desc: "Commandez 5 jours à l'avance minimum" },
              { step: "4", icon: "🎉", title: "Savourez", desc: "Récupérez et régalez vos invités !" }
            ].map((item, index) => (
              <div 
                key={item.step}
                className="group relative text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Connector line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
                )}
                
                <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-300 group-hover:scale-110">
                  <span className="text-4xl group-hover:animate-bounce-soft">{item.icon}</span>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                    {item.step}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-accent mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/quote"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
            >
              Demander un devis personnalisé →
            </Link>
          </div>
        </div>
      </section>

      {/* Social Follow */}
      <section className="bg-secondary py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Réseaux Sociaux
            </span>
            <h2 className="mb-4 font-serif text-4xl font-light text-accent md:text-5xl">
              Suivez nos <span className="font-medium text-primary">créations</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Découvrez nos dernières réalisations, coulisses et inspirations en nous suivant sur les réseaux !
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/dscrea_cakes/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-8 py-4 text-white font-medium hover:shadow-xl hover:shadow-pink-500/25 hover:-translate-y-1 transition-all duration-300"
              >
                <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @dscrea_cakes
              </a>

              {/* TikTok */}
              <a 
                href="https://www.tiktok.com/@ds.creacakes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-black px-8 py-4 text-white font-medium hover:shadow-xl hover:shadow-black/25 hover:-translate-y-1 transition-all duration-300"
              >
                <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                @ds.creacakes
              </a>
            </div>
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
