"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"

export function Navbar() {
  const { user, loading } = useAuth()
  const { totalItems } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="D&S Créa'Cakes" width={60} height={60} className="h-14 w-14 object-contain" />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-accent">D&S Créa&apos;Cakes</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Pâtisserie Fine</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden items-center gap-6 lg:flex">
            <li>
              <Link href="/" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                Nos Gâteaux
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                À Propos
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                Contact
              </Link>
            </li>
            <li className="border-l border-border pl-6">
              {loading ? (
                <span className="text-sm text-muted-foreground">...</span>
              ) : user ? (
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary">
                  <span>👤</span> Mon Compte
                </Link>
              ) : (
                <Link href="/dashboard/login" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                  Connexion
                </Link>
              )}
            </li>
            <li>
              <Link href="/cart" className="relative inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90">
                🛒 Panier
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 lg:hidden">
            <Link href="/cart" className="relative">
              <span className="text-2xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container mx-auto px-4 py-4">
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-foreground"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-foreground"
                >
                  Nos Gâteaux
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-foreground"
                >
                  À Propos
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-foreground"
                >
                  Contact
                </Link>
              </li>
              <li className="border-t border-border pt-4">
                {user ? (
                  <Link 
                    href="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-lg font-medium text-foreground"
                  >
                    <span>👤</span> Mon Compte
                  </Link>
                ) : (
                  <Link 
                    href="/dashboard/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-lg font-medium text-primary"
                  >
                    Connexion / Inscription
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  )
}
