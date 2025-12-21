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
      <section className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <span className="text-6xl">🛒</span>
          <h1 className="mt-4 font-serif text-3xl font-medium text-accent">Votre panier est vide</h1>
          <p className="mt-4 text-muted-foreground">
            Découvrez nos délicieuses créations et ajoutez-les à votre panier.
          </p>
          <Link 
            href="/products" 
            className="mt-8 inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Voir nos créations
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl font-light text-accent">
            Votre <span className="font-medium text-primary">Panier</span>
          </h1>
        </div>
      </section>

      <section className="bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 rounded-lg border border-border p-4">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-medium text-accent">{item.name}</h3>
                        <p className="text-primary">{item.price}€</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center rounded-md border border-border">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-muted-foreground hover:text-accent"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-accent">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-muted-foreground hover:text-accent"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-muted-foreground hover:text-red-500"
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
              <div className="sticky top-24 rounded-lg border border-border bg-secondary p-6">
                <h2 className="mb-6 font-serif text-xl font-medium text-accent">Récapitulatif</h2>
                <div className="space-y-3 border-b border-border pb-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Sous-total</span>
                    <span>{totalPrice}€</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Livraison</span>
                    <span>{shipping === 0 ? "Gratuite" : `${shipping}€`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Livraison gratuite à partir de 100€
                    </p>
                  )}
                </div>
                <div className="flex justify-between py-4 font-serif text-xl font-semibold text-accent">
                  <span>Total</span>
                  <span>{total}€</span>
                </div>
                <Link 
                  href="/quote"
                  className="block w-full rounded-md bg-accent px-6 py-4 text-center text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Demander un devis
                </Link>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Paiement sécurisé • Livraison 24-48h
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
