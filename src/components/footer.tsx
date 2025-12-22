import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/40 bg-accent text-accent-foreground relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="mb-6">
              <span className="font-serif text-3xl font-semibold text-primary">D&S Créa&apos;Cakes</span>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-accent-foreground/60">Pâtisserie Fine</p>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-accent-foreground/80">
              Artisan pâtissier passionné, créateur de moments sucrés inoubliables.
            </p>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="mb-6 font-serif text-xl font-medium text-primary">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-accent-foreground/80 transition-all duration-300 hover:text-primary hover:translate-x-1 inline-block">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-accent-foreground/80 transition-all duration-300 hover:text-primary hover:translate-x-1 inline-block">
                  Nos Gâteaux
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-accent-foreground/80 transition-all duration-300 hover:text-primary hover:translate-x-1 inline-block">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-accent-foreground/80 transition-all duration-300 hover:text-primary hover:translate-x-1 inline-block">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div id="contact" className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="mb-6 font-serif text-xl font-medium text-primary">Contact</h3>
            <ul className="space-y-3 text-sm text-accent-foreground/80">
              <li className="flex items-center gap-2 group">
                <span className="transition-transform duration-300 group-hover:scale-125">📍</span> 
                <span className="transition-colors duration-300 group-hover:text-primary">Paris et Île-de-France</span>
              </li>
              <li className="flex items-center gap-2 group">
                <span className="transition-transform duration-300 group-hover:scale-125">📧</span> 
                <span className="transition-colors duration-300 group-hover:text-primary">contact@dscreacakes.fr</span>
              </li>
              <li>
                <a href="https://www.instagram.com/dscrea_cakes/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-all duration-300 hover:text-primary group">
                  <span className="transition-transform duration-300 group-hover:scale-125">📸</span> 
                  <span className="underline-animation">@dscrea_cakes</span>
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@ds.creacakes" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-all duration-300 hover:text-primary group">
                  <span className="transition-transform duration-300 group-hover:scale-125">🎵</span> 
                  <span className="underline-animation">@ds.creacakes</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-accent-foreground/10 py-6 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-accent-foreground/60">
            © {new Date().getFullYear()} D&S Créa&apos;Cakes. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}

