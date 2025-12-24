"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { CustomSelect } from "@/components/custom-select"
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
  const [priceVariants, setPriceVariants] = useState<{label: string, price: string}[]>([
    { label: "", price: "" }
  ])
  const [flavors, setFlavors] = useState<string[]>([""])
  
  const [form, setForm] = useState({
    name: "",
    description: "",
    longDescription: "",
    category: "",
    allergens: "",
    available: true,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      // Load all categories without orderBy to catch all documents
      const snapshot = await getDocs(collection(db, "categories"))
      const cats = snapshot.docs.map(doc => doc.data().name as string).filter(Boolean)
      cats.sort((a, b) => a.localeCompare(b))
      setCategories(cats)
      if (cats.length > 0) {
        setForm(f => ({ ...f, category: cats[0] }))
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
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

  // Price variants handlers
  const addPriceVariant = () => {
    setPriceVariants([...priceVariants, { label: "", price: "" }])
  }

  const removePriceVariant = (index: number) => {
    if (priceVariants.length > 1) {
      setPriceVariants(priceVariants.filter((_, i) => i !== index))
    }
  }

  const updatePriceVariant = (index: number, field: 'label' | 'price', value: string) => {
    const updated = [...priceVariants]
    updated[index][field] = value
    setPriceVariants(updated)
  }

  // Flavor handlers
  const addFlavor = () => {
    setFlavors([...flavors, ""])
  }

  const removeFlavor = (index: number) => {
    if (flavors.length > 1) {
      setFlavors(flavors.filter((_, i) => i !== index))
    }
  }

  const updateFlavor = (index: number, value: string) => {
    const updated = [...flavors]
    updated[index] = value
    setFlavors(updated)
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
    
    // Validate at least one price variant
    const validVariants = priceVariants.filter(v => v.label.trim() && v.price.trim())
    if (validVariants.length === 0) {
      alert("Veuillez ajouter au moins une variante de prix")
      return
    }
    
    setLoading(true)

    try {
      let imageUrl = ""
      
      if (imageFile) {
        const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`)
        await uploadBytes(imageRef, imageFile)
        imageUrl = await getDownloadURL(imageRef)
      }

      const slug = slugify(form.name)
      
      // Format price variants
      const formattedVariants = validVariants.map(v => ({
        label: v.label.trim(),
        price: parseFloat(v.price)
      }))
      
      // Get minimum price for display
      const minPrice = Math.min(...formattedVariants.map(v => v.price))
      
      // Filter valid flavors
      const validFlavors = flavors.map(f => f.trim()).filter(Boolean)

      await addDoc(collection(db, "products"), {
        name: form.name,
        slug: slug,
        description: form.description,
        longDescription: form.longDescription,
        price: minPrice, // Keep for backward compatibility
        priceVariants: formattedVariants,
        flavors: validFlavors,
        category: form.category,
        allergens: form.allergens.split(",").map(a => a.trim()).filter(Boolean),
        image: imageUrl,
        available: form.available,
        order: Date.now(),
        createdAt: new Date().toISOString(),
      })


      router.push("/dashboard/nos-creations")
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
        <Link href="/dashboard/nos-creations" className="text-sm text-muted-foreground hover:text-primary">
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

        {/* Price Variants */}
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-accent">Tailles / Prix *</label>
            <button
              type="button"
              onClick={addPriceVariant}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              + Ajouter une taille
            </button>
          </div>
          <div className="space-y-3">
            {priceVariants.map((variant, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="ex: 6 personnes"
                  value={variant.label}
                  onChange={(e) => updatePriceVariant(index, 'label', e.target.value)}
                  className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    placeholder="Prix"
                    min="0"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) => updatePriceVariant(index, 'price', e.target.value)}
                    className="w-24 rounded-md border border-border bg-background px-3 py-2.5 text-foreground focus:border-primary focus:outline-none"
                  />
                  <span className="text-muted-foreground">€</span>
                </div>
                {priceVariants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePriceVariant(index)}
                    className="text-red-500 hover:text-red-600 px-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            💡 Ex: "6 personnes" = 30€, "10 personnes" = 50€, "15 personnes" = 70€
          </p>
        </div>

        {/* Flavors */}
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-accent">Saveurs disponibles</label>
            <button
              type="button"
              onClick={addFlavor}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              + Ajouter une saveur
            </button>
          </div>
          <div className="space-y-3">
            {flavors.map((flavor, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="ex: Chocolat, Vanille, Fraise..."
                  value={flavor}
                  onChange={(e) => updateFlavor(index, e.target.value)}
                  className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                />
                {flavors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFlavor(index)}
                    className="text-red-500 hover:text-red-600 px-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            💡 Laissez vide si le produit n'a qu'une seule saveur
          </p>
        </div>

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
              <div className="flex-1">
                <CustomSelect
                  options={
                    categories.length === 0 
                      ? [{ value: "", label: "Aucune catégorie - créez-en une" }]
                      : categories.map(cat => ({ value: cat, label: cat }))
                  }
                  value={form.category}
                  onChange={(value) => setForm({ ...form, category: value })}
                  placeholder="Sélectionnez une catégorie"
                />
              </div>
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
            href="/dashboard/nos-creations"
            className="rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
