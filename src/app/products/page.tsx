"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
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
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  async function fetchProducts() {
    try {
      const q = query(
        collection(db, "products"),
        where("available", "==", true)
      )
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product))
      // Sort by order client-side to avoid composite index requirement
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
      const q = query(collection(db, "categories"), orderBy("order", "asc"))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category))
      setCategories(data)
    } catch (error) {
      // Fallback without orderBy
      try {
        const snapshot = await getDocs(collection(db, "categories"))
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Category))
        setCategories(data)
      } catch (e) {
        console.error("Error fetching categories:", e)
      }
    }
  }

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  return (
    <>
      <section className="bg-secondary py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            La Collection
          </span>
          <h1 className="mb-4 font-serif text-5xl font-light text-accent md:text-6xl">
            Nos <span className="font-medium text-primary">Gâteaux</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Découvrez nos créations artisanales, faites avec passion et les meilleurs ingrédients.
          </p>
        </div>
      </section>

      <section className="bg-card py-16">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
            >
              Tous
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  selectedCategory === cat.name
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
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
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
