"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function NewProductPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  
  const [form, setForm] = useState({
    name: "",
    description: "",
    longDescription: "",
    price: "",
    category: "",
    servings: "",
    allergens: "",
    available: true,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const q = query(collection(db, "categories"), orderBy("name", "asc"))
      const snapshot = await getDocs(q)
      const cats = snapshot.docs.map(doc => doc.data().name as string)
      if (cats.length > 0) {
        setCategories(cats)
        setForm(f => ({ ...f, category: cats[0] }))
      } else {
        // Default categories if none exist
        const defaults = ["Mariage", "Anniversaire", "Classique", "Fruits", "Tartes"]
        setCategories(defaults)
        setForm(f => ({ ...f, category: defaults[0] }))
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      const defaults = ["Mariage", "Anniversaire", "Classique", "Fruits", "Tartes"]
      setCategories(defaults)
      setForm(f => ({ ...f, category: defaults[0] }))
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    try {
      await addDoc(collection(db, "categories"), { 
        name: newCategory.trim(),
        createdAt: new Date().toISOString()
      })
      setCategories([...categories, newCategory.trim()])
      setForm({ ...form, category: newCategory.trim() })
      setNewCategory("")
      setShowNewCategory(false)
    } catch (error) {
      console.error("Error adding category:", error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // Generate URL-friendly slug from product name
  function slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric with hyphens
      .replace(/^-+|-+$/g, '')         // Remove leading/trailing hyphens
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin) return
    setLoading(true)

    try {
      let imageUrl = ""
      
      if (imageFile) {
        const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`)
        await uploadBytes(imageRef, imageFile)
        imageUrl = await getDownloadURL(imageRef)
      }

      const slug = slugify(form.name)

      await addDoc(collection(db, "products"), {
        name: form.name,
        slug: slug,
        description: form.description,
        longDescription: form.longDescription,
        price: parseFloat(form.price),
        category: form.category,
        servings: form.servings,
        allergens: form.allergens.split(",").map(a => a.trim()).filter(Boolean),
        image: imageUrl,
        available: form.available,
        order: Date.now(),
        createdAt: new Date().toISOString(),
      })


      router.push("/dashboard/products")
    } catch (error) {
      console.error("Error creating product:", error)
      alert("Erreur lors de la création du produit")
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/products" className="text-sm text-muted-foreground hover:text-primary">
          ← Retour aux produits
        </Link>
        <h1 className="mt-2 font-serif text-3xl font-medium text-accent">Nouveau produit</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Image Upload */}
        <div>
          <label className="mb-2 block text-sm font-medium text-accent">Image du produit</label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <Image src={imagePreview} alt="Preview" width={100} height={100} className="h-24 w-24 rounded-lg object-cover" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary">
                <span className="text-2xl">🎂</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-muted-foreground"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-accent">Nom du produit *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-accent">Prix (€) *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-accent">Catégorie *</label>
            {showNewCategory ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nouvelle catégorie"
                  className="flex-1 rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  ✓
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(false)}
                  className="rounded-md border border-border px-4 py-2 text-sm"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="flex-1 rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
                  title="Ajouter une catégorie"
                >
                  ➕
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-accent">Portions</label>
            <input
              type="text"
              placeholder="ex: 8-10 personnes"
              value={form.servings}
              onChange={(e) => setForm({ ...form, servings: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-accent">Description courte *</label>
          <textarea
            required
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-accent">Description longue</label>
          <textarea
            rows={4}
            value={form.longDescription}
            onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-accent">Allergènes (séparés par des virgules)</label>
          <input
            type="text"
            placeholder="ex: Gluten, Lactose, Œufs"
            value={form.allergens}
            onChange={(e) => setForm({ ...form, allergens: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="available"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
            className="h-4 w-4 rounded border-border"
          />
          <label htmlFor="available" className="text-sm font-medium text-accent">
            Produit disponible à la vente
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer le produit"}
          </button>
          <Link
            href="/dashboard/products"
            className="rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
