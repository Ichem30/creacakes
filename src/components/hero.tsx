import Link from "next/link"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          <div className="space-y-8 text-center md:text-left">
            <div className="inline-block">
              <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Pâtisserie Fine & Créations Uniques
              </span>
            </div>

            <h1 className="font-serif text-5xl font-light leading-[1.1] text-accent md:text-6xl lg:text-7xl">
              L&apos;art de la pâtisserie, <span className="font-medium text-primary">pour vos moments d&apos;exception</span>
            </h1>

            <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground md:mx-0">
              Découvrez nos gâteaux artisanaux confectionnés avec passion et des ingrédients d&apos;exception pour sublimer
              toutes vos célébrations.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
              <Link href="/products" className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90">
                Découvrir nos créations
              </Link>
              <Link href="/quote" className="inline-flex items-center justify-center rounded-md border-2 border-accent bg-transparent px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground">
                Demander un devis
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/elegant-multi-tier-wedding-cake-with-roses.jpg"
                alt="Gâteau de mariage d'exception"
                width={600}
                height={750}
                className="aspect-[4/5] w-full object-cover"
                priority
              />
            </div>
            <div className="absolute -right-4 -top-4 -z-0 h-full w-full rounded-2xl border-2 border-primary/30" />
          </div>
        </div>
      </div>
    </section>
  )
}
