"use client"

import { useEffect, useState, useRef } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"

interface Subscriber {
  id: string
  email: string
  name: string
}

export default function NewsletterPage() {
  const { isAdmin } = useAuth()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  async function fetchSubscribers() {
    try {
      const q = query(collection(db, "users"), where("acceptMarketing", "==", true))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        email: doc.data().email,
        name: doc.data().name || "Client",
      }))
      setSubscribers(data)
    } catch (error) {
      console.error("Error fetching subscribers:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileRef = ref(storage, `newsletters/${Date.now()}_${file.name}`)
      await uploadBytes(fileRef, file)
      const url = await getDownloadURL(fileRef)
      setImageUrl(url)
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Erreur lors de l'upload de l'image")
    } finally {
      setUploading(false)
    }
  }

  async function sendNewsletter(e: React.FormEvent) {
    e.preventDefault()
    if (!subject || !message || subscribers.length === 0) return

    if (!confirm(`Envoyer cet email à ${subscribers.length} abonné(s) ?`)) return

    setSending(true)
    setProgress(0)
    
    let successCount = 0
    
    for (let i = 0; i < subscribers.length; i++) {
      const subscriber = subscribers[i]
      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "newsletter",
            email: subscriber.email,
            name: subscriber.name,
            subject,
            message,
            imageUrl,
          }),
        })
        successCount++
      } catch (error) {
        console.error(`Error sending to ${subscriber.email}:`, error)
      }
      setProgress(Math.round(((i + 1) / subscribers.length) * 100))
    }

    setSending(false)
    setSent(true)
    alert(`✅ Email envoyé à ${successCount}/${subscribers.length} abonné(s)`)
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Accès réservé aux administrateurs</p>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl font-medium text-accent">📧 Newsletter</h1>
      <p className="mb-8 text-muted-foreground">
        Envoyer un email à tous les utilisateurs qui ont accepté de recevoir vos offres
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-xl font-medium text-accent">Composer</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {subscribers.length} abonné{subscribers.length > 1 ? "s" : ""}
            </span>
          </div>

          {subscribers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <span className="text-4xl">📭</span>
              <p className="mt-2">Aucun abonné pour le moment</p>
            </div>
          ) : (
            <form onSubmit={sendNewsletter} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-accent">Objet</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Nouvelle offre spéciale ! 🎂"
                  required
                  className="w-full rounded-md border border-border bg-background px-4 py-3 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-accent">Image (optionnel)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary disabled:opacity-50"
                  >
                    {uploading ? "Upload..." : imageUrl ? "Changer l'image" : "📷 Ajouter une image"}
                  </button>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="mt-2 max-h-40 rounded-md" />
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-accent">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écrivez votre message ici..."
                  required
                  rows={6}
                  className="w-full rounded-md border border-border bg-background px-4 py-3 focus:border-primary focus:outline-none"
                />
              </div>

              {sending && (
                <div className="rounded-md bg-secondary p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Envoi en cours...</span>
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-border overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={sending || !subject || !message}
                className="w-full rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
              >
                {sending ? "Envoi en cours..." : `📨 Envoyer à ${subscribers.length} abonné(s)`}
              </button>
            </form>
          )}
        </div>

        {/* Preview */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-6 font-serif text-xl font-medium text-accent">Aperçu</h2>
          
          <div className="rounded-lg overflow-hidden shadow-lg" style={{ maxWidth: "500px", margin: "0 auto" }}>
            {/* Email container */}
            <div style={{ backgroundColor: "#f5f0eb", padding: "20px" }}>
              <div style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}>
                {/* Header with Logo */}
                <div style={{ 
                  background: "linear-gradient(135deg, #f9d5d4 0%, #f5e6e3 100%)", 
                  padding: "30px", 
                  textAlign: "center" 
                }}>
                  <img 
                    src="/logo.png" 
                    alt="D&S Créa'Cakes" 
                    style={{ width: "100px", height: "auto", display: "block", margin: "0 auto" }}
                  />
                </div>

                {/* Content */}
                <div style={{ padding: "30px" }}>
                  <h1 style={{ 
                    margin: "0 0 15px 0", 
                    fontFamily: "Georgia, serif", 
                    fontSize: "22px", 
                    color: "#4a3428",
                    fontWeight: 600,
                    textAlign: "center"
                  }}>
                    {subject || "Objet de l'email"}
                  </h1>
                  
                  <p style={{ margin: "0 0 15px 0", fontSize: "14px", lineHeight: 1.6, color: "#5c4a42" }}>
                    Bonjour [Prénom],
                  </p>
                  
                  {imageUrl && (
                    <img 
                      src={imageUrl} 
                      alt="Newsletter" 
                      style={{ 
                        width: "100%", 
                        height: "auto", 
                        borderRadius: "8px", 
                        marginBottom: "15px",
                        display: "block"
                      }}
                    />
                  )}
                  
                  <div style={{ 
                    fontSize: "14px", 
                    lineHeight: 1.8, 
                    color: "#5c4a42", 
                    whiteSpace: "pre-wrap" 
                  }}>
                    {message || "Votre message apparaîtra ici..."}
                  </div>
                  
                  <div style={{ marginTop: "25px", textAlign: "center" }}>
                    <span style={{ 
                      display: "inline-block", 
                      padding: "12px 35px", 
                      backgroundColor: "#d4a574", 
                      color: "#ffffff", 
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "14px",
                      boxShadow: "0 2px 8px rgba(212, 165, 116, 0.3)"
                    }}>
                      Voir nos créations
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ 
                  padding: "20px", 
                  backgroundColor: "#4a3428", 
                  textAlign: "center" 
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#f5e6e3", fontWeight: 600 }}>
                    D&S Créa&apos;Cakes
                  </p>
                  <p style={{ margin: "0 0 10px 0", fontSize: "11px", color: "#d4a574" }}>
                    Pâtisseries artisanales & créations personnalisées
                  </p>
                  <p style={{ margin: "0", fontSize: "10px", color: "#a08d7f" }}>
                    Instagram • TikTok • Site Web
                  </p>
                  <p style={{ margin: "10px 0 0 0", fontSize: "9px", color: "#a08d7f" }}>
                    © 2025 D&S Créa&apos;Cakes · <span style={{textDecoration: "underline"}}>Gérer mes préférences</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribers list */}
      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 font-serif text-xl font-medium text-accent">Liste des abonnés ({subscribers.length})</h2>
        {subscribers.length === 0 ? (
          <p className="text-muted-foreground">Aucun abonné</p>
        ) : (
          <div className="divide-y divide-border">
            {subscribers.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-accent">{sub.name}</p>
                  <p className="text-sm text-muted-foreground">{sub.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
