"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"

interface Category {
  id: string
  name: string
  order: number
}

export default function CategoriesPage() {
  const { isAdmin } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

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
      console.error("Error fetching categories:", error)
      // Try without orderBy if index doesn't exist
      try {
        const snapshot = await getDocs(collection(db, "categories"))
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Category))
        setCategories(data)
      } catch (e) {
        console.error("Fallback error:", e)
      }
    } finally {
      setLoading(false)
    }
  }

  async function addCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!newCategory.trim() || !isAdmin) return

    setAdding(true)
    try {
      await addDoc(collection(db, "categories"), {
        name: newCategory.trim(),
        order: categories.length,
        createdAt: new Date().toISOString(),
      })
      setNewCategory("")
      fetchCategories()
    } catch (error) {
      console.error("Error adding category:", error)
      alert("Erreur lors de l'ajout")
    } finally {
      setAdding(false)
    }
  }

  async function deleteCategory(id: string, name: string) {
    if (!isAdmin) return
    if (!confirm(`Supprimer la catégorie "${name}" ?`)) return

    try {
      await deleteDoc(doc(db, "categories", id))
      setCategories(categories.filter(c => c.id !== id))
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("Erreur lors de la suppression")
    }
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Accès réservé aux administrateurs</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-medium text-accent">🏷️ Catégories</h1>
      <p className="mb-8 text-muted-foreground">
        Gérez les catégories de vos produits
      </p>

      {/* Add Category Form */}
      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 font-serif text-xl font-medium text-accent">Ajouter une catégorie</h2>
        <form onSubmit={addCategory} className="flex gap-3">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nom de la catégorie"
            className="flex-1 rounded-md border border-border bg-background px-4 py-3 focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={adding || !newCategory.trim()}
            className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
          >
            {adding ? "..." : "Ajouter"}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 font-serif text-xl font-medium text-accent">
          Catégories existantes ({categories.length})
        </h2>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Chargement...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <span className="text-4xl">📂</span>
            <p className="mt-2">Aucune catégorie</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary p-4"
              >
                <span className="font-medium text-accent">{category.name}</span>
                <button
                  onClick={() => deleteCategory(category.id, category.name)}
                  className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-200"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 rounded-lg border border-primary/20 bg-secondary p-4 text-sm text-muted-foreground">
        💡 Les catégories apparaissent automatiquement sur la page "Nos Gâteaux" et dans le formulaire de création de produit.
      </div>
    </div>
  )
}
