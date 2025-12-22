"use client"

import { useState } from "react"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"

export default function ContactPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    subject: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Save to Firestore
      await addDoc(collection(db, "contacts"), {
        ...formData,
        userId: user?.uid || null,
        status: "new",
        createdAt: new Date().toISOString(),
      })

      // Send email via Mailgun
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          type: "contact"
        }),
      })

      setSubmitted(true)
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Erreur lors de l'envoi du message. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="bg-secondary py-20 md:py-32 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/20 animate-float" />
        <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-primary/15 animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mx-auto max-w-lg glass rounded-xl p-10 shadow-xl animate-scale-in">
            <span className="text-6xl block animate-bounce-soft">📩</span>
            <h1 className="mt-4 font-serif text-3xl font-medium text-accent">Message envoyé !</h1>
            <p className="mt-4 text-muted-foreground">
              Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="bg-secondary py-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-10 right-20 w-16 h-16 rounded-full bg-primary/15 animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent animate-fade-in-down">
            Nous Contacter
          </span>
          <h1 className="mb-4 font-serif text-5xl font-light text-accent md:text-6xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Restons en <span className="font-medium text-primary">Contact</span>
          </h1>
        </div>
      </section>

      <section className="bg-card py-20 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Contact Info */}
            <div className="space-y-8 animate-fade-in-left">
              <div>
                <h2 className="mb-6 font-serif text-3xl font-medium text-accent">Informations</h2>
                <div className="space-y-4">
                  <div className="group flex items-start gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-secondary cursor-default">
                    <span className="text-2xl transition-transform duration-300 group-hover:scale-125">📍</span>
                    <div>
                      <h3 className="font-semibold text-accent">Adresse</h3>
                      <p className="text-muted-foreground">Val-d&apos;Oise (95) et environs</p>
                    </div>
                  </div>
                  <div className="group flex items-start gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-secondary cursor-default">
                    <span className="text-2xl transition-transform duration-300 group-hover:scale-125">📧</span>
                    <div>
                      <h3 className="font-semibold text-accent">Email</h3>
                      <p className="text-muted-foreground">contact@dscreacakes.fr</p>
                    </div>
                  </div>
                  <div className="group flex items-start gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-secondary">
                    <svg className="w-6 h-6 mt-1 text-primary transition-transform duration-300 group-hover:scale-125" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <div>
                      <h3 className="font-semibold text-accent">Instagram</h3>
                      <a 
                        href="https://www.instagram.com/dscrea_cakes/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary underline-animation"
                      >
                        @dscrea_cakes
                      </a>
                    </div>
                  </div>
                  <div className="group flex items-start gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-secondary">
                    <svg className="w-6 h-6 mt-1 text-primary transition-transform duration-300 group-hover:scale-125" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    <div>
                      <h3 className="font-semibold text-accent">TikTok</h3>
                      <a 
                        href="https://www.tiktok.com/@ds.creacakes" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary underline-animation"
                      >
                        @ds.creacakes
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
                <h3 className="mb-2 font-serif text-xl font-medium text-accent">Horaires</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex justify-between"><span>Lundi - Vendredi</span><span className="font-medium">9h - 18h</span></li>
                  <li className="flex justify-between"><span>Samedi</span><span className="font-medium">10h - 16h</span></li>
                  <li className="flex justify-between"><span>Dimanche</span><span className="font-medium text-primary">Fermé</span></li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-right" style={{ animationDelay: '0.2s' }}>
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-accent">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-accent">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-accent">
                  Sujet *
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-accent">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full rounded-md bg-accent px-6 py-4 text-sm font-medium text-accent-foreground transition-all duration-300 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/20 hover:-translate-y-1 disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
              >
                <span className="relative z-10">{loading ? "Envoi en cours..." : "Envoyer le message"}</span>
                {!loading && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

