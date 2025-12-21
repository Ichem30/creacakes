import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/40 bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="mb-6">
              <span className="font-serif text-3xl font-semibold text-primary">D&S Créa&apos;Cakes</span>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-accent-foreground/60">Pâtisserie Fine</p>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-accent-foreground/80">
              Artisan pâtissier passionné, créateur de moments sucrés inoubliables.
            </p>
          </div>

          <div>
            <h3 className="mb-6 font-serif text-xl font-medium text-primary">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-accent-foreground/80 transition-colors hover:text-primary">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-accent-foreground/80 transition-colors hover:text-primary">
                  Nos Gâteaux
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-accent-foreground/80 transition-colors hover:text-primary">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-accent-foreground/80 transition-colors hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div id="contact">
            <h3 className="mb-6 font-serif text-xl font-medium text-primary">Contact</h3>
            <ul className="space-y-3 text-sm text-accent-foreground/80">
              <li>📍 Paris et Île-de-France</li>
              <li>📧 contact@dscreacakes.fr</li>
              <li>
                <a href="https://www.instagram.com/dscrea_cakes/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary">
                  📸 @dscrea_cakes
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@ds.creacakes" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary">
                  🎵 @ds.creacakes
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-accent-foreground/10 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-accent-foreground/60">
            © {new Date().getFullYear()} D&S Créa&apos;Cakes. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
