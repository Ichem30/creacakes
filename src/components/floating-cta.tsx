"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  
  // Don't show on quote page or dashboard
  const shouldHide = pathname?.startsWith('/devis') || pathname?.startsWith('/dashboard')

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (shouldHide) return null

  return (
    <Link
      href="/devis"
      className={`fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-2xl shadow-primary/40 transition-all duration-500 hover:bg-primary/90 hover:scale-105 hover:shadow-primary/50 ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <span className="text-lg animate-bounce">✨</span>
      <span className="hidden sm:inline">Demander un devis gratuit</span>
      <span className="sm:hidden">Devis</span>
    </Link>
  )
}
