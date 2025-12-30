"use client"

import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface PromoSettings {
  enabled: boolean
  text: string
}

export function PromoBanner() {
  const [promo, setPromo] = useState<PromoSettings | null>(null)

  useEffect(() => {
    async function fetchPromo() {
      try {
        const docSnap = await getDoc(doc(db, "settings", "promo"))
        if (docSnap.exists()) {
          setPromo(docSnap.data() as PromoSettings)
        }
      } catch {
        // Silently fail if no promo settings
      }
    }
    fetchPromo()
  }, [])

  if (!promo?.enabled || !promo?.text) return null

  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap">
        <span className="mx-8 text-sm font-medium">{promo.text}</span>
        <span className="mx-8 text-sm font-medium">✨</span>
        <span className="mx-8 text-sm font-medium">{promo.text}</span>
        <span className="mx-8 text-sm font-medium">✨</span>
        <span className="mx-8 text-sm font-medium">{promo.text}</span>
        <span className="mx-8 text-sm font-medium">✨</span>
        <span className="mx-8 text-sm font-medium">{promo.text}</span>
        <span className="mx-8 text-sm font-medium">✨</span>
      </div>
    </div>
  )
}
