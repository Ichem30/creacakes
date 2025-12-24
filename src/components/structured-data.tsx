export function StructuredData() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "@id": "https://dscreacakes.fr",
    "name": "D&S Créa'Cakes",
    "description": "Pâtisserie artisanale spécialisée dans les créations sur mesure : gâteaux personnalisés, wedding cakes, number cakes et pâtisseries fines. Livraison Val-d'Oise et Île-de-France.",
    "url": "https://dscreacakes.fr",
    "logo": "https://dscreacakes.fr/logo.png",
    "image": "https://dscreacakes.fr/logo.png",
    "telephone": "+33600000000", // À remplacer par le vrai numéro
    "email": "contact@dscreacakes.fr",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Val-d'Oise",
      "addressRegion": "Île-de-France",
      "addressCountry": "FR"
    },
    "areaServed": [
      {
        "@type": "State",
        "name": "Île-de-France"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Val-d'Oise (95)"
      }
    ],
    "priceRange": "€€",
    "servesCuisine": "Pâtisserie française",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Nos créations",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Wedding Cake",
            "description": "Gâteau de mariage sur mesure"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Number Cake",
            "description": "Gâteau en forme de chiffre ou lettre"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Gâteau personnalisé",
            "description": "Création unique pour anniversaires et événements"
          }
        }
      ]
    },
    "sameAs": [
      "https://www.instagram.com/dscreacakes" // À remplacer si Instagram existe
    ]
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "D&S Créa'Cakes",
    "url": "https://dscreacakes.fr",
    "description": "Pâtisserie artisanale - Créations sur mesure",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://dscreacakes.fr/products?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://dscreacakes.fr"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Nos créations",
        "item": "https://dscreacakes.fr/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Demander un devis",
        "item": "https://dscreacakes.fr/quote"
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  )
}
