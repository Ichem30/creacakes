import Link from "next/link"

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-secondary">
      <div className="container mx-auto px-4 text-center">
        <span className="text-8xl">🎂</span>
        <h1 className="mt-6 font-serif text-6xl font-light text-accent md:text-7xl">
          4<span className="text-primary">0</span>4
        </h1>
        <h2 className="mt-4 font-serif text-2xl text-accent">
          Oups ! Cette page n&apos;existe pas
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Le gâteau que vous cherchez semble avoir été mangé... 
          Retournez à l&apos;accueil pour découvrir nos délicieuses créations !
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-md bg-accent px-8 py-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            ← Retour à l&apos;accueil
          </Link>
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center rounded-md border-2 border-accent bg-transparent px-8 py-4 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Voir nos gâteaux
          </Link>
        </div>
      </div>
    </section>
  )
}
