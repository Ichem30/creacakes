export function StructuredData() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "@id": "https://dscreacakes.fr",
    "name": "D&S Créa'Cakes",
    "description": "Pâtisserie artisanale spécialisée dans les créations sur mesure : gâteaux personnalisés, wedding cakes, bento cakes, layer cakes, bûches et pâtisseries fines. Livraison Val-d'Oise et Île-de-France.",
    "url": "https://dscreacakes.fr",
    "logo": "https://dscreacakes.fr/logo.png",
    "image": "https://dscreacakes.fr/logo.png",
    "telephone": "+33600000000",
    "email": "contact@dscreacakes.fr",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Val-d'Oise",
      "postalCode": "95000",
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
    "sameAs": [
      "https://www.instagram.com/dscreacakes"
    ]
  }

  // Produits avec offers pour éviter les erreurs Google
  const products = [
    {
      name: "Wedding Cake",
      description: "Gâteau de mariage sur mesure, élégant et personnalisé",
      price: "150",
    },
    {
      name: "Bento Cake",
      description: "Mini gâteau individuel personnalisé, idéal pour surprendre",
      price: "25",
    },
    {
      name: "Layer Cake",
      description: "Gâteau à étages moelleux avec ganache ou crème",
      price: "45",
    },
    {
      name: "Number Cake",
      description: "Gâteau en forme de chiffre ou lettre",
      price: "55",
    },
    {
      name: "Gâteau d'anniversaire",
      description: "Création unique et personnalisée pour célébrer",
      price: "40",
    },
    {
      name: "Bûche de Noël",
      description: "Bûche artisanale pour les fêtes de fin d'année",
      price: "35",
    },
    {
      name: "Cupcakes",
      description: "Petits gâteaux décorés, parfaits pour les événements",
      price: "3",
    },
    {
      name: "Cookies artisanaux",
      description: "Cookies moelleux faits maison",
      price: "2",
    },
    {
      name: "Cake Design",
      description: "Gâteau sculptée avec décoration personnalisée",
      price: "80",
    },
    {
      name: "Drip Cake",
      description: "Gâteau avec effet coulant de chocolat ou caramel",
      price: "50",
    },
  ]

  const productsSchema = products.map((product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": "https://dscreacakes.fr/logo.png",
    "brand": {
      "@type": "Brand",
      "name": "D&S Créa'Cakes"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": product.price,
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
      "url": "https://dscreacakes.fr/quote"
    }
  }))

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
      {productsSchema.map((product, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(product),
          }}
        />
      ))}
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
