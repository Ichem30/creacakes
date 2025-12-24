import { MetadataRoute } from 'next'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dscreacakes.fr'
  
  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/nos-creations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/devis`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Pages produits dynamiques
  let productPages: MetadataRoute.Sitemap = []
  
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'))
    productPages = productsSnapshot.docs.map((doc) => ({
      url: `${baseUrl}/nos-creations/${doc.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
  }

  return [...staticPages, ...productPages]
}
