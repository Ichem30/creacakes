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

  // Create multiple repetitions for seamless loop
  const PromoItem = () => (
    <>
      <span className="mx-16 text-sm font-medium">{promo.text}</span>
      <span className="mx-8 text-sm opacity-70">✨</span>
    </>
  )

  return (
    <div className="bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground py-2.5 overflow-hidden relative">
      {/* Double the content for seamless loop */}
      <div className="flex animate-marquee-infinite">
        <div className="flex shrink-0">
          <PromoItem /><PromoItem /><PromoItem /><PromoItem /><PromoItem />
        </div>
        <div className="flex shrink-0">
          <PromoItem /><PromoItem /><PromoItem /><PromoItem /><PromoItem />
        </div>
      </div>
    </div>
  )
}
