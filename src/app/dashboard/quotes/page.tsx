"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where, orderBy, updateDoc, doc, addDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { CustomSelect } from "@/components/custom-select"
import Link from "next/link"

interface SelectedProduct {
  productId: string
  productName: string
  quantity: number
  price: number
}

interface Quote {
  id: string
  userId?: string
  name: string
  email: string
  phone: string
  eventType: string
  customEventType?: string
  eventDate: string
  guests: string
  budget: string
  description: string
  selectedProducts?: SelectedProduct[]
  estimatedTotal?: number
  status: "new" | "contacted" | "quoted" | "accepted" | "declined" | "converted"
  createdAt: string
}

const statusLabels: Record<string, string> = {
  new: "Nouveau",
  contacted: "Contacté",
  quoted: "Devis envoyé",
  accepted: "Accepté",
  declined: "Refusé",
  converted: "Converti en commande",
}

const statusColors: Record<string, string> = {
  new: "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  quoted: "bg-purple-100 text-purple-700",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
  converted: "bg-emerald-100 text-emerald-700",
}

export default function QuotesPage() {
  const { user, isAdmin } = useAuth()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [converting, setConverting] = useState<string | null>(null)

  useEffect(() => {
    fetchQuotes()
  }, [user, isAdmin])

  async function fetchQuotes() {
    if (!user) return
    
    try {
      let q
      if (isAdmin) {
        q = query(collection(db, "quotes"), orderBy("createdAt", "desc"))
      } else {
        q = query(collection(db, "quotes"), where("userId", "==", user.uid), orderBy("createdAt", "desc"))
      }
      
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote))
      setQuotes(data)
    } catch (error) {
      console.error("Error fetching quotes:", error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(quoteId: string, newStatus: string) {
    if (!isAdmin) return
    try {
      await updateDoc(doc(db, "quotes", quoteId), { status: newStatus })
      setQuotes(quotes.map(q => q.id === quoteId ? { ...q, status: newStatus as Quote["status"] } : q))
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  async function convertToOrder(quote: Quote) {
    if (!isAdmin) return
    setConverting(quote.id)
    
    try {
      // Create order from quote
      await addDoc(collection(db, "orders"), {
        userId: quote.userId || null,
        quoteId: quote.id,
        customerName: quote.name,
        customerEmail: quote.email,
        customerPhone: quote.phone,
        eventType: quote.eventType,
        customEventType: quote.customEventType || null,
        eventDate: quote.eventDate,
        guests: quote.guests,
        products: quote.selectedProducts || [],
        total: quote.estimatedTotal || 0,
        description: quote.description,
        status: "pending",
        createdAt: new Date().toISOString(),
      })

      // Update quote status
      await updateDoc(doc(db, "quotes", quote.id), { status: "converted" })
      setQuotes(quotes.map(q => q.id === quote.id ? { ...q, status: "converted" } : q))
      
      alert("✅ Commande créée avec succès !")
    } catch (error) {
      console.error("Error converting quote:", error)
      alert("Erreur lors de la conversion")
    } finally {
      setConverting(null)
    }
  }

  async function deleteQuote(quoteId: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) return
    
    try {
      await deleteDoc(doc(db, "quotes", quoteId))
      setQuotes(quotes.filter(q => q.id !== quoteId))
    } catch (error) {
      console.error("Error deleting quote:", error)
      alert("Erreur lors de la suppression")
    }
  }

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-medium text-accent">
        {isAdmin ? "Demandes de devis" : "Mes demandes de devis"}
      </h1>

      {quotes.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <span className="text-6xl">📝</span>
          <h2 className="mt-4 font-serif text-xl font-medium text-accent">Aucune demande</h2>
          <p className="mt-2 text-muted-foreground">
            {isAdmin ? "Les demandes de devis apparaîtront ici." : "Vos demandes de devis apparaîtront ici."}
          </p>
          {!isAdmin && (
            <Link href="/devis" className="mt-4 inline-block rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground">
              Demander un devis
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <div key={quote.id} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg font-medium text-accent">{quote.name}</span>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[quote.status]}`}>
                      {statusLabels[quote.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{quote.email}</p>
                  {quote.phone && <p className="text-sm text-muted-foreground">{quote.phone}</p>}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-accent">
                    {quote.eventType === "autre" ? quote.customEventType : quote.eventType}
                  </p>
                  <p className="text-sm text-muted-foreground">{quote.eventDate}</p>
                  {isAdmin && quote.status !== "converted" && (
                    <div className="mt-2 min-w-[140px]">
                      <CustomSelect
                        options={[
                          { value: "new", label: "Nouveau" },
                          { value: "contacted", label: "Contacté" },
                          { value: "quoted", label: "Devis envoyé" },
                          { value: "accepted", label: "Accepté" },
                          { value: "declined", label: "Refusé" },
                        ]}
                        value={quote.status}
                        onChange={(value) => updateStatus(quote.id, value)}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Products */}
              {quote.selectedProducts && quote.selectedProducts.length > 0 && (
                <div className="mt-4 border-t border-border pt-4">
                  <span className="text-xs font-medium text-muted-foreground">Produits sélectionnés</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {quote.selectedProducts.map((p, i) => (
                      <span key={i} className="rounded-full bg-secondary px-3 py-1 text-sm">
                        {p.productName} x{p.quantity} ({p.price * p.quantity}€)
                      </span>
                    ))}
                  </div>
                  {quote.estimatedTotal && (
                    <p className="mt-2 font-medium text-primary">Total estimé: {quote.estimatedTotal}€</p>
                  )}
                </div>
              )}
              
              <div className="mt-4 grid gap-4 border-t border-border pt-4 md:grid-cols-3">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Personnes</span>
                  <p className="text-sm text-accent">{quote.guests || "Non spécifié"}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Budget</span>
                  <p className="text-sm text-accent">{quote.budget || "Non spécifié"}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Date demande</span>
                  <p className="text-sm text-accent">
                    {new Date(quote.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
              
              {quote.description && (
                <div className="mt-4 border-t border-border pt-4">
                  <span className="text-xs font-medium text-muted-foreground">Description</span>
                  <p className="mt-1 text-sm text-accent">{quote.description}</p>
                </div>
              )}

              {/* Admin Actions */}
              <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                <Link
                  href={`/dashboard/quotes/${quote.id}`}
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
                >
                  💬 Voir / Discuter
                </Link>
                {isAdmin && quote.status !== "converted" && (
                  <button
                    onClick={() => convertToOrder(quote)}
                    disabled={converting === quote.id}
                    className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {converting === quote.id ? "..." : "✅ Commande"}
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => deleteQuote(quote.id)}
                    className="inline-flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
                  >
                    🗑️ Supprimer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
