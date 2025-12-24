"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function CompleterProfilPage() {
  const { user, userProfile, loading, refreshUserProfile } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    acceptMarketing: false,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
    
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        phone: userProfile.phone || "",
        street: userProfile.address?.street || "",
        city: userProfile.address?.city || "",
        postalCode: userProfile.address?.postalCode || "",
        acceptMarketing: userProfile.acceptMarketing || false,
      })
    }
  }, [user, userProfile, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    // Validation
    if (!formData.name.trim()) {
      setError("Le nom est requis")
      return
    }
    if (!formData.phone.trim()) {
      setError("Le numéro de téléphone est requis")
      return
    }
    
    setSaving(true)
    setError("")
    
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        acceptMarketing: formData.acceptMarketing,
        profileComplete: true,
        updatedAt: new Date().toISOString(),
      })
      
      await refreshUserProfile()
      router.push("/")
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl bg-card p-8 shadow-xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 font-serif text-3xl font-medium text-accent">
                Bienvenue chez D&S Créa&apos;Cakes ! 🍰
              </h1>
              <p className="text-muted-foreground">
                Complétez votre profil pour profiter de toutes nos fonctionnalités
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg bg-red-100 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Email (read-only) */}
              <div>
                <label className="mb-2 block text-sm font-medium text-accent">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-muted-foreground cursor-not-allowed"
                />
              </div>

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-accent">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Marie Dupont"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-accent placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-accent">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="06 12 34 56 78"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-accent placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Pour vous contacter concernant vos commandes
                </p>
              </div>

              {/* Address section */}
              <div className="space-y-4">
                <h3 className="font-medium text-accent">Adresse de livraison (optionnel)</h3>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-accent">
                    Rue et numéro
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="12 rue des Pâtissiers"
                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-accent placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-accent">
                      Code postal
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="95000"
                      maxLength={5}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-accent placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-accent">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Cergy"
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-accent placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              {/* Marketing consent */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptMarketing"
                  checked={formData.acceptMarketing}
                  onChange={(e) => setFormData({ ...formData, acceptMarketing: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="acceptMarketing" className="text-sm text-muted-foreground">
                  J&apos;accepte de recevoir des offres et nouveautés par email
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Enregistrement..." : "Terminer l'inscription"}
              </button>

              {/* Skip link */}
              <div className="text-center">
                <Link 
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Compléter plus tard
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
