"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  doc, 
  getDoc, 
  updateDoc, 
  addDoc,
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import Image from "next/image"

interface SelectedProduct {
  productId: string
  productName: string
  quantity: number
  price: number
}

interface Quote {
  id: string
  userId?: string
  name: string
  email: string
  phone: string
  eventType: string
  customEventType?: string
  eventDate: string
  guests: string
  budget: string
  description: string
  selectedProducts?: SelectedProduct[]
  estimatedTotal?: number
  status: string
  createdAt: string
}

interface Message {
  id: string
  text: string
  fileUrl?: string
  fileName?: string
  fileType?: string
  senderId: string
  senderName: string
  isAdmin: boolean
  createdAt: Timestamp
}

const statusLabels: Record<string, string> = {
  new: "Nouveau",
  contacted: "Contacté",
  quoted: "Devis envoyé",
  accepted: "Accepté",
  declined: "Refusé",
  converted: "Converti en commande",
}

const statusColors: Record<string, string> = {
  new: "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  quoted: "bg-purple-100 text-purple-700",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
  converted: "bg-emerald-100 text-emerald-700",
}

export default function QuoteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const quoteId = params.id as string
  const { user, isAdmin } = useAuth()
  
  const [quote, setQuote] = useState<Quote | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [converting, setConverting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!quoteId) return
    fetchQuote()
    subscribeToMessages()
  }, [quoteId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function fetchQuote() {
    try {
      const docRef = doc(db, "quotes", quoteId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setQuote({ id: docSnap.id, ...docSnap.data() } as Quote)
      }
    } catch (error) {
      console.error("Error fetching quote:", error)
    } finally {
      setLoading(false)
    }
  }

  function subscribeToMessages() {
    const q = query(
      collection(db, "quotes", quoteId, "messages"),
      orderBy("createdAt", "asc")
    )

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message))
      setMessages(data)
    })
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    const messageText = newMessage.trim()

    try {
      await addDoc(collection(db, "quotes", quoteId, "messages"), {
        text: messageText,
        senderId: user.uid,
        senderName: isAdmin ? "D&S Créa'Cakes" : (user.displayName || user.email || "Client"),
        isAdmin: isAdmin,
        createdAt: serverTimestamp(),
      })
      
      if (isAdmin && quote?.status === "new") {
        await updateDoc(doc(db, "quotes", quoteId), { status: "contacted" })
        setQuote(prev => prev ? { ...prev, status: "contacted" } : null)
      }
      
      // Send email notification to recipient
      if (quote) {
        const recipientEmail = isAdmin ? quote.email : process.env.NEXT_PUBLIC_ADMIN_EMAIL || "contact@dscreacakes.fr"
        const recipientName = isAdmin ? quote.name : "D&S Créa'Cakes"
        
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "quoteMessage",
            recipientEmail,
            recipientName,
            senderName: isAdmin ? "D&S Créa'Cakes" : (user.displayName || user.email || quote.name),
            message: messageText,
            quoteId: quote.id,
            isAdmin,
          }),
        }).catch(console.error) // Non-blocking
      }
      
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    try {
      // Upload to Firebase Storage
      const fileRef = ref(storage, `conversations/${quoteId}/${Date.now()}_${file.name}`)
      await uploadBytes(fileRef, file)
      const fileUrl = await getDownloadURL(fileRef)

      // Determine file type
      const isImage = file.type.startsWith("image/")
      
      // Save message with file
      await addDoc(collection(db, "quotes", quoteId, "messages"), {
        text: isImage ? "📷 Image envoyée" : `📎 ${file.name}`,
        fileUrl: fileUrl,
        fileName: file.name,
        fileType: isImage ? "image" : "document",
        senderId: user.uid,
        senderName: isAdmin ? "D&S Créa'Cakes" : (user.displayName || user.email || "Client"),
        isAdmin: isAdmin,
        createdAt: serverTimestamp(),
      })

      if (isAdmin && quote?.status === "new") {
        await updateDoc(doc(db, "quotes", quoteId), { status: "contacted" })
        setQuote(prev => prev ? { ...prev, status: "contacted" } : null)
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Erreur lors de l'envoi du fichier")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function updateStatus(newStatus: string) {
    if (!isAdmin) return
    try {
      await updateDoc(doc(db, "quotes", quoteId), { status: newStatus })
      setQuote(prev => prev ? { ...prev, status: newStatus } : null)
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  async function convertToOrder() {
    if (!isAdmin || !quote) return
    setConverting(true)
    
    try {
      const orderRef = await addDoc(collection(db, "orders"), {
        userId: quote.userId || null,
        quoteId: quote.id,
        customerName: quote.name,
        customerEmail: quote.email,
        customerPhone: quote.phone,
        eventType: quote.eventType,
        customEventType: quote.customEventType || null,
        eventDate: quote.eventDate,
        guests: quote.guests,
        products: quote.selectedProducts || [],
        total: quote.estimatedTotal || 0,
        description: quote.description,
        status: "pending",
        createdAt: new Date().toISOString(),
      })

      await updateDoc(doc(db, "quotes", quoteId), { status: "converted" })
      setQuote(prev => prev ? { ...prev, status: "converted" } : null)
      
      // Send order confirmation email to customer
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "orderConfirmation",
          email: quote.email,
          name: quote.name,
          orderId: orderRef.id,
          eventDate: quote.eventDate,
          products: quote.selectedProducts || [],
          total: quote.estimatedTotal || 0,
        }),
      }).catch(console.error)
      
      alert("✅ Commande créée avec succès !")
      router.push("/dashboard/orders")
    } catch (error) {
      console.error("Error converting quote:", error)
      alert("Erreur lors de la conversion")
    } finally {
      setConverting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  if (!quote) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Devis non trouvé</p>
        <Link href="/dashboard/quotes" className="mt-4 inline-block text-primary hover:underline">
          ← Retour aux devis
        </Link>
      </div>
    )
  }

  if (!isAdmin && quote.userId !== user?.uid) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Vous n&apos;avez pas accès à ce devis</p>
      </div>
    )
  }

  return (
    <div>
      <Link href="/dashboard/quotes" className="mb-4 inline-block text-sm text-muted-foreground hover:text-primary">
        ← Retour aux devis
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quote Details */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="font-serif text-2xl font-medium text-accent">{quote.name}</h1>
              <p className="text-muted-foreground">{quote.email}</p>
              {quote.phone && <p className="text-muted-foreground">{quote.phone}</p>}
            </div>
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[quote.status]}`}>
              {statusLabels[quote.status]}
            </span>
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-xs font-medium text-muted-foreground">Type d&apos;événement</span>
                <p className="text-accent">{quote.eventType === "autre" ? quote.customEventType : quote.eventType}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground">Date</span>
                <p className="text-accent">{quote.eventDate}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground">Personnes</span>
                <p className="text-accent">{quote.guests || "Non spécifié"}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground">Budget</span>
                <p className="text-accent">{quote.budget || "Non spécifié"}</p>
              </div>
            </div>

            {quote.selectedProducts && quote.selectedProducts.length > 0 && (
              <div className="border-t border-border pt-4">
                <span className="text-xs font-medium text-muted-foreground">Produits</span>
                <div className="mt-2 space-y-2">
                  {quote.selectedProducts.map((p, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{p.productName} x{p.quantity}</span>
                      <span className="font-medium">{p.price * p.quantity}€</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 flex justify-between font-medium text-primary">
                    <span>Total estimé</span>
                    <span>{quote.estimatedTotal}€</span>
                  </div>
                </div>
              </div>
            )}

            {quote.description && (
              <div className="border-t border-border pt-4">
                <span className="text-xs font-medium text-muted-foreground">Description</span>
                <p className="mt-1 text-sm text-accent">{quote.description}</p>
              </div>
            )}
          </div>

          {isAdmin && quote.status !== "converted" && (
            <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-4">
              <select
                value={quote.status}
                onChange={(e) => updateStatus(e.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="new">Nouveau</option>
                <option value="contacted">Contacté</option>
                <option value="quoted">Devis envoyé</option>
                <option value="accepted">Accepté</option>
                <option value="declined">Refusé</option>
              </select>
              <button
                onClick={convertToOrder}
                disabled={converting}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {converting ? "..." : "✅ Convertir en commande"}
              </button>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex flex-col rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <h2 className="font-serif text-lg font-medium text-accent">💬 Conversation</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "400px" }}>
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                <div>
                  <span className="text-3xl">💬</span>
                  <p className="mt-2">Aucun message pour le moment</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isAdmin ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 ${
                        msg.isAdmin
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      <p className="text-xs font-semibold opacity-80 mb-1">
                        {msg.isAdmin ? "🏪 D&S Créa'Cakes" : msg.senderName}
                      </p>
                      
                      {/* File attachment */}
                      {msg.fileUrl && msg.fileType === "image" && (
                        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="block mb-2">
                          <Image 
                            src={msg.fileUrl} 
                            alt={msg.fileName || "Image"} 
                            width={200} 
                            height={200}
                            className="rounded-md max-w-full h-auto"
                          />
                        </a>
                      )}
                      {msg.fileUrl && msg.fileType === "document" && (
                        <a 
                          href={msg.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mb-2 flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                        >
                          📎 {msg.fileName}
                        </a>
                      )}
                      
                      {!msg.fileUrl && <p className="text-sm">{msg.text}</p>}
                      
                      {msg.createdAt && (
                        <p className="text-[10px] opacity-60 mt-1">
                          {msg.createdAt.toDate?.().toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit"
                          }) || ""}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t border-border p-4">
            <div className="flex gap-2">
              {/* File upload button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary disabled:opacity-50"
                title="Joindre un fichier"
              >
                {uploading ? "⏳" : "📎"}
              </button>
              
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez un message..."
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
