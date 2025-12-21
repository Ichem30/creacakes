"use client"

import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")

  return (
    <html lang="fr">
      <body className="min-h-screen">
        <AuthProvider>
          <CartProvider>
            {!isDashboard && <Navbar />}
            <main>
              {children}
            </main>
            {!isDashboard && <Footer />}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
