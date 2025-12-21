"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface Customer {
  id: string
  email: string
  name: string
  createdAt: string
}

export default function CustomersPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-medium text-accent">Clients</h1>

      {customers.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <span className="text-6xl">👥</span>
          <h2 className="mt-4 font-serif text-xl font-medium text-accent">Aucun client</h2>
          <p className="mt-2 text-muted-foreground">Les clients inscrits apparaîtront ici.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-border bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent">Nom</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent">Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 font-medium text-accent">{customer.name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(customer.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
