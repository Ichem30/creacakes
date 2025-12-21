"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  createdAt: string
}

export default function MessagesPage() {
  const { isAdmin } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    if (!isAdmin) {
      router.push("/dashboard")
      return
    }
    fetchMessages()
  }, [isAdmin, router])

  async function fetchMessages() {
    try {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage))
      setMessages(data)
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(messageId: string) {
    try {
      await updateDoc(doc(db, "contacts", messageId), { status: "read" })
      setMessages(messages.map(m => m.id === messageId ? { ...m, status: "read" } : m))
    } catch (error) {
      console.error("Error updating message:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-medium text-accent">Messages de contact</h1>

      {messages.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <span className="text-6xl">📭</span>
          <h2 className="mt-4 font-serif text-xl font-medium text-accent">Aucun message</h2>
          <p className="mt-2 text-muted-foreground">Les messages du formulaire de contact apparaîtront ici.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Message List */}
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                onClick={() => {
                  setSelectedMessage(message)
                  if (message.status === "new") markAsRead(message.id)
                }}
                className={`cursor-pointer rounded-lg border p-4 transition-colors hover:border-primary ${
                  selectedMessage?.id === message.id ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-accent">{message.name}</h3>
                      {message.status === "new" && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                          Nouveau
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{message.subject}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{message.message}</p>
              </div>
            ))}
          </div>

          {/* Selected Message */}
          {selectedMessage && (
            <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-xl font-medium text-accent">{selectedMessage.subject}</h2>
                <span className="text-sm text-muted-foreground">
                  {new Date(selectedMessage.createdAt).toLocaleString("fr-FR")}
                </span>
              </div>
              <div className="mb-4 space-y-2 border-b border-border pb-4">
                <p className="text-sm">
                  <span className="font-medium text-accent">De :</span>{" "}
                  <span className="text-muted-foreground">{selectedMessage.name}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-accent">Email :</span>{" "}
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                    {selectedMessage.email}
                  </a>
                </p>
              </div>
              <p className="whitespace-pre-wrap text-muted-foreground">{selectedMessage.message}</p>
              <div className="mt-6">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
                >
                  📧 Répondre par email
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
