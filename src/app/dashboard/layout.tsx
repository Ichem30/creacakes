"use client"

import { useEffect, useState } from "react"
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user && pathname !== "/dashboard/login" && pathname !== "/dashboard/register") {
      router.push("/dashboard/login")
    }
  }, [user, loading, pathname, router])

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

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

  const navLinks = [
    { href: "/dashboard", label: "Accueil", icon: "🏠", exact: true },
    { href: "/dashboard/orders", label: isAdmin ? "Commandes" : "Mes commandes", icon: "📦" },
    { href: "/dashboard/deviss", label: isAdmin ? "Devis" : "Mes devis", icon: "📝" },
  ]

  const adminLinks = isAdmin ? [
    { href: "/dashboard/nos-creations", label: "Produits", icon: "🎂" },
    { href: "/dashboard/categories", label: "Catégories", icon: "🏷️" },
    { href: "/dashboard/messages", label: "Messages", icon: "📧" },
    { href: "/dashboard/customers", label: "Clients", icon: "👥" },
    { href: "/dashboard/settings", label: "Paramètres", icon: "⚙️" },
    { href: "/dashboard/newsletter", label: "Newsletter", icon: "📨" },
  ] : []

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="h-8 w-8 object-contain" />
          <span className="font-serif text-lg font-semibold text-accent">Dashboard</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-secondary"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Backdrop */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 z-50 h-screen w-72 border-r border-border bg-card
        transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:w-64
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
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
            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden ml-auto flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary"
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(link.href, link.exact) 
                    ? "bg-primary/10 text-primary" 
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <span>{link.icon}</span> {link.label}
              </Link>
            ))}

            {/* Admin Only Section */}
            {isAdmin && adminLinks.length > 0 && (
              <>
                <div className="my-4 border-t border-border pt-4">
                  <span className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Administration
                  </span>
                </div>
                
                {adminLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(link.href) 
                        ? "bg-primary/10 text-primary" 
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <span>{link.icon}</span> {link.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-2">
            <div className="px-4 py-2 text-sm text-muted-foreground truncate">
              {user.email}
            </div>
            <Link 
              href="/dashboard/profile" 
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                pathname === "/dashboard/profile" 
                  ? "bg-primary/10 text-primary" 
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <span>👤</span> Mon profil
            </Link>
            <Link 
              href="/" 
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
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
      <main className="flex-1 pt-16 md:pt-0 md:ml-64">
        <div className="p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
