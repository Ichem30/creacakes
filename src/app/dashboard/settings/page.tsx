"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SettingsPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard")
    }
  }, [isAdmin, router])

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-medium text-accent">Paramètres du site</h1>

      <div className="space-y-6">
        {/* Contact Info */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-serif text-xl font-medium text-accent">Informations de contact</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-accent">Email</label>
              <input
                type="email"
                defaultValue="contact@dscreacakes.fr"
                className="w-full rounded-md border border-border bg-background px-4 py-3"
                disabled
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-accent">Adresse</label>
              <input
                type="text"
                defaultValue="Paris et Île-de-France"
                className="w-full rounded-md border border-border bg-background px-4 py-3"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-serif text-xl font-medium text-accent">Réseaux sociaux</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-accent">Instagram</label>
              <input
                type="url"
                defaultValue="https://www.instagram.com/dscrea_cakes/"
                className="w-full rounded-md border border-border bg-background px-4 py-3"
                disabled
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-accent">TikTok</label>
              <input
                type="url"
                defaultValue="https://www.tiktok.com/@ds.creacakes"
                className="w-full rounded-md border border-border bg-background px-4 py-3"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="rounded-lg border border-primary/20 bg-secondary p-6 text-center">
          <span className="text-4xl">🚧</span>
          <h3 className="mt-2 font-serif text-lg font-medium text-accent">Bientôt disponible</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            L&apos;édition des paramètres sera disponible prochainement. Pour le moment, contactez le développeur pour modifier ces informations.
          </p>
        </div>
      </div>
    </div>
  )
}
