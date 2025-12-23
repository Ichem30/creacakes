"use client"

import { usePathname } from "next/navigation"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingCTA } from "@/components/floating-cta"
import { WelcomeModal } from "@/components/welcome-modal"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")

  return (
    <AuthProvider>
      <CartProvider>
        {!isDashboard && <Navbar />}
        <main>
          {children}
        </main>
        {!isDashboard && <Footer />}
        {!isDashboard && <FloatingCTA />}
        <WelcomeModal />
      </CartProvider>
    </AuthProvider>
  )
}
