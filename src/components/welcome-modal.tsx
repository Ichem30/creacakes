"use client"

import { useState, useEffect } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"

export function WelcomeModal() {
  const { user } = useAuth()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if this is a new user who hasn't seen the modal
    if (user) {
      const hasSeenModal = localStorage.getItem(`welcome_modal_${user.uid}`)
      if (!hasSeenModal) {
        // Small delay for smooth appearance
        setTimeout(() => setShow(true), 500)
      }
    }
  }, [user])

  const handleChoice = async (acceptNewsletter: boolean) => {
    if (!user) return
    
    setLoading(true)
    try {
      // Update user preferences in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        acceptMarketing: acceptNewsletter,
        welcomeModalSeen: true,
        updatedAt: new Date().toISOString(),
      })
      
      // Mark modal as seen in localStorage
      localStorage.setItem(`welcome_modal_${user.uid}`, "true")
      setShow(false)
    } catch (error) {
      console.error("Error updating preferences:", error)
      // Still close modal even on error
      localStorage.setItem(`welcome_modal_${user.uid}`, "true")
      setShow(false)
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={() => handleChoice(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-white to-secondary/30 p-8 shadow-2xl animate-scale-in">
        {/* Decorative elements */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl">
          🍰
        </div>
        
        {/* Content */}
        <div className="text-center pt-4">
          <h2 className="mt-4 font-serif text-2xl font-medium text-accent">
            Bienvenue chez D&S Créa&apos;Cakes !
          </h2>
          
          <p className="mt-4 text-muted-foreground">
            Nous sommes ravis de vous accueillir ! 🎂
          </p>
          
          <div className="mt-6 rounded-xl bg-primary/10 p-4 border border-primary/20">
            <p className="text-sm font-medium text-accent">
              📧 Souhaitez-vous recevoir notre newsletter ?
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Recevez nos nouvelles créations, offres exclusives et inspirations gourmandes directement dans votre boîte mail.
            </p>
          </div>
          
          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => handleChoice(true)}
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 px-6 font-medium text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? "..." : "✨ Oui, je m'inscris !"}
            </button>
            
            <button
              onClick={() => handleChoice(false)}
              disabled={loading}
              className="w-full rounded-xl border border-border bg-white py-3 px-6 font-medium text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-accent disabled:opacity-50"
            >
              Non merci, peut-être plus tard
            </button>
          </div>
          
          <p className="mt-4 text-xs text-muted-foreground">
            Vous pourrez modifier ce choix à tout moment dans votre profil.
          </p>
        </div>
      </div>
    </div>
  )
}
