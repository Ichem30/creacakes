"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart()

  const shipping = totalPrice >= 100 ? 0 : 15
  const total = totalPrice + shipping

  if (items.length === 0) {
    return (
      <section className="bg-card py-20 md:py-32 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/20 animate-float" />
        <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-primary/15 animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="text-6xl block animate-bounce-soft">🛒</span>
          <h1 className="mt-4 font-serif text-3xl font-medium text-accent animate-fade-in-up">Votre panier est vide</h1>
          <p className="mt-4 text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Découvrez nos délicieuses créations et ajoutez-les à votre panier.
          </p>
          <Link 
            href="/nos-creations" 
            className="mt-8 inline-flex items-center gap-2 justify-center rounded-md bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition-all duration-300 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-1 animate-fade-in-up group"
            style={{ animationDelay: '0.2s' }}
          >
            Voir nos créations
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-light text-accent animate-fade-in-up">
            Votre <span className="font-medium text-primary">Panier</span>
          </h1>
        </div>
      </section>

      <section className="bg-card py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="group flex gap-4 rounded-lg border border-border p-4 bg-background transition-all duration-300 hover:shadow-lg hover:border-primary/30 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden rounded-lg">
                      <Image
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="h-24 w-24 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-medium text-accent transition-colors duration-300 group-hover:text-primary">{item.name}</h3>
                        <p className="text-primary font-medium">{item.price}€</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center rounded-md border border-border overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-muted-foreground hover:text-accent hover:bg-secondary transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-accent bg-background">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-muted-foreground hover:text-accent hover:bg-secondary transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-lg font-semibold text-accent">
                        {item.price * item.quantity}€
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 glass rounded-xl p-6 animate-fade-in-right">
                <h2 className="mb-6 font-serif text-xl font-medium text-accent">Récapitulatif</h2>
                <div className="space-y-3 border-b border-border pb-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Sous-total</span>
                    <span className="font-medium">{totalPrice}€</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Livraison</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium"}>{shipping === 0 ? "Gratuite ✓" : `${shipping}€`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground bg-secondary/50 rounded-md px-2 py-1">
                      💡 Livraison gratuite à partir de 100€
                    </p>
                  )}
                </div>
                <div className="flex justify-between py-4 font-serif text-xl font-semibold text-accent">
                  <span>Total</span>
                  <span className="text-primary">{total}€</span>
                </div>
                <Link 
                  href="/devis"
                  className="group relative block w-full rounded-md bg-accent px-6 py-4 text-center text-sm font-medium text-accent-foreground transition-all duration-300 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10">Demander un devis</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                </Link>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  🔒 Paiement sécurisé • 🚚 Livraison 24-48h
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

