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
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo.png" alt="D&S Créa'Cakes" width={60} height={60} className="h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-110" />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-accent transition-colors duration-300 group-hover:text-primary">D&S Créa&apos;Cakes</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Pâtisserie Fine</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden items-center gap-8 lg:flex">
            <li>
              <Link href="/" className="underline-animation text-sm font-medium text-foreground transition-colors hover:text-primary py-2">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/products" className="underline-animation text-sm font-medium text-foreground transition-colors hover:text-primary py-2">
                Nos Gâteaux
              </Link>
            </li>
            <li>
              <Link href="/about" className="underline-animation text-sm font-medium text-foreground transition-colors hover:text-primary py-2">
                À Propos
              </Link>
            </li>
            <li>
              <Link href="/contact" className="underline-animation text-sm font-medium text-foreground transition-colors hover:text-primary py-2">
                Contact
              </Link>
            </li>
            <li className="border-l border-border pl-8">
              {loading ? (
                <span className="text-sm text-muted-foreground animate-pulse-soft">...</span>
              ) : user ? (
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-foreground transition-all duration-300 hover:text-primary group">
                  <span className="transition-transform duration-300 group-hover:scale-110">👤</span> Mon Compte
                </Link>
              ) : (
                <Link href="/dashboard/login" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                  Connexion
                </Link>
              )}
            </li>
            <li>
              <Link 
                href="/cart" 
                className="relative inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-all duration-300 hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 group"
              >
                <span className="transition-transform duration-300 group-hover:scale-110">🛒</span> Panier
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground animate-scale-in shadow-md">
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 lg:hidden">
            <Link href="/cart" className="relative group">
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110 inline-block">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground animate-scale-in shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-3 rotate-45' : 'top-1'}`} />
                <span className={`absolute left-0 top-3 w-6 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'}`} />
                <span className={`absolute left-0 w-6 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-3 -rotate-45' : 'top-5'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`border-t border-border bg-background lg:hidden overflow-hidden transition-all duration-300 ease-out ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <ul className="space-y-1">
            <li>
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-4 py-3 text-lg font-medium text-foreground hover:bg-secondary hover:text-primary transition-all duration-200"
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link 
                href="/products" 
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-4 py-3 text-lg font-medium text-foreground hover:bg-secondary hover:text-primary transition-all duration-200"
              >
                Nos Gâteaux
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-4 py-3 text-lg font-medium text-foreground hover:bg-secondary hover:text-primary transition-all duration-200"
              >
                À Propos
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-4 py-3 text-lg font-medium text-foreground hover:bg-secondary hover:text-primary transition-all duration-200"
              >
                Contact
              </Link>
            </li>
            <li className="border-t border-border pt-4 mt-4">
              {user ? (
                <Link 
                  href="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-lg font-medium text-foreground hover:bg-secondary hover:text-primary transition-all duration-200"
                >
                  <span>👤</span> Mon Compte
                </Link>
              ) : (
                <Link 
                  href="/dashboard/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 text-lg font-medium text-primary hover:bg-secondary transition-all duration-200"
                >
                  Connexion / Inscription
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

