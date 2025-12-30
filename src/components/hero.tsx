"use client"

import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-40 left-1/4 w-20 h-20 rounded-full bg-primary/15 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-accent/10 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-primary/10 animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-left">
            <div>
              <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Pâtisserie Fine & Créations Uniques
              </span>
              <h1 className="font-serif text-5xl font-light leading-tight text-accent md:text-6xl lg:text-7xl">
                L&apos;art de la pâtisserie,
                <span className="block font-medium text-primary">pour vos moments d&apos;exception</span>
              </h1>
            </div>
            
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              Découvrez nos gâteaux artisanaux confectionnés avec passion et des 
              ingrédients d&apos;exception pour sublimer toutes vos célébrations.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link 
                href="/nos-creations" 
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-accent px-8 py-4 text-sm font-medium text-accent-foreground transition-all duration-300 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-1"
              >
                Découvrir nos créations
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="/devis" 
                className="inline-flex items-center justify-center rounded-md border-2 border-accent bg-transparent px-8 py-4 text-sm font-medium text-accent transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:shadow-lg hover:-translate-y-1"
              >
                Demander un devis
              </Link>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative mx-auto max-w-lg animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl group">
                <Image 
                  src="/hero-bg.png" 
                  alt="Gâteau de mariage élégant" 
                  width={600} 
                  height={700}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="absolute -right-4 -top-4 -z-10 h-full w-full rounded-2xl border-2 border-primary/30" />
              <div className="absolute inset-0 -z-10 rounded-2xl bg-primary/20 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
