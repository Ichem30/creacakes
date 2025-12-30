"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  available: boolean
  order: number
  promo?: {
    enabled: boolean
    discountPercent: number
    endDate: string
  }
}

export default function ProductsPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard")
      return
    }
    fetchProducts()
  }, [isAdmin, router])

  async function fetchProducts() {
    try {
      const q = query(collection(db, "products"), orderBy("order", "asc"))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product))
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce produit ?")) return
    try {
      await deleteDoc(doc(db, "products", id))
      setProducts(products.filter(p => p.id !== id))
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium text-accent">Produits</h1>
          <p className="text-muted-foreground">{products.length} produits</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
        >
          ➕ Ajouter un produit
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <span className="text-6xl">🎂</span>
          <h2 className="mt-4 font-serif text-xl font-medium text-accent">Aucun produit</h2>
          <p className="mt-2 text-muted-foreground">Commencez par ajouter votre premier gâteau !</p>
          <Link
            href="/dashboard/products/new"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
          >
            ➕ Ajouter un produit
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-border bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent">Image</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent">Nom</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent">Catégorie</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent">Prix</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-accent">Statut</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-accent">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">
                    <Image
                      src={product.image || "/placeholder.jpg"}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-accent">{product.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-accent">{product.price}€</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${product.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {product.available ? "Disponible" : "Indisponible"}
                      </span>
                      {product.promo?.enabled && new Date(product.promo.endDate) > new Date() && (
                        <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
                          🏷️ -{product.promo.discountPercent}%
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="mr-2 text-sm text-primary hover:underline"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Supprimer
                    </button>
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
