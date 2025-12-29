import type { Metadata } from 'next'
import "./globals.css"
import { ClientLayout } from "@/components/client-layout"
import { GoogleAnalytics } from "@/components/google-analytics"
import { StructuredData } from "@/components/structured-data"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "D&S Créa'Cakes - Pâtisserie Artisanale sur Mesure | Val-d'Oise",
  description: "Pâtissière indépendante spécialisée dans les créations sucrées sur mesure : wedding cakes, bento cakes, layer cakes, gâteaux d'anniversaire. Livraison Val-d'Oise et Île-de-France.",
  keywords: ["pâtisserie", "gâteau", "wedding cake", "bento cake", "layer cake", "Val-d'Oise", "artisanal", "sur mesure", "livraison"],
  authors: [{ name: "D&S Créa'Cakes" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "D&S Créa'Cakes - Pâtisserie Artisanale sur Mesure | Val-d'Oise",
    description: "Pâtissière indépendante créant des gâteaux uniques : wedding cakes, bento cakes, layer cakes, number cakes et gâteaux d'anniversaire personnalisés. Livraison Val-d'Oise et Île-de-France.",
    url: "https://dscreacakes.fr",
    siteName: "D&S Créa'Cakes",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://dscreacakes.fr/logo.png",
        width: 800,
        height: 600,
        alt: "D&S Créa'Cakes - Pâtisserie Artisanale sur Mesure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "D&S Créa'Cakes - Pâtisserie Artisanale sur Mesure | Val-d'Oise",
    description: "Pâtissière indépendante créant des gâteaux uniques : wedding cakes, bento cakes, layer cakes et gâteaux personnalisés. Livraison Val-d'Oise.",
    images: ["https://dscreacakes.fr/logo.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <StructuredData />
      </head>
      <body className="min-h-screen">
        <GoogleAnalytics />
        <SpeedInsights />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
