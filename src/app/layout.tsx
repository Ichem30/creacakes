import type { Metadata } from 'next'
import "./globals.css"
import { ClientLayout } from "@/components/client-layout"

export const metadata: Metadata = {
  title: "D&S Créa'Cakes - Pâtisserie Artisanale",
  description: "Créations sucrées sur mesure - Gâteaux personnalisés, wedding cakes, pâtisseries fines. Livraison Val-d'Oise et environs.",
  keywords: ["pâtisserie", "gâteau", "wedding cake", "Val-d'Oise", "artisanal", "sur mesure"],
  authors: [{ name: "D&S Créa'Cakes" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "D&S Créa'Cakes - Pâtisserie Artisanale",
    description: "Créations sucrées sur mesure - Gâteaux personnalisés, wedding cakes, pâtisseries fines.",
    url: "https://dscreacakes.fr",
    siteName: "D&S Créa'Cakes",
    locale: "fr_FR",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
