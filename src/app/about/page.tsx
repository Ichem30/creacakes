import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <>
      <section className="bg-secondary py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Notre Histoire
          </span>
          <h1 className="mb-4 font-serif text-5xl font-light text-accent md:text-6xl">
            À <span className="font-medium text-primary">Propos</span>
          </h1>
        </div>
      </section>

      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <div className="relative">
              <Image
                src="/images/image.png"
                alt="D&S Créa'Cakes"
                width={500}
                height={500}
                className="mx-auto rounded-2xl"
              />
            </div>
            <div className="space-y-6">
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

      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-serif text-3xl font-medium text-accent">
            Nos Engagements
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            <div className="rounded-lg bg-card p-6 text-center">
              <span className="mb-4 block text-4xl">🌿</span>
              <h3 className="mb-2 font-serif text-xl font-medium text-accent">Produits Locaux</h3>
              <p className="text-sm text-muted-foreground">
                Nous privilégions les producteurs locaux et les circuits courts.
              </p>
            </div>
            <div className="rounded-lg bg-card p-6 text-center">
              <span className="mb-4 block text-4xl">🎨</span>
              <h3 className="mb-2 font-serif text-xl font-medium text-accent">100% Artisanal</h3>
              <p className="text-sm text-muted-foreground">
                Chaque gâteau est fait main, avec amour et attention.
              </p>
            </div>
            <div className="rounded-lg bg-card p-6 text-center">
              <span className="mb-4 block text-4xl">🍃</span>
              <h3 className="mb-2 font-serif text-xl font-medium text-accent">Sans Conservateurs</h3>
              <p className="text-sm text-muted-foreground">
                Aucun additif ni conservateur dans nos créations.
              </p>
            </div>
            <div className="rounded-lg bg-card p-6 text-center">
              <span className="mb-4 block text-4xl">💝</span>
              <h3 className="mb-2 font-serif text-xl font-medium text-accent">Sur Mesure</h3>
              <p className="text-sm text-muted-foreground">
                Nous adaptons chaque gâteau à vos envies et allergies.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-accent py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-serif text-4xl font-light text-accent-foreground">
            Prêt à commander ?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-accent-foreground/80">
            Découvrez notre collection ou demandez un devis pour une création personnalisée.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/products" className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Voir nos créations
            </Link>
            <Link href="/quote" className="inline-flex items-center justify-center rounded-md border-2 border-accent-foreground/20 bg-transparent px-8 py-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-foreground/10">
              Demander un devis
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
