import Link from "next/link"

export default function NotFound() {
  return (
    <section className="bg-secondary py-20 md:py-32 relative overflow-hidden min-h-[70vh] flex items-center">
      {/* Decorative floating elements */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-20 right-20 w-16 h-16 rounded-full bg-primary/15 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-10 h-10 rounded-full bg-accent/10 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 left-1/4 w-12 h-12 rounded-full bg-primary/10 animate-float" style={{ animationDelay: '1.5s' }} />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-fade-in-up">
          <span className="text-8xl block animate-bounce-soft mb-4">🎂</span>
        </div>
        
        <h1 className="mt-6 font-serif text-5xl font-light text-accent md:text-6xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="text-primary font-medium">404</span> - Page non trouvée
        </h1>
        
        <p className="mt-6 mx-auto max-w-lg text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Oups ! Cette page semble avoir été dévorée... Retournez à nos délicieuses créations !
        </p>
        
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Link 
            href="/" 
            className="group relative inline-flex items-center justify-center rounded-md bg-accent px-8 py-4 text-sm font-medium text-accent-foreground transition-all duration-300 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10">Retour à l&apos;accueil</span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
          </Link>
          <Link 
            href="/nos-creations" 
            className="inline-flex items-center gap-2 justify-center rounded-md border-2 border-accent bg-transparent px-8 py-4 text-sm font-medium text-accent transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:shadow-lg hover:-translate-y-1 group"
          >
            Voir nos gâteaux
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
