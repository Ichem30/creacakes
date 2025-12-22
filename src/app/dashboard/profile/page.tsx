"use client"

import { useEffect, useState } from "react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"

export default function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    acceptMarketing: false,
  })

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return
      
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid))
        if (docSnap.exists()) {
          const data = docSnap.data()
          setForm({
            name: data.name || "",
            phone: data.phone || "",
            acceptMarketing: data.acceptMarketing || false,
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile()
  }, [user])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    
    setSaving(true)
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: form.name,
        phone: form.phone,
        acceptMarketing: form.acceptMarketing,
        updatedAt: new Date().toISOString(),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Erreur lors de la mise à jour du profil")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-medium text-accent">👤 Mon Profil</h1>
      <p className="mb-8 text-muted-foreground">
        Gérez vos informations personnelles et préférences
      </p>

      <div className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (read-only) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-accent">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full rounded-md border border-border bg-secondary px-4 py-3 text-muted-foreground cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-muted-foreground">L&apos;email ne peut pas être modifié</p>
          </div>

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-accent">Nom complet</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Votre nom"
              className="w-full rounded-md border border-border bg-background px-4 py-3 focus:border-primary focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-accent">Téléphone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="06 XX XX XX XX"
              className="w-full rounded-md border border-border bg-background px-4 py-3 focus:border-primary focus:outline-none"
            />
          </div>

          {/* Newsletter preference */}
          <div className="rounded-lg border border-border bg-secondary/50 p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptMarketing"
                checked={form.acceptMarketing}
                onChange={(e) => setForm({ ...form, acceptMarketing: e.target.checked })}
                className="mt-1 h-5 w-5 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <label htmlFor="acceptMarketing" className="block font-medium text-accent cursor-pointer">
                  📧 Recevoir la newsletter
                </label>
                <p className="text-sm text-muted-foreground mt-1">
                  Recevez nos nouvelles créations, offres spéciales et informations exclusives par email.
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
            >
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
            
            {saved && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                ✓ Modifications enregistrées
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
