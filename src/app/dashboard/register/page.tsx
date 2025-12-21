"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import Link from "next/link"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [acceptMarketing, setAcceptMarketing] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Create user profile in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        name,
        acceptMarketing,
        createdAt: new Date().toISOString(),
      })

      // Send welcome email
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "welcome",
          name,
          email,
        }),
      })

      router.push("/dashboard")
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("email-already-in-use")) {
        setError("Cet email est déjà utilisé")
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-medium text-accent">Inscription</h1>
          <p className="mt-2 text-muted-foreground">Créez votre compte pour suivre vos commandes</p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-accent">
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-accent">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-accent">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-accent">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          {/* Marketing opt-in */}
          <div className="flex items-start gap-3 rounded-lg border border-border p-4 bg-secondary/50">
            <input
              type="checkbox"
              id="acceptMarketing"
              checked={acceptMarketing}
              onChange={(e) => setAcceptMarketing(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="acceptMarketing" className="text-sm text-muted-foreground">
              <span className="font-medium text-accent">📧 Recevoir nos offres</span><br/>
              Soyez informé(e) en avant-première de nos offres spéciales et nouveautés !
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link href="/dashboard/login" className="block text-sm text-primary hover:underline">
            Déjà un compte ? Connectez-vous
          </Link>
          <Link href="/" className="block text-sm text-muted-foreground hover:text-primary">
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  )
}
