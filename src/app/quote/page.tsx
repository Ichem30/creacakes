"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { CustomSelect } from "@/components/custom-select"

interface PriceVariant {
  label: string
  price: number
}

interface Product {
  id: string
  name: string
  price: number
  category: string
  available?: boolean
  priceVariants?: PriceVariant[]
  flavors?: string[]
}

interface SelectedProduct {
  productId: string
  productName: string
  variant: string
  flavor: string
  quantity: number
  price: number
}

const eventTypeOptions = [
  { value: "mariage", label: "Mariage", icon: "💒" },
  { value: "anniversaire", label: "Anniversaire", icon: "🎂" },
  { value: "bapteme", label: "Baptême", icon: "👶" },
  { value: "entreprise", label: "Événement d'entreprise", icon: "🏢" },
  { value: "autre", label: "Autre", icon: "✨" },
]

const budgetOptions = [
  { value: "50-100", label: "50€ - 100€", icon: "💰" },
  { value: "100-200", label: "100€ - 200€", icon: "💰" },
  { value: "200-500", label: "200€ - 500€", icon: "💎" },
  { value: "500+", label: "500€ et plus", icon: "👑" },
]

export default function QuotePage() {
  const { user } = useAuth()
  const { items: cartItems, clearCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [cartImported, setCartImported] = useState(false)
  
  const [form, setForm] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    eventType: "",
    customEventType: "",
    eventDate: "",
    guests: "",
    budget: "",
    description: "",
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  // Import cart items on mount
  useEffect(() => {
    if (cartItems.length > 0 && !cartImported) {
      // Cart items already contain variant/flavor info in the name
      const imported = cartItems.map(item => ({
        productId: item.id,
        productName: item.name,
        variant: "",
        flavor: "",
        quantity: item.quantity,
        price: item.price,
      }))
      setSelectedProducts(imported)
      setCartImported(true)
    }
  }, [cartItems, cartImported])

  async function fetchProducts() {
    try {
      // Load all products, sort client-side to avoid composite index requirement
      const snapshot = await getDocs(collection(db, "products"))
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Product))
        .filter(p => p.available !== false) // Filter available
        .sort((a, b) => (a.category || "").localeCompare(b.category || ""))
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const addProduct = () => {
    setSelectedProducts([...selectedProducts, { 
      productId: "", 
      productName: "", 
      variant: "",
      flavor: "",
      quantity: 1, 
      price: 0 
    }])
  }

  const updateSelectedProduct = (index: number, field: string, value: string | number) => {
    const updated = [...selectedProducts]
    if (field === "productId") {
      const product = products.find(p => p.id === value)
      const defaultVariant = product?.priceVariants?.[0]
      const defaultFlavor = product?.flavors?.[0] || ""
      updated[index] = { 
        ...updated[index], 
        productId: value as string, 
        productName: product?.name || "",
        variant: defaultVariant?.label || "",
        flavor: defaultFlavor,
        price: defaultVariant?.price || product?.price || 0,
      }
    } else if (field === "variant") {
      const product = products.find(p => p.id === updated[index].productId)
      const variant = product?.priceVariants?.find(v => v.label === value)
      updated[index] = { 
        ...updated[index], 
        variant: value as string,
        price: variant?.price || updated[index].price,
      }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setSelectedProducts(updated)
  }

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index))
  }

  const estimatedTotal = selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const docRef = await addDoc(collection(db, "quotes"), {
        userId: user?.uid || null,
        ...form,
        selectedProducts: selectedProducts.filter(p => p.productId || p.productName),
        estimatedTotal,
        status: "new",
        createdAt: new Date().toISOString(),
      })
      
      // Send notification to admin
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "newQuote",
          name: form.name,
          email: form.email,
          eventType: form.eventType === "autre" ? form.customEventType : form.eventType,
          eventDate: form.eventDate,
          quoteId: docRef.id,
        }),
      }).catch(console.error)
      
      // Clear cart after successful quote submission
      if (cartItems.length > 0) {
        clearCart()
      }
      
      setSubmitted(true)
    } catch (error) {
      console.error("Error creating quote:", error)
      alert("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="bg-secondary py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-lg rounded-lg bg-card p-8 shadow-lg">
            <span className="text-6xl">✨</span>
            <h1 className="mt-4 font-serif text-3xl font-medium text-accent">Demande envoyée !</h1>
            <p className="mt-4 text-muted-foreground">
              Merci pour votre demande de devis. Nous vous recontacterons dans les 24 à 48 heures.
            </p>
            <div className="mt-6 space-y-3">
              <p className="text-sm text-muted-foreground">Vous pouvez aussi nous contacter directement :</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a 
                  href="https://www.instagram.com/dscrea_cakes/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-medium text-white"
                >
                  📸 Instagram
                </a>
                <a 
                  href="mailto:contact@dscreacakes.fr"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground"
                >
                  📧 Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Créations Sur Mesure
          </span>
          <h1 className="mb-4 font-serif text-5xl font-light text-accent md:text-6xl">
            Demander un <span className="font-medium text-primary">Devis</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {cartImported && selectedProducts.length > 0 
              ? "Vos produits sélectionnés ont été ajoutés. Complétez le formulaire pour recevoir votre devis personnalisé."
              : "Sélectionnez les produits qui vous intéressent et décrivez votre projet."
            }
          </p>
        </div>
      </section>

      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
            
            {/* Product Selection */}
            <div className="rounded-lg border border-primary/20 bg-secondary p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-medium text-accent">
                  🎂 Produits sélectionnés
                </h2>
                {estimatedTotal > 0 && (
                  <span className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                    ~{estimatedTotal}€
                  </span>
                )}
              </div>
              
              {selectedProducts.length === 0 ? (
                <p className="mb-4 text-sm text-muted-foreground">
                  Aucun produit sélectionné. Ajoutez des produits ou décrivez votre projet personnalisé ci-dessous.
                </p>
              ) : (
                <div className="space-y-4 mb-4">
                  {selectedProducts.map((selected, index) => {
                    const product = products.find(p => p.id === selected.productId)
                    const hasVariants = product?.priceVariants && product.priceVariants.length > 0
                    const hasFlavors = product?.flavors && product.flavors.length > 0
                    
                    // Create options for CustomSelect
                    const productOptions = [
                      { value: "", label: "Choisir un produit..." },
                      ...products.map(p => ({ value: p.id, label: `${p.name} - ${p.category}` }))
                    ]
                    
                    const variantOptions = product?.priceVariants?.map(v => ({
                      value: v.label,
                      label: `${v.label} (${v.price}€)`
                    })) || []
                    
                    const flavorOptions = product?.flavors?.map(f => ({
                      value: f,
                      label: f
                    })) || []
                    
                    return (
                      <div key={index} className="bg-card rounded-lg p-4 space-y-3">
                        <div className="flex gap-3 items-start">
                          {/* Product Selector */}
                          <div className="flex-1">
                            <CustomSelect
                              options={productOptions}
                              value={selected.productId}
                              onChange={(value) => updateSelectedProduct(index, "productId", value)}
                              placeholder="Choisir un produit..."
                            />
                          </div>
                          
                          {/* Quantity */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">×</span>
                            <input
                              type="number"
                              min="1"
                              value={selected.quantity}
                              onChange={(e) => updateSelectedProduct(index, "quantity", parseInt(e.target.value) || 1)}
                              className="w-16 rounded-md border border-border bg-background px-2 py-2 text-center text-sm"
                            />
                          </div>
                          
                          {/* Price */}
                          {selected.price > 0 && (
                            <span className="text-sm font-semibold text-primary min-w-[60px] text-right">
                              {selected.price * selected.quantity}€
                            </span>
                          )}
                          
                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="rounded-md p-2 text-red-500 hover:bg-red-50"
                          >
                            ✕
                          </button>
                        </div>
                        
                        {/* Variant & Flavor selectors - only show when product is selected */}
                        {selected.productId && (hasVariants || hasFlavors) && (
                          <div className="flex gap-3 flex-wrap pl-2 border-l-2 border-primary/20">
                            {/* Variant (Size) */}
                            {hasVariants && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Taille:</span>
                                <div className="min-w-[140px]">
                                  <CustomSelect
                                    options={variantOptions}
                                    value={selected.variant}
                                    onChange={(value) => updateSelectedProduct(index, "variant", value)}
                                    placeholder="Taille"
                                  />
                                </div>
                              </div>
                            )}
                            
                            {/* Flavor */}
                            {hasFlavors && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Saveur:</span>
                                <div className="min-w-[140px]">
                                  <CustomSelect
                                    options={flavorOptions}
                                    value={selected.flavor}
                                    onChange={(value) => updateSelectedProduct(index, "flavor", value)}
                                    placeholder="Saveur"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              
              <button
                type="button"
                onClick={addProduct}
                className="inline-flex items-center gap-2 rounded-md border border-dashed border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
              >
                ➕ Ajouter un produit
              </button>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-medium text-accent">📋 Vos informations</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-accent">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-accent">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-accent">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label htmlFor="eventType" className="mb-2 block text-sm font-medium text-accent">
                    Type d&apos;événement *
                  </label>
                  <CustomSelect
                    id="eventType"
                    options={eventTypeOptions}
                    value={form.eventType}
                    onChange={(value) => setForm({ ...form, eventType: value, customEventType: "" })}
                    placeholder="Sélectionnez un type..."
                    required
                  />
                  {form.eventType === "autre" && (
                    <input
                      type="text"
                      placeholder="Précisez le type d'événement..."
                      value={form.customEventType}
                      onChange={(e) => setForm({ ...form, customEventType: e.target.value })}
                      required
                      className="mt-3 w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label htmlFor="eventDate" className="mb-2 block text-sm font-medium text-accent">
                    Date de l&apos;événement *
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    required
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label htmlFor="guests" className="mb-2 block text-sm font-medium text-accent">
                    Nombre de personnes
                  </label>
                  <input
                    type="number"
                    id="guests"
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label htmlFor="budget" className="mb-2 block text-sm font-medium text-accent">
                    Budget estimé
                  </label>
                  <CustomSelect
                    id="budget"
                    options={budgetOptions}
                    value={form.budget}
                    onChange={(value) => setForm({ ...form, budget: value })}
                    placeholder="Sélectionnez un budget..."
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-medium text-accent">
                  Détails supplémentaires
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Thème, couleurs, saveurs souhaitées, allergies, personnalisation..."
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-accent px-6 py-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50"
            >
              {loading ? "Envoi en cours..." : `Envoyer ma demande${estimatedTotal > 0 ? ` (~${estimatedTotal}€)` : ""}`}
            </button>

            {/* Social Links */}
            <div className="rounded-lg border border-border bg-secondary p-6 text-center">
              <p className="mb-4 text-sm text-muted-foreground">
                Vous préférez nous contacter directement ?
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a 
                  href="https://www.instagram.com/dscrea_cakes/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-medium text-white hover:opacity-90"
                >
                  📸 Nous suivre sur Instagram
                </a>
                <a 
                  href="mailto:contact@dscreacakes.fr"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-background"
                >
                  📧 contact@dscreacakes.fr
                </a>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
