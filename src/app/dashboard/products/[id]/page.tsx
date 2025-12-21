"use client"

import { useEffect, useState } from "react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

const categories = ["Mariage", "Anniversaire", "Classique", "Fruits", "Tartes", "Custom"]

export default function EditProductPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  
  const [form, setForm] = useState({
    name: "",
    description: "",
    longDescription: "",
    price: "",
    category: "Classique",
    servings: "",
    allergens: "",
    available: true,
    image: "",
  })

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard")
      return
    }
    fetchProduct()
  }, [isAdmin, productId, router])

  async function fetchProduct() {
    try {
      const docRef = doc(db, "products", productId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setForm({
          name: data.name || "",
          description: data.description || "",
          longDescription: data.longDescription || "",
          price: data.price?.toString() || "",
          category: data.category || "Classique",
          servings: data.servings || "",
          allergens: Array.isArray(data.allergens) ? data.allergens.join(", ") : "",
          available: data.available ?? true,
          image: data.image || "",
        })
        setImagePreview(data.image || null)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin) return
    setSaving(true)

    try {
      let imageUrl = form.image
      
      if (imageFile) {
        const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`)
        await uploadBytes(imageRef, imageFile)
        imageUrl = await getDownloadURL(imageRef)
      }

      await updateDoc(doc(db, "products", productId), {
        name: form.name,
        description: form.description,
        longDescription: form.longDescription,
        price: parseFloat(form.price),
        category: form.category,
        servings: form.servings,
        allergens: form.allergens.split(",").map(a => a.trim()).filter(Boolean),
        image: imageUrl,
        available: form.available,
        updatedAt: new Date().toISOString(),
      })

      router.push("/dashboard/products")
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Erreur lors de la mise à jour du produit")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/products" className="text-sm text-muted-foreground hover:text-primary">
          ← Retour aux produits
        </Link>
        <h1 className="mt-2 font-serif text-3xl font-medium text-accent">Modifier le produit</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
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
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
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
            disabled={saving}
            className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
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
