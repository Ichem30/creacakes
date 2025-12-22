"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAdmin, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && pathname !== "/dashboard/login" && pathname !== "/dashboard/register") {
      router.push("/dashboard/login")
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (pathname === "/dashboard/login" || pathname === "/dashboard/register") {
    return <>{children}</>
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-20 items-center gap-3 border-b border-border px-6">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="h-10 w-10 object-contain" />
            <div className="flex flex-col">
              <span className="font-serif text-lg font-semibold text-accent">Mon Compte</span>
              {isAdmin && (
                <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">Admin</span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <Link 
              href="/dashboard" 
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${pathname === "/dashboard" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
            >
              <span>🏠</span> Accueil
            </Link>
            
            <Link 
              href="/dashboard/orders" 
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${pathname.startsWith("/dashboard/orders") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
            >
              <span>📦</span> {isAdmin ? "Toutes les commandes" : "Mes commandes"}
            </Link>
            
            <Link 
              href="/dashboard/quotes" 
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${pathname.startsWith("/dashboard/quotes") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
            >
              <span>📝</span> {isAdmin ? "Tous les devis" : "Mes devis"}
            </Link>

            {/* Admin Only Section */}
            {isAdmin && (
              <>
                <div className="my-4 border-t border-border pt-4">
                  <span className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Administration
                  </span>
                </div>
                
                <Link 
                  href="/dashboard/products" 
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${pathname.startsWith("/dashboard/products") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
                >
                  <span>🎂</span> Produits
                </Link>
                
                <Link 
                  href="/dashboard/categories" 
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${pathname.startsWith("/dashboard/categories") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
                >
                  <span>🏷️</span> Catégories
                </Link>
                
                <Link 
                  href="/dashboard/messages" 
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${pathname.startsWith("/dashboard/messages") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
                >
                  <span>📧</span> Messages contact
                </Link>
                
                <Link 
                  href="/dashboard/customers" 
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${pathname.startsWith("/dashboard/customers") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
                >
                  <span>👥</span> Clients
                </Link>
                
                <Link 
                  href="/dashboard/settings" 
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${pathname.startsWith("/dashboard/settings") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
                >
                  <span>⚙️</span> Paramètres du site
                </Link>
                
                <Link 
                  href="/dashboard/newsletter" 
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${pathname.startsWith("/dashboard/newsletter") ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
                >
                  <span>📨</span> Newsletter
                </Link>
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-2">
            <div className="px-4 py-2 text-sm text-muted-foreground">
              {user.email}
            </div>
            <Link 
              href="/dashboard/profile" 
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${pathname === "/dashboard/profile" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
            >
              <span>👤</span> Mon profil
            </Link>
            <Link href="/" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <span>🌐</span> Retour au site
            </Link>
            <button 
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
            >
              <span>🚪</span> Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
