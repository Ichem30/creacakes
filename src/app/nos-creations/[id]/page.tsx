"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useState, useEffect } from "react"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface PriceVariant {
  label: string
  price: number
}

interface Product {
  id: string
  name: string
  slug?: string
  description: string
  longDescription?: string
  price: number
  priceVariants?: PriceVariant[]
  flavors?: string[]
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
  const [selectedVariant, setSelectedVariant] = useState<PriceVariant | null>(null)
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null)

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
          const data = { id: doc.id, ...doc.data() } as Product
          setProduct(data)
          // Set default variant
          if (data.priceVariants && data.priceVariants.length > 0) {
            setSelectedVariant(data.priceVariants[0])
          } else {
            setSelectedVariant({ label: data.servings || "Standard", price: data.price })
          }
          // Set default flavor
          if (data.flavors && data.flavors.length > 0) {
            setSelectedFlavor(data.flavors[0])
          }
        } else {
          // Fallback: try to find by document ID
          const docRef = doc(db, "products", slugOrId)
          const docSnap = await getDoc(docRef)
          
          if (docSnap.exists()) {
            const data = { id: docSnap.id, ...docSnap.data() } as Product
            setProduct(data)
            // Set default variant
            if (data.priceVariants && data.priceVariants.length > 0) {
              setSelectedVariant(data.priceVariants[0])
            } else {
              setSelectedVariant({ label: data.servings || "Standard", price: data.price })
            }
            // Set default flavor
            if (data.flavors && data.flavors.length > 0) {
              setSelectedFlavor(data.flavors[0])
            }
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
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground animate-pulse-soft">Chargement...</p>
        </div>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="bg-card py-20">
        <div className="container mx-auto px-4 text-center animate-fade-in-up">
          <span className="text-6xl block mb-4">🎂</span>
          <h1 className="font-serif text-3xl text-accent">Produit non trouvé</h1>
          <Link href="/nos-creations" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline transition-all hover:gap-3">
            ← Retour aux produits
          </Link>
        </div>
      </section>
    )
  }

  const handleAddToCart = () => {
    if (!selectedVariant) return
    
    // Build name with variant and flavor
    let itemName = product.name
    const details = []
    if (selectedVariant.label !== "Standard") {
      details.push(selectedVariant.label)
    }
    if (selectedFlavor && product.flavors && product.flavors.length > 1) {
      details.push(selectedFlavor)
    }
    if (details.length > 0) {
      itemName += ` (${details.join(" - ")})`
    }
    
    addItem({
      id: product.id,
      name: itemName,
      price: selectedVariant.price,
      image: product.image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  // Get variants to display
  const variants = product.priceVariants && product.priceVariants.length > 0 
    ? product.priceVariants 
    : [{ label: product.servings || "Standard", price: product.price }]

  return (
    <section className="bg-card py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <Link href="/nos-creations" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:gap-3 group">
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Retour aux produits
        </Link>
        
        <div className="grid gap-12 md:grid-cols-2 md:items-start md:gap-16">
          <div className="relative animate-fade-in-left">
            <div className="overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl group">
              <Image 
                src={product.image || "/placeholder.jpg"} 
                alt={product.name} 
                width={600}
                height={600}
                className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="absolute -right-4 -top-4 -z-10 h-full w-full rounded-2xl border-2 border-primary/30 transition-all duration-300"></div>
            <div className="absolute inset-0 -z-10 rounded-2xl bg-primary/20 blur-3xl opacity-50" />
          </div>

          <div className="space-y-6 animate-fade-in-right" style={{ animationDelay: '0.2s' }}>
            <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lg">
              {product.category}
            </span>
            <h1 className="font-serif text-4xl font-light text-accent md:text-5xl">{product.name}</h1>
            
            {/* Price variants selector */}
            {variants.length > 1 ? (
              <div className="space-y-3">
                <p className="text-sm font-medium text-accent">Choisissez une taille :</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(variant)}
                      className={`rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        selectedVariant?.label === variant.label
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-secondary text-accent hover:bg-secondary/80"
                      }`}
                    >
                      <span className="block">{variant.label}</span>
                      <span className="block text-lg font-semibold">{variant.price}€</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="font-serif text-3xl font-semibold text-primary">{selectedVariant?.price}€</p>
            )}

            {/* Flavor selector */}
            {product.flavors && product.flavors.length > 1 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-accent">Choisissez une saveur :</p>
                <div className="flex flex-wrap gap-2">
                  {product.flavors.map((flavor, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFlavor(flavor)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        selectedFlavor === flavor
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-secondary text-accent hover:bg-secondary/80"
                      }`}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{product.description}</p>
              {product.longDescription && product.longDescription.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {product.allergens && product.allergens.length > 0 && (
              <div className="space-y-3 border-t border-border pt-6">
                <div className="flex gap-2">
                  <span className="font-semibold text-accent">Allergènes:</span>
                  <span className="text-muted-foreground">{product.allergens.join(", ")}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <button 
                onClick={handleAddToCart}
                className={`group relative inline-flex items-center justify-center rounded-md px-8 py-4 text-sm font-medium transition-all duration-300 overflow-hidden ${
                  added 
                    ? "bg-green-600 text-white shadow-lg shadow-green-600/30" 
                    : "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-1"
                }`}
              >
                <span className="relative z-10">
                  {added ? "✓ Ajouté au panier !" : `Ajouter au panier${selectedVariant ? ` - ${selectedVariant.price}€` : ''}`}
                </span>
                {!added && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />}
              </button>
              <Link 
                href="/devis" 
                className="inline-flex items-center justify-center rounded-md border-2 border-accent bg-transparent px-8 py-4 text-sm font-medium text-accent transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:shadow-lg hover:-translate-y-1"
              >
                Demander un devis personnalisé
              </Link>
            </div>

            <div className="glass rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
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


