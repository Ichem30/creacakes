"use client"

import Link from "next/link"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary py-20 md:py-32">
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-primary/40 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-2 h-2 rounded-full bg-primary/30 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-4 h-4 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-accent/20 animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-20 right-10 w-3 h-3 rounded-full bg-primary/30 animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <div className="space-y-8 text-center md:text-left">
            <div className="inline-block animate-fade-in-down">
              <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
                Pâtisserie Fine & Créations Uniques
              </span>
            </div>

            <h1 className="font-serif text-5xl font-light leading-[1.1] text-accent md:text-6xl lg:text-7xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              L&apos;art de la pâtisserie, <span className="font-medium text-primary">pour vos moments d&apos;exception</span>
            </h1>

            <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground md:mx-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Découvrez nos gâteaux artisanaux confectionnés avec passion et des ingrédients d&apos;exception pour sublimer
              toutes vos célébrations.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <Link 
                href="/nos-creations" 
                className="group relative inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-all duration-300 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-1"
              >
                <span className="relative z-10">Découvrir nos créations</span>
              </Link>
              <Link 
                href="/devis" 
                className="inline-flex items-center justify-center rounded-md border-2 border-accent bg-transparent px-6 py-3 text-sm font-medium text-accent transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:shadow-lg hover:-translate-y-1"
              >
                Demander un devis
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
            <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl hover:shadow-primary/30 group">
              <Image
                src="/elegant-multi-tier-wedding-cake-with-roses.jpg"
                alt="Gâteau de mariage d'exception"
                width={600}
                height={750}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              {/* Image overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            {/* Decorative border */}
            <div className="absolute -right-4 -top-4 -z-0 h-full w-full rounded-2xl border-2 border-primary/30 transition-all duration-300 group-hover:-right-6 group-hover:-top-6" />
            {/* Glow effect */}
            <div className="absolute inset-0 -z-10 rounded-2xl bg-primary/20 blur-3xl opacity-50" />
          </div>
        </div>
      </div>
    </section>
  )
}

