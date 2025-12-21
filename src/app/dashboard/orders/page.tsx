"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, where, orderBy, updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"

interface Order {
  id: string
  userId: string
  userEmail: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered"
  createdAt: string
}

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  preparing: "En préparation",
  ready: "Prête",
  delivered: "Livrée",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-purple-100 text-purple-700",
  ready: "bg-green-100 text-green-700",
  delivered: "bg-gray-100 text-gray-700",
}

export default function OrdersPage() {
  const { user, isAdmin } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [user, isAdmin])

  async function fetchOrders() {
    if (!user) return
    
    try {
      let q
      if (isAdmin) {
        q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
      } else {
        q = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("createdAt", "desc"))
      }
      
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order))
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(orderId: string, newStatus: string) {
    if (!isAdmin) return
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus })
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as Order["status"] } : o))
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-medium text-accent">
        {isAdmin ? "Toutes les commandes" : "Mes commandes"}
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <span className="text-6xl">📦</span>
          <h2 className="mt-4 font-serif text-xl font-medium text-accent">Aucune commande</h2>
          <p className="mt-2 text-muted-foreground">
            {isAdmin ? "Les commandes de vos clients apparaîtront ici." : "Vos commandes apparaîtront ici."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg font-medium text-accent">
                      Commande #{order.id.slice(0, 8)}
                    </span>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  {isAdmin && (
                    <p className="mt-1 text-sm text-muted-foreground">{order.userEmail}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-xl font-semibold text-accent">{order.total}€</p>
                  {isAdmin && (
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="mt-2 rounded-md border border-border bg-background px-2 py-1 text-sm"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="preparing">En préparation</option>
                      <option value="ready">Prête</option>
                      <option value="delivered">Livrée</option>
                    </select>
                  )}
                </div>
              </div>
              
              {order.items && order.items.length > 0 && (
                <div className="mt-4 border-t border-border pt-4">
                  <ul className="space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="text-muted-foreground">{item.price}€</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
