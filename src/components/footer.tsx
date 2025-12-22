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
                <span className="transition-colors duration-300 group-hover:text-primary">Val-d&apos;Oise (95) et environs</span>
              </li>
              <li className="flex items-center gap-2 group">
                <span className="transition-transform duration-300 group-hover:scale-125">📧</span> 
                <span className="transition-colors duration-300 group-hover:text-primary">contact@dscreacakes.fr</span>
              </li>
              <li>
                <a href="https://www.instagram.com/dscrea_cakes/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-all duration-300 hover:text-primary group">
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-125" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span className="underline-animation">@dscrea_cakes</span>
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@ds.creacakes" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-all duration-300 hover:text-primary group">
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-125" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
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

