"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface SiteSettings {
  showUnavailableProducts: boolean
}

interface PromoSettings {
  enabled: boolean
  text: string
}

const defaultSettings: SiteSettings = {
  showUnavailableProducts: true
}

const defaultPromo: PromoSettings = {
  enabled: false,
  text: ""
}

export default function SettingsPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [promo, setPromo] = useState<PromoSettings>(defaultPromo)
  const [promoText, setPromoText] = useState("")
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard")
      return
    }
    loadSettings()
  }, [isAdmin, router])

  async function loadSettings() {
    try {
      const [siteDoc, promoDoc] = await Promise.all([
        getDoc(doc(db, "settings", "site")),
        getDoc(doc(db, "settings", "promo"))
      ])
      
      if (siteDoc.exists()) {
        setSettings({ ...defaultSettings, ...siteDoc.data() } as SiteSettings)
      }
      
      if (promoDoc.exists()) {
        const promoData = promoDoc.data() as PromoSettings
        setPromo(promoData)
        setPromoText(promoData.text || "")
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    } finally {
      setLoaded(true)
    }
  }

  async function saveSettings(newSettings: SiteSettings) {
    setSaving(true)
    try {
      await setDoc(doc(db, "settings", "site"), newSettings)
      setSettings(newSettings)
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  async function savePromo(enabled: boolean, text?: string) {
    setSaving(true)
    try {
      const newPromo = {
        enabled,
        text: text ?? promo.text
      }
      await setDoc(doc(db, "settings", "promo"), newPromo)
      setPromo(newPromo)
    } catch (error) {
      console.error("Error saving promo:", error)
      alert("Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  function handleToggle(key: keyof SiteSettings) {
    const newSettings = { ...settings, [key]: !settings[key] }
    saveSettings(newSettings)
  }

  function handlePromoToggle() {
    savePromo(!promo.enabled)
  }

  function handlePromoTextSave() {
    savePromo(promo.enabled, promoText)
  }

  if (!loaded) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-medium text-accent">Paramètres du site</h1>

      <div className="space-y-6">
        {/* Promo Banner */}
        <div className="rounded-lg border border-primary bg-primary/5 p-6">
          <h2 className="mb-4 font-serif text-xl font-medium text-accent">📢 Banderole promotionnelle</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-medium text-accent">Activer la banderole</span>
                <p className="text-sm text-muted-foreground">
                  Affiche un message défilant en haut de la page d&apos;accueil
                </p>
              </div>
              <button
                onClick={handlePromoToggle}
                disabled={saving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  promo.enabled ? "bg-primary" : "bg-border"
                } ${saving ? "opacity-50" : ""}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    promo.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>

            <div>
              <label className="mb-2 block text-sm font-medium text-accent">Texte de la banderole</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoText}
                  onChange={(e) => setPromoText(e.target.value)}
                  placeholder="Ex: 🎄 -10% sur toutes les bûches de Noël jusqu'au 25 décembre !"
                  className="flex-1 rounded-md border border-border bg-background px-4 py-3 focus:border-primary focus:outline-none"
                />
                <button
                  onClick={handlePromoTextSave}
                  disabled={saving || promoText === promo.text}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
                >
                  {saving ? "..." : "Enregistrer"}
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Le texte défilera de droite à gauche en boucle
              </p>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-serif text-xl font-medium text-accent">🛒 Affichage des produits</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-medium text-accent">Afficher les produits indisponibles</span>
                <p className="text-sm text-muted-foreground">
                  {settings.showUnavailableProducts 
                    ? "Les produits marqués 'non disponible' apparaîtront avec le badge 'Sur commande'" 
                    : "Les produits marqués 'non disponible' seront cachés du site public"}
                </p>
              </div>
              <button
                onClick={() => handleToggle("showUnavailableProducts")}
                disabled={saving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  settings.showUnavailableProducts ? "bg-primary" : "bg-border"
                } ${saving ? "opacity-50" : ""}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    settings.showUnavailableProducts ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>
        </div>

        {/* Contact Info */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-serif text-xl font-medium text-accent">📍 Informations de contact</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-accent">Email</label>
              <input
                type="email"
                defaultValue="contact@dscreacakes.fr"
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-muted-foreground"
                disabled
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-accent">Adresse</label>
              <input
                type="text"
                defaultValue="Val-d'Oise (95) et environs"
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-muted-foreground"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-serif text-xl font-medium text-accent">📱 Réseaux sociaux</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-accent">Instagram</label>
              <input
                type="url"
                defaultValue="https://www.instagram.com/ds_creacakes/"
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-muted-foreground"
                disabled
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-accent">TikTok</label>
              <input
                type="url"
                defaultValue="https://www.tiktok.com/@ds.creacakes"
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-muted-foreground"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="rounded-lg border border-primary/20 bg-secondary p-4 text-sm text-muted-foreground">
          💡 Les modifications des informations de contact et réseaux sociaux seront bientôt disponibles.
        </div>
      </div>
    </div>
  )
}
