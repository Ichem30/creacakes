"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface Customer {
  id: string
  email: string
  name?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    postalCode?: string
  }
  acceptMarketing?: boolean
  profileComplete?: boolean
  createdAt: string
  updatedAt?: string
}

export default function CustomersPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard")
      return
    }
    fetchCustomers()
  }, [isAdmin, router])

  async function fetchCustomers() {
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer))
      setCustomers(data)
    } catch (error) {
      console.error("Error fetching customers:", error)
      // Fallback without ordering
      try {
        const snapshot = await getDocs(collection(db, "users"))
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer))
        setCustomers(data)
      } catch {
        // ignore
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-medium text-accent">👥 Clients</h1>
          <p className="text-muted-foreground mt-1">{customers.length} client{customers.length > 1 ? "s" : ""} inscrit{customers.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <span className="text-6xl">👥</span>
          <h2 className="mt-4 font-serif text-xl font-medium text-accent">Aucun client</h2>
          <p className="mt-2 text-muted-foreground">Les clients inscrits apparaîtront ici.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Customers list */}
          <div className="lg:col-span-2 rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-accent">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-accent">Téléphone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-accent">Newsletter</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-accent">Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    onClick={() => setSelectedCustomer(customer)}
                    className={`border-b border-border last:border-b-0 cursor-pointer transition-colors ${selectedCustomer?.id === customer.id ? "bg-primary/5" : "hover:bg-secondary/50"}`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-accent">{customer.name || "—"}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {customer.phone || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {customer.acceptMarketing ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          ✓ Oui
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">
                          Non
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(customer.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Customer detail panel */}
          <div className="rounded-lg border border-border bg-card p-6">
            {selectedCustomer ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl mb-3">
                    {selectedCustomer.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <h2 className="font-serif text-xl font-medium text-accent">
                    {selectedCustomer.name || "Client sans nom"}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">📧</span>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                      <a href={`mailto:${selectedCustomer.email}`} className="text-primary hover:underline">
                        {selectedCustomer.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-lg">📱</span>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Téléphone</p>
                      {selectedCustomer.phone ? (
                        <a href={`tel:${selectedCustomer.phone}`} className="text-primary hover:underline">
                          {selectedCustomer.phone}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">Non renseigné</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-lg">📨</span>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Newsletter</p>
                      <p className={selectedCustomer.acceptMarketing ? "text-green-600" : "text-muted-foreground"}>
                        {selectedCustomer.acceptMarketing ? "Inscrit aux offres" : "Non inscrit"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-lg">📍</span>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Adresse de livraison</p>
                      {selectedCustomer.address?.street || selectedCustomer.address?.city ? (
                        <div className="text-accent">
                          {selectedCustomer.address.street && <p>{selectedCustomer.address.street}</p>}
                          <p>
                            {selectedCustomer.address.postalCode && `${selectedCustomer.address.postalCode} `}
                            {selectedCustomer.address.city}
                          </p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Non renseignée</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-lg">✅</span>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Profil</p>
                      <p className={selectedCustomer.profileComplete ? "text-green-600" : "text-orange-500"}>
                        {selectedCustomer.profileComplete ? "Complet" : "Incomplet"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-lg">📅</span>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Inscrit le</p>
                      <p className="text-accent">
                        {new Date(selectedCustomer.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>

                  {selectedCustomer.updatedAt && (
                    <div className="flex items-start gap-3">
                      <span className="text-lg">🔄</span>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Dernière mise à jour</p>
                        <p className="text-accent">
                          {new Date(selectedCustomer.updatedAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <a
                    href={`mailto:${selectedCustomer.email}`}
                    className="block w-full rounded-md bg-accent px-4 py-2.5 text-center text-sm font-medium text-accent-foreground hover:bg-accent/90"
                  >
                    📧 Envoyer un email
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <span className="text-4xl mb-3 block">👆</span>
                <p>Cliquez sur un client pour voir ses informations</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
