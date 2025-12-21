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
      <section className="bg-secondary py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-lg rounded-lg bg-card p-8 shadow-lg">
            <span className="text-6xl">📩</span>
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
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Nous Contacter
          </span>
          <h1 className="mb-4 font-serif text-5xl font-light text-accent md:text-6xl">
            Restons en <span className="font-medium text-primary">Contact</span>
          </h1>
        </div>
      </section>

      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 font-serif text-3xl font-medium text-accent">Informations</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">📍</span>
                    <div>
                      <h3 className="font-semibold text-accent">Adresse</h3>
                      <p className="text-muted-foreground">Paris et Île-de-France</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">📧</span>
                    <div>
                      <h3 className="font-semibold text-accent">Email</h3>
                      <p className="text-muted-foreground">contact@dscreacakes.fr</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">📸</span>
                    <div>
                      <h3 className="font-semibold text-accent">Instagram</h3>
                      <a 
                        href="https://www.instagram.com/dscrea_cakes/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        @dscrea_cakes
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">🎵</span>
                    <div>
                      <h3 className="font-semibold text-accent">TikTok</h3>
                      <a 
                        href="https://www.tiktok.com/@ds.creacakes" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        @ds.creacakes
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-secondary p-6">
                <h3 className="mb-2 font-serif text-xl font-medium text-accent">Horaires</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Lundi - Vendredi : 9h - 18h</li>
                  <li>Samedi : 10h - 16h</li>
                  <li>Dimanche : Fermé</li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                  className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-accent px-6 py-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50"
              >
                {loading ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
