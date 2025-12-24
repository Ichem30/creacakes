"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

interface Stats {
  orders: number
  quotes: number
  products?: number
  customers?: number
}

export default function DashboardHome() {
  const { user, isAdmin } = useAuth()
  const [stats, setStats] = useState<Stats>({ orders: 0, quotes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (!user) return

      try {
        if (isAdmin) {
          // Admin sees all
          const [ordersSnap, quotesSnap, productsSnap, usersSnap] = await Promise.all([
            getDocs(collection(db, "orders")),
            getDocs(collection(db, "quotes")),
            getDocs(collection(db, "products")),
            getDocs(collection(db, "users")),
          ])

          setStats({
            orders: ordersSnap.size,
            quotes: quotesSnap.size,
            products: productsSnap.size,
            customers: usersSnap.size,
          })
        } else {
          // User sees only their own
          const [ordersSnap, quotesSnap] = await Promise.all([
            getDocs(query(collection(db, "orders"), where("userId", "==", user.uid))),
            getDocs(query(collection(db, "quotes"), where("userId", "==", user.uid))),
          ])

          setStats({
            orders: ordersSnap.size,
            quotes: quotesSnap.size,
          })
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user, isAdmin])

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-medium text-accent">
        {isAdmin ? "Tableau de bord Admin" : "Mon Espace"}
      </h1>
      <p className="mb-8 text-muted-foreground">
        {isAdmin ? "Gérez votre boutique et vos commandes" : "Suivez vos commandes et devis"}
      </p>

      {/* Stats Cards */}
      <div className={`mb-8 grid gap-6 ${isAdmin ? "md:grid-cols-4" : "md:grid-cols-2"}`}>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl">📦</span>
            <div>
              <p className="text-sm text-muted-foreground">{isAdmin ? "Commandes totales" : "Mes commandes"}</p>
              <p className="font-serif text-3xl font-semibold text-accent">
                {loading ? "..." : stats.orders}
              </p>
            </div>
          </div>
          <Link href="/dashboard/orders" className="mt-4 block text-sm text-primary hover:underline">
            Voir les commandes →
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl">📝</span>
            <div>
              <p className="text-sm text-muted-foreground">{isAdmin ? "Demandes de devis" : "Mes devis"}</p>
              <p className="font-serif text-3xl font-semibold text-accent">
                {loading ? "..." : stats.quotes}
              </p>
            </div>
          </div>
          <Link href="/dashboard/deviss" className="mt-4 block text-sm text-primary hover:underline">
            Voir les devis →
          </Link>
        </div>

        {isAdmin && (
          <>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🎂</span>
                <div>
                  <p className="text-sm text-muted-foreground">Produits</p>
                  <p className="font-serif text-3xl font-semibold text-accent">
                    {loading ? "..." : stats.products}
                  </p>
                </div>
              </div>
              <Link href="/dashboard/nos-creations" className="mt-4 block text-sm text-primary hover:underline">
                Gérer les produits →
              </Link>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">👥</span>
                <div>
                  <p className="text-sm text-muted-foreground">Clients</p>
                  <p className="font-serif text-3xl font-semibold text-accent">
                    {loading ? "..." : stats.customers}
                  </p>
                </div>
              </div>
              <Link href="/dashboard/customers" className="mt-4 block text-sm text-primary hover:underline">
                Voir les clients →
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 font-serif text-xl font-medium text-accent">Actions rapides</h2>
        <div className="flex flex-wrap gap-4">
          {isAdmin ? (
            <>
              <Link 
                href="/dashboard/nos-creations/new"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
              >
                ➕ Ajouter un produit
              </Link>
              <Link 
                href="/dashboard/orders"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                📦 Nouvelles commandes
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/nos-creations"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
              >
                🎂 Commander un gâteau
              </Link>
              <Link 
                href="/devis"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                📝 Demander un devis
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
