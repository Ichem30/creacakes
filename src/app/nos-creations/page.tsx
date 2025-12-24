"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ProductCard } from "@/components/product-card"

interface Product {
  id: string
  name: string
  slug?: string
  description: string
  price: number
  category: string
  image: string
  available: boolean
}

interface Category {
  id: string
  name: string
  order: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showUnavailable, setShowUnavailable] = useState(true)

  useEffect(() => {
    loadSettings()
    fetchProducts()
    fetchCategories()
  }, [])

  async function loadSettings() {
    try {
      const docRef = doc(db, "settings", "site")
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setShowUnavailable(docSnap.data().showUnavailableProducts ?? true)
      }
    } catch {
      // Permission denied for non-admin users - use default (show unavailable)
      // This is expected behavior, no need to log
    }
  }

  async function fetchProducts() {
    try {
      // Load all products, filter client-side based on settings
      const snapshot = await getDocs(collection(db, "products"))
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product))
      // Sort by order client-side
      data.sort((a, b) => ((a as unknown as {order?: number}).order || 0) - ((b as unknown as {order?: number}).order || 0))
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      // Load all categories without orderBy to catch all documents
      const snapshot = await getDocs(collection(db, "categories"))
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || "Sans nom",
        order: doc.data().order ?? 999
      } as Category))
      // Sort locally
      data.sort((a, b) => a.order - b.order)
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  // Get displayable products based on settings
  const displayableProducts = showUnavailable 
    ? products 
    : products.filter(p => p.available)

  // Filter categories that have at least one displayable product
  const categoriesWithProducts = categories.filter(cat => 
    displayableProducts.some(p => p.category === cat.name)
  )

  // Filter products by category, sort available first
  const filteredProducts = (selectedCategory === "all" 
    ? displayableProducts 
    : displayableProducts.filter(p => p.category === selectedCategory)
  ).sort((a, b) => {
    // Available products first
    if (a.available && !b.available) return -1
    if (!a.available && b.available) return 1
    return 0
  })

  return (
    <>
      <section className="bg-secondary py-20 md:py-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-10 right-20 w-16 h-16 rounded-full bg-primary/15 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-10 w-12 h-12 rounded-full bg-accent/10 animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent animate-fade-in-down">
            La Collection
          </span>
          <h1 className="mb-4 font-serif text-5xl font-light text-accent md:text-6xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Nos <span className="font-medium text-primary">Gâteaux</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Découvrez nos créations artisanales, faites avec passion et les meilleurs ingrédients.
          </p>
        </div>
      </section>

      <section className="bg-card py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Category Filter */}
          <div className="mb-12 flex flex-wrap justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                selectedCategory === "all"
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground hover:shadow-md"
              }`}
            >
              Tous
            </button>
            {categoriesWithProducts.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                  selectedCategory === cat.name
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground hover:shadow-md"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse rounded-lg bg-secondary h-80" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-6xl">🎂</span>
              <h2 className="mt-4 font-serif text-2xl text-accent">Aucun gâteau trouvé</h2>
              <p className="mt-2 text-muted-foreground">
                {selectedCategory === "all"
                  ? "Nos créations arrivent bientôt !"
                  : "Aucun gâteau dans cette catégorie."}
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  title={product.name}
                  description={product.description}
                  price={product.price}
                  category={product.category}
                  image={product.image}
                  slug={product.slug}
                  available={product.available}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
