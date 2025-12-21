"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useState, useEffect } from "react"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Product {
  id: string
  name: string
  slug?: string
  description: string
  longDescription?: string
  price: number
  category: string
  image: string
  servings?: string
  allergens?: string[]
}

export default function ProductPage() {
  const params = useParams()
  const slugOrId = params.id as string
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      try {
        // First try to find by slug
        const slugQuery = query(
          collection(db, "products"),
          where("slug", "==", slugOrId)
        )
        const slugSnapshot = await getDocs(slugQuery)
        
        if (!slugSnapshot.empty) {
          const doc = slugSnapshot.docs[0]
          setProduct({ id: doc.id, ...doc.data() } as Product)
        } else {
          // Fallback: try to find by document ID
          const docRef = doc(db, "products", slugOrId)
          const docSnap = await getDoc(docRef)
          
          if (docSnap.exists()) {
            setProduct({ id: docSnap.id, ...docSnap.data() } as Product)
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slugOrId])

  if (loading) {
    return (
      <section className="bg-card py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="bg-card py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl text-accent">Produit non trouvé</h1>
          <Link href="/products" className="mt-4 inline-block text-primary hover:underline">
            ← Retour aux produits
          </Link>
        </div>
      </section>
    )
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <section className="bg-card py-20">
      <div className="container mx-auto px-4">
        <Link href="/products" className="mb-8 inline-block text-sm text-muted-foreground hover:text-primary">
          ← Retour aux produits
        </Link>
        
        <div className="grid gap-12 md:grid-cols-2 md:items-start md:gap-16">
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <Image 
                src={product.image || "/placeholder.jpg"} 
                alt={product.name} 
                width={600}
                height={600}
                className="aspect-square w-full object-cover" 
              />
            </div>
            <div className="absolute -right-4 -top-4 -z-10 h-full w-full rounded-2xl border-2 border-primary/30"></div>
          </div>

          <div className="space-y-6">
            <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
              {product.category}
            </span>
            <h1 className="font-serif text-4xl font-light text-accent md:text-5xl">{product.name}</h1>
            <p className="font-serif text-3xl font-semibold text-primary">À partir de {product.price}€</p>

            <div className="space-y-4 text-muted-foreground">
              <p>{product.description}</p>
              {product.longDescription && product.longDescription.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {(product.servings || product.allergens) && (
              <div className="space-y-3 border-t border-border pt-6">
                {product.servings && (
                  <div className="flex gap-2">
                    <span className="font-semibold text-accent">Portions:</span>
                    <span className="text-muted-foreground">{product.servings}</span>
                  </div>
                )}
                {product.allergens && product.allergens.length > 0 && (
                  <div className="flex gap-2">
                    <span className="font-semibold text-accent">Allergènes:</span>
                    <span className="text-muted-foreground">{product.allergens.join(", ")}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <button 
                onClick={handleAddToCart}
                className={`inline-flex items-center justify-center rounded-md px-8 py-4 text-sm font-medium transition-colors ${added ? "bg-green-600 text-white" : "bg-accent text-accent-foreground hover:bg-accent/90"}`}
              >
                {added ? "✓ Ajouté au panier !" : "Ajouter au panier"}
              </button>
              <Link 
                href="/quote" 
                className="inline-flex items-center justify-center rounded-md border-2 border-accent bg-transparent px-8 py-4 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Demander un devis personnalisé
              </Link>
            </div>

            <div className="rounded-xl border border-primary/20 bg-secondary p-6">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Conseil:</strong> Commandez au moins 5 jours à l&apos;avance pour les gâteaux standards, 
                et 2 semaines pour les créations personnalisées.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
