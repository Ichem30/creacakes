import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <>
      <section className="bg-secondary py-20 md:py-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-10 right-20 w-16 h-16 rounded-full bg-primary/15 animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent animate-fade-in-down">
            Notre Histoire
          </span>
          <h1 className="mb-4 font-serif text-5xl font-light text-accent md:text-6xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            À <span className="font-medium text-primary">Propos</span>
          </h1>
        </div>
      </section>

      <section className="bg-card py-20 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <div className="relative animate-fade-in-left">
              <Image
                src="/images/image.png"
                alt="D&S Créa'Cakes"
                width={500}
                height={500}
                className="mx-auto rounded-2xl drop-shadow-2xl animate-float"
              />
              <div className="absolute inset-0 -z-10 rounded-2xl bg-primary/20 blur-3xl opacity-50" />
            </div>
            <div className="space-y-6 animate-fade-in-right" style={{ animationDelay: '0.2s' }}>
              <h2 className="font-serif text-3xl font-medium text-accent">
                La passion du goût et du beau
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  D&S Créa&apos;Cakes est née d&apos;une passion pour la pâtisserie fine et l&apos;art du beau. 
                  Chaque création est le fruit d&apos;un savoir-faire artisanal transmis et perfectionné au fil des années.
                </p>
                <p>
                  Nous sélectionnons avec soin les meilleurs ingrédients : vanille de Madagascar, 
                  chocolat grand cru, fruits de saison et beurre AOP. Car la qualité des ingrédients 
                  fait toute la différence.
                </p>
                <p>
                  Que vous célébriez un mariage, un anniversaire, un baptême ou simplement le plaisir 
                  de se retrouver, nous mettons notre créativité et notre expertise à votre service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="mb-12 text-center font-serif text-3xl font-medium text-accent animate-fade-in-up">
            Nos Engagements
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            <div className="group glass rounded-xl p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10">
              <span className="mb-4 block text-4xl transition-transform duration-300 group-hover:scale-125 group-hover:animate-bounce-soft">🌿</span>
              <h3 className="mb-2 font-serif text-xl font-medium text-accent">Produits Locaux</h3>
              <p className="text-sm text-muted-foreground">
                Nous privilégions les producteurs locaux et les circuits courts.
              </p>
            </div>
            <div className="group glass rounded-xl p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10">
              <span className="mb-4 block text-4xl transition-transform duration-300 group-hover:scale-125 group-hover:animate-bounce-soft">🎨</span>
              <h3 className="mb-2 font-serif text-xl font-medium text-accent">100% Artisanal</h3>
              <p className="text-sm text-muted-foreground">
                Chaque gâteau est fait main, avec amour et attention.
              </p>
            </div>
            <div className="group glass rounded-xl p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10">
              <span className="mb-4 block text-4xl transition-transform duration-300 group-hover:scale-125 group-hover:animate-bounce-soft">🍃</span>
              <h3 className="mb-2 font-serif text-xl font-medium text-accent">Sans Conservateurs</h3>
              <p className="text-sm text-muted-foreground">
                Aucun additif ni conservateur dans nos créations.
              </p>
            </div>
            <div className="group glass rounded-xl p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10">
              <span className="mb-4 block text-4xl transition-transform duration-300 group-hover:scale-125 group-hover:animate-bounce-soft">💝</span>
              <h3 className="mb-2 font-serif text-xl font-medium text-accent">Sur Mesure</h3>
              <p className="text-sm text-muted-foreground">
                Nous adaptons chaque gâteau à vos envies et allergies.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent to-accent/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(232,180,184,0.3)_0%,transparent_50%)]" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="mb-4 font-serif text-4xl font-light text-accent-foreground animate-fade-in-up">
            Prêt à commander ?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-accent-foreground/80 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Découvrez notre collection ou demandez un devis pour une création personnalisée.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link 
              href="/products" 
              className="group relative inline-flex items-center justify-center rounded-md bg-primary px-10 py-4 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10">Voir nos créations</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            </Link>
            <Link 
              href="/quote" 
              className="inline-flex items-center justify-center rounded-md border-2 border-accent-foreground/30 bg-transparent px-10 py-4 text-sm font-medium text-accent-foreground transition-all duration-300 hover:bg-accent-foreground/10 hover:border-accent-foreground/50 hover:-translate-y-1 hover:shadow-lg"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

